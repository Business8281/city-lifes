import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Clock, Globe, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const businessCategories = [
  { value: "retail", label: "🛍️ Retail Store" },
  { value: "ecommerce", label: "🛒 E-commerce / Online Store" },
  { value: "supermarket", label: "🏪 Supermarket / Grocery" },
  { value: "restaurant", label: "🍽️ Restaurant / Fine Dining" },
  { value: "cafe", label: "☕ Cafe / Coffee Shop" },
  { value: "fast_food", label: "🍔 Fast Food" },
  { value: "bakery", label: "🥖 Bakery / Pastry Shop" },
  { value: "salon", label: "💇 Salon / Spa" },
  { value: "gym", label: "💪 Gym / Fitness Center" },
  { value: "clinic", label: "🏥 Clinic / Healthcare" },
  { value: "pharmacy", label: "💊 Pharmacy" },
  { value: "electronics", label: "📱 Electronics Store" },
  { value: "clothing", label: "👔 Clothing / Fashion" },
  { value: "automotive", label: "🚗 Automotive Services" },
  { value: "real_estate", label: "🏢 Real Estate Agency" },
  { value: "education", label: "📚 Education / Training" },
  { value: "hotel", label: "🏨 Hotel / Hospitality" },
  { value: "manufacturing", label: "🏭 Manufacturing" },
  { value: "consulting", label: "💼 Consulting Services" },
  { value: "it_services", label: "💻 IT Services" },
  { value: "other", label: "📦 Other" },
];

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

interface BusinessProfileFormProps {
  formData: any;
  setFormData: (data: any) => void;
  operatingHours: any;
  setOperatingHours: (hours: any) => void;
}

export function BusinessProfileForm({ 
  formData, 
  setFormData, 
  operatingHours, 
  setOperatingHours 
}: BusinessProfileFormProps) {
  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setOperatingHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Business Category */}
      <div className="space-y-2">
        <Label htmlFor="businessCategory">Business Category *</Label>
        <Select
          value={formData.businessCategory}
          onValueChange={(value) => setFormData({ ...formData, businessCategory: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select business category" />
          </SelectTrigger>
          <SelectContent>
            {businessCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Established */}
      <div className="space-y-2">
        <Label htmlFor="yearEstablished">Year Established</Label>
        <Input
          id="yearEstablished"
          type="number"
          placeholder="e.g., 2020"
          value={formData.yearEstablished}
          onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      {/* Number of Employees */}
      <div className="space-y-2">
        <Label htmlFor="employees">Number of Employees</Label>
        <Select
          value={formData.employees}
          onValueChange={(value) => setFormData({ ...formData, employees: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-500">201-500 employees</SelectItem>
            <SelectItem value="500+">500+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Offered */}
      <div className="space-y-2">
        <Label htmlFor="services">Services/Products Offered</Label>
        <Textarea
          id="services"
          placeholder="Describe the main services or products your business offers..."
          value={formData.services}
          onChange={(e) => setFormData({ ...formData, services: e.target.value })}
          rows={3}
        />
      </div>

      {/* Operating Hours */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">Operating Hours</h3>
        </div>
        
        <div className="space-y-3">
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center gap-3">
              <Checkbox
                id={`${day.value}-open`}
                checked={operatingHours[day.value]?.isOpen || false}
                onCheckedChange={(checked) =>
                  handleOperatingHoursChange(day.value, "isOpen", checked as boolean)
                }
              />
              <Label htmlFor={`${day.value}-open`} className="w-24 font-normal">
                {day.label}
              </Label>
              
              {operatingHours[day.value]?.isOpen && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={operatingHours[day.value]?.open || "09:00"}
                    onChange={(e) =>
                      handleOperatingHoursChange(day.value, "open", e.target.value)
                    }
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={operatingHours[day.value]?.close || "18:00"}
                    onChange={(e) =>
                      handleOperatingHoursChange(day.value, "close", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
              )}
              
              {!operatingHours[day.value]?.isOpen && (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Website & Social Media */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <h3 className="font-semibold">Online Presence</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.yourbusiness.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/yourbusiness"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourbusiness"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter/X
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourbusiness"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/company/yourbusiness"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Additional Business Information */}
      <div className="space-y-2">
        <Label htmlFor="businessLicense">Business License/Registration Number</Label>
        <Input
          id="businessLicense"
          placeholder="Enter your business registration number"
          value={formData.businessLicense}
          onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
        <Input
          id="gstNumber"
          placeholder="Enter GST number"
          value={formData.gstNumber}
          onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
        />
      </div>
    </div>
  );
}
