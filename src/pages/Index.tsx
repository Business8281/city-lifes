import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { propertyTypes } from "@/data/propertyTypes";
import heroImage from "@/assets/hero-cityscape.jpg";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useLocation } from "@/contexts/LocationContext";
import LocationSelector from "@/components/LocationSelector";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const navigate = useNavigate();
  const { properties } = useProperties();
  const { location } = useLocation();

  // Filter properties based on location
  const filteredProperties = properties.filter((property) => {
    if (!location.method || !location.value) return true;
    
    const searchValue = location.value.toLowerCase();
    
    switch (location.method) {
      case 'city':
        return property.city?.toLowerCase().includes(searchValue);
      case 'area':
        return property.area?.toLowerCase().includes(searchValue);
      case 'pincode':
        return property.pin_code?.includes(location.value);
      case 'live':
        // For live location, show all for now (can add proximity logic later)
        return true;
      default:
        return true;
    }
  });

  const featuredProperties = filteredProperties.slice(0, 4);

  return (
    <div className="min-h-screen bg-background mobile-page overflow-x-hidden max-w-full">
      {/* Hero Section */}
      <div className="relative h-[280px] md:h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="City skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center mobile-container text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Perfect Space
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-6">
            Rent properties, vehicles, and businesses across India
          </p>
          
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by city, locality, or property type..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mobile-container md:px-4 py-6 space-y-8 overflow-x-hidden">
        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm">
            Showing properties in{" "}
            <strong className="text-foreground">
              {location.value || "All Cities"}
            </strong>
          </span>
          <Button 
            variant="link" 
            className="text-primary p-0 h-auto"
            onClick={() => setLocationSelectorOpen(true)}
          >
            Change
          </Button>
        </div>

        <LocationSelector 
          open={locationSelectorOpen} 
          onOpenChange={setLocationSelectorOpen} 
        />

        {/* Browse by Category */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Browse by Category</h2>
            <Button
              variant="link"
              className="text-primary p-0 h-auto"
              onClick={() => navigate("/listings")}
            >
              View All
            </Button>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {propertyTypes.map((type) => (
              <Button
                key={type.type}
                variant="outline"
                size="sm"
                onClick={() => navigate(`/listings?type=${type.type}`)}
                className="shrink-0"
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Properties */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Featured Properties</h2>
            <Button
              variant="link"
              className="text-primary p-0 h-auto"
              onClick={() => navigate("/listings")}
            >
              See More
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-full">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.images[0] || '/placeholder.svg'}
                title={property.title}
                type={propertyTypes.find(t => t.type === property.property_type)?.icon || '🏠'}
                propertyType={property.property_type}
                price={`₹${property.price.toLocaleString()}`}
                priceType={property.price_type}
                location={`${property.area}, ${property.city}`}
                bedrooms={property.bedrooms || undefined}
                bathrooms={property.bathrooms || undefined}
                area={property.area_sqft ? `${property.area_sqft} sq.ft` : undefined}
                verified={property.verified}
                onClick={() => navigate(`/property/${property.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Have a property to rent?</h2>
          <p className="text-white/90 mb-6">
            List your property and reach thousands of potential tenants
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="font-semibold"
            onClick={() => navigate("/add-property")}
          >
            Post Your Property
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Index;
