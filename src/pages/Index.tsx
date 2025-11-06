import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import PropertyCard from "@/components/PropertyCard";
import { propertyTypes } from "@/data/properties";
import heroImage from "@/assets/hero-cityscape.jpg";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { properties } = useProperties();

  const featuredProperties = properties.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="relative h-[280px] overflow-hidden">
        <img
          src={heroImage}
          alt="City skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
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

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm">Showing properties in <strong className="text-foreground">All Cities</strong></span>
          <Button variant="link" className="text-primary p-0 h-auto">
            Change
          </Button>
        </div>

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
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {propertyTypes.slice(0, 12).map((category) => (
              <CategoryCard
                key={category.type}
                icon={category.icon}
                label={category.label}
                onClick={() => navigate(`/listings?type=${category.type}`)}
              />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.images[0] || '/placeholder.svg'}
                title={property.title}
                type={propertyTypes.find(t => t.type === property.type)?.icon || '🏠'}
                price={`₹${property.price.toLocaleString()}`}
                location={property.location}
                bedrooms={property.bedrooms || undefined}
                bathrooms={property.bathrooms || undefined}
                area={property.area ? `${property.area} sq.ft` : undefined}
                verified={property.status === 'active'}
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
