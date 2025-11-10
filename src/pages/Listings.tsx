import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import BottomNav from "@/components/BottomNav";
import LocationSelector from "@/components/LocationSelector";
import { propertyTypes } from "@/data/properties";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { properties, loading } = useProperties();
  const { location } = useLocation();
  const { sponsoredProperties, loading: sponsoredLoading, incrementClicks, incrementImpressions } = useSponsoredProperties(location);
  const sponsoredRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const trackedImpressions = useRef<Set<string>>(new Set());

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
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

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
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search properties..."
              />
            </div>
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
            {loading ? 'Loading...' : `${sortedProperties.length} properties found`}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-hidden space-y-6">
        {/* Sponsored Ads Section - Only Business Listings */}
        {!sponsoredLoading && sponsoredProperties.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Sponsored Businesses</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                AD
              </span>
            </div>
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4 pb-2">
                {sponsoredProperties.map((property) => (
                  <div 
                    key={property.id} 
                    ref={(el) => property.campaign_id && setSponsoredRef(el, property.campaign_id)}
                    data-campaign-id={property.campaign_id}
                    className="w-[280px] sm:w-[300px] shrink-0"
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

        {/* Regular Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-muted-foreground">Loading properties...</div>
          </div>
        ) : sortedProperties.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-3">All Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
              {sortedProperties.map((property) => (
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
