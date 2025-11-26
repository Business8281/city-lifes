import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import BottomNav from "@/components/BottomNav";
import LocationSelector from "@/components/LocationSelector";
import { propertyTypes } from "@/data/propertyTypes";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useProperties } from "@/hooks/useProperties";
import { useLocation } from "@/contexts/LocationContext";
import { useSponsoredProperties } from "@/hooks/useSponsoredProperties";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
  const [sortBy, setSortBy] = useState("recent");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const { properties, loading } = useProperties();
  const { location } = useLocation();
  const { sponsoredProperties, loading: sponsoredLoading, incrementClicks, incrementImpressions } = useSponsoredProperties(location);
  const sponsoredRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const trackedImpressions = useRef<Set<string>>(new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sponsoredCampaignByProperty = new Map(
    sponsoredProperties
      .filter((p) => !!p.campaign_id)
      .map((p) => [p.id, p.campaign_id as string])
  );

  // Track impressions for sponsored properties using IntersectionObserver
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
      { threshold: 0.5, rootMargin: '0px' }
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

  const filteredProperties = properties.filter((property) => {
    // Business-specific search
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.pin_code?.includes(searchQuery) ||
      (selectedType === 'business' && (property.business_metadata as any)?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "all" || property.property_type === selectedType;

    // Location filter
    let matchesLocation = true;
    if (location.method && location.value) {
      const searchValue = location.value.toLowerCase();
      
      switch (location.method) {
        case 'city':
          matchesLocation = property.city?.toLowerCase().includes(searchValue);
          break;
        case 'area':
          matchesLocation = property.area?.toLowerCase().includes(searchValue);
          break;
        case 'pincode':
          matchesLocation = property.pin_code?.includes(location.value);
          break;
        case 'live':
          matchesLocation = true; // Show all for live location
          break;
      }
    }

    return matchesSearch && matchesType && matchesLocation;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return 0; // recent (default order from DB)
  });

  const displayedProperties = sortedProperties.slice(0, displayedCount);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < sortedProperties.length) {
          setDisplayedCount(prev => Math.min(prev + 12, sortedProperties.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, sortedProperties.length]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(12);
  }, [selectedType, searchQuery, sortBy, location.value]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 overflow-x-hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {selectedType === 'business' && (
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search businesses by name, city, area, or PIN code..."
                />
              </div>
            )}
          </div>

          {/* Location Selector Button - Hidden */}
          <Button 
            variant="outline" 
            className="hidden w-full justify-start gap-2"
            onClick={() => setLocationDialogOpen(true)}
          >
            {location.method === 'live' && location.coordinates ? (
              <>
                <span className="text-green-500">📍</span>
                Live Location
              </>
            ) : location.value ? (
              <>
                <span>📍</span>
                {location.value}
              </>
            ) : (
              <>
                <span>📍</span>
                Select Location
              </>
            )}
          </Button>
          <LocationSelector open={locationDialogOpen} onOpenChange={setLocationDialogOpen} />

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className="shrink-0"
            >
              All
            </Button>
            {propertyTypes.map((type) => (
              <Button
                key={type.type}
                variant={selectedType === type.type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.type)}
                className="shrink-0"
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-3 h-auto py-2 hover:bg-accent"
              onClick={() => setLocationDialogOpen(true)}
            >
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base">
                {location.method === 'live' && location.coordinates 
                  ? 'Live Location' 
                  : location.value 
                  ? location.value 
                  : 'All cities'}
              </span>
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-sm text-muted-foreground px-1">
            {loading ? 'Loading...' : `Showing ${displayedProperties.length} of ${sortedProperties.length} properties`}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-hidden space-y-6">
        {/* Sponsored Ads Section - Carousel - Only show for business category */}
        {selectedType === "business" && !sponsoredLoading && sponsoredProperties.length > 0 && (
          <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Sponsored Listings</h2>
                <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                  AD
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {location.method === 'city' && `in ${location.value}`}
                {location.method === 'area' && `in ${location.value}`}
                {location.method === 'pincode' && `PIN ${location.value}`}
                {location.method === 'live' && 'Near You'}
              </span>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {sponsoredProperties.map((property) => (
                  <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-[280px] sm:basis-[300px] md:basis-1/3 lg:basis-1/4">
                    <div 
                      ref={(el) => property.campaign_id && setSponsoredRef(el, property.campaign_id)}
                      data-campaign-id={property.campaign_id}
                      className="bg-white dark:bg-gray-900 rounded-lg h-full"
                    >
                      <PropertyCard
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
                        sponsored={true}
                        userId={property.user_id}
                        onClick={() => {
                          if (property.campaign_id) {
                            incrementClicks(property.campaign_id);
                          }
                          navigate(`/property/${property.id}`);
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          </div>
        )}

        {/* Regular Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-muted-foreground">Loading properties...</div>
          </div>
        ) : displayedProperties.length > 0 ? (
            <div>
            <h2 className="text-lg font-semibold mb-3">All Properties</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-full">
              {displayedProperties.map((property) => (
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
                  userId={property.user_id}
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              ))}
            </div>
            
            {/* Load More Trigger */}
            {displayedCount < sortedProperties.length && (
              <div ref={loadMoreRef} className="py-8 text-center">
                <div className="text-muted-foreground">Loading more properties...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Listings;
