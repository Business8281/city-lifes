import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { propertyTypes } from "@/data/propertyTypes";
import heroImage from "@/assets/hero-cityscape.jpg";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProperties } from "@/hooks/useProperties";
import { useLocation } from "@/contexts/LocationContext";
import LocationSelector from "@/components/LocationSelector";
import { NearMeFilter, DistanceRadius } from "@/components/NearMeFilter";
import { useNearbyProperties } from "@/hooks/useNearbyProperties";
import { formatDistance } from "@/utils/geocoding";
const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);
  const [nearMeCoords, setNearMeCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [nearMeRadius, setNearMeRadius] = useState<DistanceRadius | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();
  const {
    properties
  } = useProperties();
  const {
    location
  } = useLocation();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch nearby properties when Near Me is active
  const {
    data: nearbyProperties,
    isLoading: nearbyLoading
  } = useNearbyProperties(nearMeCoords?.lat || null, nearMeCoords?.lng || null, nearMeRadius || 5, !!nearMeCoords);
  const handleNearMeSelect = (coords: {
    lat: number;
    lng: number;
  }, radius: DistanceRadius) => {
    setNearMeCoords(coords);
    setNearMeRadius(radius);
  };
  const handleClearNearMe = () => {
    setNearMeCoords(null);
    setNearMeRadius(null);
  };

  // Determine which properties to show
  const displayProperties = nearMeCoords && nearbyProperties ? nearbyProperties : properties;

  // Filter properties based on location
  const filteredProperties = displayProperties.filter(property => {
    // Location filter (only if Near Me is not active)
    if (!nearMeCoords && location.method && location.value) {
      const searchValue = location.value.toLowerCase();
      switch (location.method) {
        case 'city':
          return property.city?.toLowerCase().includes(searchValue);
        case 'area':
          return property.area?.toLowerCase().includes(searchValue);
        case 'pincode':
          return property.pin_code?.includes(location.value);
        case 'live':
          return true;
        default:
          return true;
      }
    }
    return true;
  });

  // Sort properties
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
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedCount < sortedProperties.length) {
        setDisplayedCount(prev => Math.min(prev + 12, sortedProperties.length));
      }
    }, {
      threshold: 0.1
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [displayedCount, sortedProperties.length]);
  return <div className="min-h-screen bg-background mobile-page overflow-x-hidden max-w-full">
      {/* Hero Section */}
      <div className="relative h-[280px] md:h-[400px] overflow-hidden">
        <img src={heroImage} alt="City skyline" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 my-0" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center mobile-container text-center py-0 px-0 my-[100px]">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Perfect Space
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-6">
            Rent properties, vehicles, and businesses across India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mobile-container md:px-4 py-6 space-y-8 overflow-x-hidden">
        {/* Location & Sort */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="flex items-center gap-2 px-3 h-auto py-2 hover:bg-accent" onClick={() => setLocationSelectorOpen(true)}>
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base">
              {location.method === 'live' && location.coordinates ? 'Live Location' : location.value ? location.value : 'All cities'}
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

        <LocationSelector open={locationSelectorOpen} onOpenChange={setLocationSelectorOpen} />

        {/* Browse by Category */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Browse by Category</h2>
            <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/listings")}>
              View All
            </Button>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {propertyTypes.map(type => <Button key={type.type} variant="outline" size="sm" onClick={() => navigate(`/listings?type=${type.type}`)} className="shrink-0">
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Button>)}
          </div>
        </section>

        {/* Property Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {nearMeCoords ? "Nearby Properties" : "All Properties"}
            </h2>
            <span className="text-sm text-muted-foreground">
              Showing {displayedProperties.length} of {sortedProperties.length}
            </span>
          </div>

          {nearbyLoading ? <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Finding nearby properties...</p>
            </div> : displayedProperties.length === 0 ? <div className="text-center py-12 text-muted-foreground">
              {nearMeCoords ? "No properties found nearby. Try increasing the radius." : "No properties found in this location"}
            </div> : <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-full">
                {displayedProperties.map(property => <PropertyCard key={property.id} id={property.id} image={property.images[0] || '/placeholder.svg'} title={property.title} type={propertyTypes.find(t => t.type === property.property_type)?.icon || '🏠'} propertyType={property.property_type} price={`₹${property.price.toLocaleString()}`} priceType={property.price_type} location={`${property.area}, ${property.city}`} bedrooms={property.bedrooms || undefined} bathrooms={property.bathrooms || undefined} area={property.area_sqft ? `${property.area_sqft} sq.ft` : undefined} verified={property.verified} distance={'distance_km' in property ? (property as any).distance_km : undefined} userId={property.user_id} onClick={() => navigate(`/property/${property.id}`)} />)}
              </div>
              
              {/* Load More Trigger */}
              {displayedCount < sortedProperties.length && <div ref={loadMoreRef} className="py-8 text-center">
                  <div className="text-muted-foreground">Loading more properties...</div>
                </div>}
            </>}
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Have a property to rent?</h2>
          <p className="text-white/90 mb-6">
            List your property and reach thousands of potential tenants
          </p>
          <Button size="lg" variant="secondary" className="font-semibold" onClick={() => navigate("/add-property")}>
            Post Your Property
          </Button>
        </section>
      </div>
    </div>;
};
export default Index;