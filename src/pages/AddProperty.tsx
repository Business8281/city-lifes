import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { propertyTypes } from "@/data/properties";

const categoryConfigs = {
  apartment: { 
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Lift", "Power Backup", "Garden", "Club House", "Water Supply", "Maintenance Staff"],
    fields: ["bedrooms", "bathrooms", "area"]
  },
  house: { 
    amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply"],
    fields: ["bedrooms", "bathrooms", "area"]
  },
  flat: { 
    amenities: ["Parking", "Lift", "Security", "Water Supply", "Maintenance Staff"],
    fields: ["bedrooms", "bathrooms", "area"]
  },
  commercial: { 
    amenities: ["Parking", "Security", "Water Supply", "Power Backup"],
    fields: ["area"]
  },
  office: { 
    amenities: ["Parking", "Cafeteria", "Conference Room", "High-Speed Internet", "Security"],
    fields: ["area"]
  },
  farmland: { 
    amenities: ["Water Supply", "Power Backup"],
    fields: ["area"]
  },
  pg: { 
    amenities: ["Parking", "Gym", "Security", "Lift", "Power Backup", "Water Supply", "Maintenance Staff"],
    fields: ["bedrooms", "bathrooms"]
  },
  hostel: { 
    amenities: ["Cafeteria", "Gym", "Security", "Lift", "Power Backup", "Water Supply", "Maintenance Staff"],
    fields: ["bedrooms", "bathrooms"]
  },
  restaurant: { 
    amenities: ["Parking", "Security", "Water Supply", "Power Backup"],
    fields: ["area", "seatingCapacity"]
  },
  cafe: { 
    amenities: ["Parking", "Security", "Water Supply", "Power Backup"],
    fields: ["area", "seatingCapacity"]
  },
  farmhouse: { 
    amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply"],
    fields: ["bedrooms", "bathrooms", "area"]
  },
  warehouse: { 
    amenities: ["Parking", "Security", "Power Backup"],
    fields: ["area"]
  },
  cars: { 
    amenities: [],
    fields: ["brand", "model", "year", "fuelType", "transmission"]
  },
  bikes: { 
    amenities: [],
    fields: ["brand", "model", "year", "fuelType"]
  },
  hotels: { 
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Lift", "Power Backup", "Cafeteria", "Conference Room", "Water Supply"],
    fields: ["rooms", "area"]
  },
  business: { 
    amenities: [],
    fields: ["businessType", "revenue", "employees"]
  },
};

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    city: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    amenities: [] as string[],
    ownerName: "",
    ownerPhone: "",
    // Vehicle fields
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    transmission: "",
    // Hotels/Restaurant fields
    rooms: "",
    seatingCapacity: "",
    // Business fields
    businessType: "",
    revenue: "",
    employees: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Property Submitted!",
      description: "Your property listing has been submitted for review.",
    });
    navigate("/my-listings");
  };

  const isStep1Valid = formData.title && formData.type && formData.price;
  const isStep2Valid = formData.city && formData.location && formData.description;
  const isStep3Valid = formData.ownerName && formData.ownerPhone;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 overflow-x-hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Add Property</h1>
              <p className="text-sm text-muted-foreground">
                Step {step} of 4
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 overflow-x-hidden">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card className="p-6">
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Basic Details</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Luxury 3BHK Apartment in South Delhi"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  {formData.type === "cars" || formData.type === "bikes" ? "Price" : 
                   formData.type === "business" ? "Business Value" : "Monthly Rent"} *
                </Label>
                <Input
                  id="price"
                  placeholder={formData.type === "cars" || formData.type === "bikes" ? "₹5,00,000" : "₹25,000"}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              {/* Dynamic fields based on property type */}
              {formData.type && categoryConfigs[formData.type as keyof typeof categoryConfigs] && (
                <>
                  {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("bedrooms") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="3"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            setFormData({ ...formData, bedrooms: e.target.value })
                          }
                        />
                      </div>
                      {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("bathrooms") && (
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            placeholder="2"
                            value={formData.bathrooms}
                            onChange={(e) =>
                              setFormData({ ...formData, bathrooms: e.target.value })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("area") && (
                    <div className="space-y-2">
                      <Label htmlFor="area">
                        {formData.type === "farmland" ? "Area (Acres)" : "Area (sq.ft)"}
                      </Label>
                      <Input
                        id="area"
                        placeholder={formData.type === "farmland" ? "5 acres" : "1,200 sq.ft"}
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Vehicle fields */}
                  {(formData.type === "cars" || formData.type === "bikes") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand *</Label>
                          <Input
                            id="brand"
                            placeholder="e.g., Honda, Maruti"
                            value={formData.brand}
                            onChange={(e) =>
                              setFormData({ ...formData, brand: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            placeholder="e.g., City, Swift"
                            value={formData.model}
                            onChange={(e) =>
                              setFormData({ ...formData, model: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year *</Label>
                          <Input
                            id="year"
                            placeholder="2023"
                            value={formData.year}
                            onChange={(e) =>
                              setFormData({ ...formData, year: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuelType">Fuel Type *</Label>
                          <Select
                            value={formData.fuelType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, fuelType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="cng">CNG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {formData.type === "cars" && (
                        <div className="space-y-2">
                          <Label htmlFor="transmission">Transmission *</Label>
                          <Select
                            value={formData.transmission}
                            onValueChange={(value) =>
                              setFormData({ ...formData, transmission: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automatic">Automatic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}

                  {/* Hotels fields */}
                  {formData.type === "hotels" && (
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        placeholder="50"
                        value={formData.rooms}
                        onChange={(e) =>
                          setFormData({ ...formData, rooms: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Restaurant/Cafe fields */}
                  {(formData.type === "restaurant" || formData.type === "cafe") && (
                    <div className="space-y-2">
                      <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                      <Input
                        id="seatingCapacity"
                        type="number"
                        placeholder="50"
                        value={formData.seatingCapacity}
                        onChange={(e) =>
                          setFormData({ ...formData, seatingCapacity: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Business fields */}
                  {formData.type === "business" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Input
                          id="businessType"
                          placeholder="e.g., Retail, Manufacturing"
                          value={formData.businessType}
                          onChange={(e) =>
                            setFormData({ ...formData, businessType: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="revenue">Annual Revenue</Label>
                          <Input
                            id="revenue"
                            placeholder="₹50,00,000"
                            value={formData.revenue}
                            onChange={(e) =>
                              setFormData({ ...formData, revenue: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employees">Number of Employees</Label>
                          <Input
                            id="employees"
                            type="number"
                            placeholder="25"
                            value={formData.employees}
                            onChange={(e) =>
                              setFormData({ ...formData, employees: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!isStep1Valid}
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 2: Location & Description */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Location & Description</h2>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Delhi, Mumbai, Bangalore"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Green Park, South Delhi"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={!isStep2Valid}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Amenities & Images */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Amenities & Images</h2>

              {formData.type && categoryConfigs[formData.type as keyof typeof categoryConfigs]?.amenities.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryConfigs[formData.type as keyof typeof categoryConfigs].amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label
                          htmlFor={amenity}
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>Upload Images</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Details</h2>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name *</Label>
                <Input
                  id="ownerName"
                  placeholder="Enter your name"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Phone Number *</Label>
                <Input
                  id="ownerPhone"
                  placeholder="+91 98765 43210"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Review Your Listing</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.title || "Property Title"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.location || "Location"}, {formData.city || "City"}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formData.price || "Price"}/month
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!isStep3Valid}
                >
                  Submit Property
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddProperty;
