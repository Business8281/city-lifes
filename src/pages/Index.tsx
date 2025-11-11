import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import PropertyCard from "@/components/PropertyCard";
import { propertyTypes } from "@/data/properties";
import heroImage from "@/assets/hero-cityscape.jpg";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useLocation } from "@/contexts/LocationContext";
import LocationSelector from "@/components/LocationSelector";
import { useSponsoredProperties } from "@/hooks/useSponsoredProperties";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const navigate = useNavigate();
  const { properties } = useProperties();
  const { location } = useLocation();
  const { sponsoredProperties, incrementClicks, incrementImpressions } = useSponsoredProperties(location);
  const isMobile = useIsMobile();
  const sponsoredRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const trackedImpressions = useRef<Set<string>>(new Set());

  // Track impressions for sponsored properties
  useEffect(() => {
    if (sponsoredProperties.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const campaignId = entry.target.getAttribute('data-campaign-id');
            if (campaignId && !trackedImpressions.current.has(campaignId)) {
              trackedImpressions.current.add(campaignId);
              incrementImpressions(campaignId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sponsoredRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sponsoredProperties, incrementImpressions]);

  const setSponsoredRef = useCallback((element: HTMLDivElement | null, campaignId: string) => {
    if (element) {
      sponsoredRefs.current.set(campaignId, element);
    } else {
      sponsoredRefs.current.delete(campaignId);
    }
  }, []);

  // Chunk property types into groups of 6 (2x3 grid)
  const ITEMS_PER_SLIDE = 6;
  const categorySlides = [];
  for (let i = 0; i < propertyTypes.length; i += ITEMS_PER_SLIDE) {
    categorySlides.push(propertyTypes.slice(i, i + ITEMS_PER_SLIDE));
  }

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
          
          <div className="relative">
            {isMobile ? (
              <>
                <Carousel 
                  className="w-full"
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                >
                  <CarouselContent className="-ml-2">
                    {categorySlides.map((slide, slideIndex) => (
                      <CarouselItem key={slideIndex} className="pl-2 basis-full">
                        <div className="grid grid-cols-3 gap-2 py-2">
                          {slide.map((category) => (
                            <CategoryCard
                              key={category.type}
                              icon={category.icon}
                              label={category.label}
                              onClick={() => navigate(`/listings?type=${category.type}`)}
                            />
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {categorySlides.length > 1 && (
                  <div className="flex justify-center gap-1 mt-3">
                    {categorySlides.map((_, index) => (
                      <div
                        key={index}
                        className="h-1 rounded-full w-1 bg-muted-foreground/30 transition-all"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {propertyTypes.map((category) => (
                  <CategoryCard
                    key={category.type}
                    icon={category.icon}
                    label={category.label}
                    onClick={() => navigate(`/listings?type=${category.type}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Properties */}
        <section>
          {/* Sponsored Business Section */}
          {sponsoredProperties.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">Sponsored Businesses</h2>
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full font-medium">
                    AD
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2 max-w-full">
                  {sponsoredProperties.slice(0, 4).map((property) => (
                    <div 
                      key={property.id}
                      ref={(el) => property.campaign_id && setSponsoredRef(el, property.campaign_id)}
                      data-campaign-id={property.campaign_id}
                      className="w-[280px] shrink-0 md:w-auto"
                    >
                      <PropertyCard
                        id={property.id}
                        image={property.images[0] || '/placeholder.svg'}
                        title={property.title}
                        type={propertyTypes.find(t => t.type === property.property_type)?.icon || '💼'}
                        price={`₹${property.price.toLocaleString()}`}
                        location={`${property.area}, ${property.city}`}
                        bedrooms={property.bedrooms || undefined}
                        bathrooms={property.bathrooms || undefined}
                        area={property.area_sqft ? `${property.area_sqft} sq.ft` : undefined}
                        verified={property.verified}
                        sponsored={true}
                        onClick={() => {
                          if (property.campaign_id) {
                            incrementClicks(property.campaign_id);
                          }
                          navigate(`/property/${property.id}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.images[0] || '/placeholder.svg'}
                title={property.title}
                type={propertyTypes.find(t => t.type === property.property_type)?.icon || '🏠'}
                price={`₹${property.price.toLocaleString()}`}
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
