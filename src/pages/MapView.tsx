import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { useAdvancedSearch, type SearchFilters } from "@/hooks/useAdvancedSearch";
import { useMapClusters, type MapBounds } from "@/hooks/useMapClusters";
import type { AutocompleteResult } from "@/hooks/useAutocomplete";
import { propertyTypes } from "@/data/propertyTypes";
import PropertyCard from "@/components/PropertyCard";
import MapFilters from "@/components/MapFilters";
import { OptimizedImage } from "@/components/OptimizedImage";
import { GoogleMap } from '@/components/GoogleMap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MapView = () => {
  const navigate = useNavigate();
  const { location, getCurrentLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [showList, setShowList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { data: searchResults = [], isLoading } = useAdvancedSearch(searchFilters, true);
  const { data: clusters = [] } = useMapClusters(
    mapBounds ? { ...mapBounds, category: searchFilters.category } : null,
    mapBounds?.zoom ? mapBounds.zoom <= 13 : false
  );

  useEffect(() => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      setMapCenter({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
      setSearchFilters(prev => ({
        ...prev,
        userLat: location.coordinates!.lat,
        userLng: location.coordinates!.lng,
        radiusKm: 10,
      }));
    }
  }, [location.coordinates]);

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  const handleSearchSelect = (result: any) => {
    if (result.latitude && result.longitude) {
      setMapCenter({ lat: result.latitude, lng: result.longitude });
      setSearchFilters(prev => ({
        ...prev,
        userLat: result.latitude,
        userLng: result.longitude,
        radiusKm: 5,
        // Clear other filters when searching by location
        city: undefined,
        area: undefined,
        pincode: undefined
      }));
    } else {
      setSearchFilters(prev => ({
        ...prev,
        city: result.type === 'city' ? result.label : undefined,
        area: result.type === 'area' ? result.label.split(',')[0] : undefined,
        pincode: result.type === 'pincode' ? result.pincode : undefined,
      }));
    }
  };

  const handleMapBoundsChange = useCallback((bounds: any, zoom: number) => {
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      setMapBounds({
        minLat: sw.lat(),
        minLng: sw.lng(),
        maxLat: ne.lat(),
        maxLng: ne.lng(),
        zoom,
      });

      setSearchFilters(prev => ({
        ...prev,
        minLat: sw.lat(),
        minLng: sw.lng(),
        maxLat: ne.lat(),
        maxLng: ne.lng(),
      }));
    }
    // Convert bounds to min/max lat/lng
    const ne = bounds.toJSON ? { lat: bounds.toJSON().north, lng: bounds.toJSON().east } : bounds.getNorthEast();
    const sw = bounds.toJSON ? { lat: bounds.toJSON().south, lng: bounds.toJSON().west } : bounds.getSouthWest();

    setSearchFilters(prev => ({
      ...prev,
      minLat: sw.lat,
      minLng: sw.lng,
      maxLat: ne.lat,
      maxLng: ne.lng,
      // Only update user location if we're not in bounds mode (optional, but good for relevance)
      userLat: location.coordinates?.lat,
      userLng: location.coordinates?.lng,
    }));
  }, [location.coordinates]);

  const formatPrice = (price: number, priceType: string) => {
    return `₹${price.toLocaleString("en-IN")}${priceType === "monthly" ? "/mo" : priceType === "daily" ? "/day" : ""}`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Side - List View (Desktop) */}
      <div className="hidden md:flex w-[400px] lg:w-[450px] flex-col border-r border-border h-full bg-background z-10 shadow-xl">
        <div className="p-4 border-b border-border space-y-4">
          <EnhancedSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleSearchSelect}
          />
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {isLoading ? 'Loading...' : `${searchResults.length} Properties`}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters Panel (Inline for Desktop) */}
          {showFilters && (
            <div className="pt-2 animate-in slide-in-from-top-2">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                <Select
                  value={searchFilters.radiusKm?.toString() || "5"}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, radiusKm: Number(value) }))}
                >
                  <SelectTrigger className="w-[100px] bg-background">
                    <SelectValue placeholder="Radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 km</SelectItem>
                    <SelectItem value="3">3 km</SelectItem>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <MapFilters
                category={searchFilters.category}
                minPrice={searchFilters.minPrice}
                maxPrice={searchFilters.maxPrice}
                onCategoryChange={(value) => setSearchFilters(prev => ({ ...prev, category: value === "all" ? undefined : value }))}
                onMinPriceChange={(value) => setSearchFilters(prev => ({ ...prev, minPrice: value }))}
                onMaxPriceChange={(value) => setSearchFilters(prev => ({ ...prev, maxPrice: value }))}
                onPriceTypeChange={(value) => setSearchFilters(prev => ({ ...prev, priceType: value || undefined }))}
                onClear={() => setSearchFilters(prev => ({
                  ...prev,
                  category: undefined,
                  minPrice: undefined,
                  maxPrice: undefined
                }))}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {searchResults.length === 0 && !isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No properties found in this area.</p>
              <p className="text-sm">Try moving the map or changing filters.</p>
            </div>
          ) : (
            searchResults.map((property) => (
              <div
                key={property.id}
                className={`cursor-pointer transition-all duration-200 ${selectedProperty?.id === property.id ? 'ring-2 ring-primary rounded-lg' : ''}`}
                onClick={() => {
                  if (property.latitude && property.longitude) {
                    setMapCenter({ lat: property.latitude, lng: property.longitude });
                    setSelectedProperty(property);
                  }
                }}
                onMouseEnter={() => setSelectedProperty(property)}
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
                  distance={property.distance_km}
                  userId={property.user_id}
                  className="hover:shadow-md"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Map (Full width on mobile, remaining width on desktop) */}
      <div className="flex-1 relative h-full">
        {/* Mobile Search Bar Overlay */}
        <div className="md:hidden absolute top-4 left-4 right-4 z-20 flex gap-2">
          <div className="flex-1">
            <EnhancedSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={handleSearchSelect}
            />
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="shrink-0 h-10 w-10 bg-background shadow-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="md:hidden absolute top-16 left-4 right-4 z-20 bg-background p-4 rounded-lg shadow-xl animate-in fade-in zoom-in-95">
            <MapFilters
              category={searchFilters.category}
              minPrice={searchFilters.minPrice}
              maxPrice={searchFilters.maxPrice}
              onCategoryChange={(value) => setSearchFilters(prev => ({ ...prev, category: value || undefined }))}
              onMinPriceChange={(value) => setSearchFilters(prev => ({ ...prev, minPrice: value }))}
              onMaxPriceChange={(value) => setSearchFilters(prev => ({ ...prev, maxPrice: value }))}
              onPriceTypeChange={(value) => setSearchFilters(prev => ({ ...prev, priceType: value || undefined }))}
              onClear={() => setSearchFilters(prev => ({
                ...prev,
                category: undefined,
                minPrice: undefined,
                maxPrice: undefined
              }))}
            />
          </div>
        )}

        {/* Search as I move Toggle */}
        <div className="absolute top-20 md:top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-border">
            <input
              type="checkbox"
              id="search-move"
              className="accent-primary h-4 w-4"
              defaultChecked={true}
              onChange={(e) => {
                // Logic to enable/disable search on move
                // For now, we'll just use the existing behavior which is always search on move
                // But we could add a state for this
              }}
            />
            <label htmlFor="search-move" className="text-sm font-medium cursor-pointer select-none">
              Search as I move map
            </label>
          </div>
        </div>

        <GoogleMap
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          center={mapCenter}
          zoom={mapBounds?.zoom || 12}
          properties={clusters.length > 0 ? [] : searchResults}
          clusters={clusters}
          onBoundsChange={(bounds, zoom) => {
            // Google Maps bounds
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const minLat = sw.lat();
            const minLng = sw.lng();
            const maxLat = ne.lat();
            const maxLng = ne.lng();

            handleMapBoundsChange({
              getNorthEast: () => ({ lat: () => maxLat, lng: () => maxLng }),
              getSouthWest: () => ({ lat: () => minLat, lng: () => minLng }),
              toJSON: () => ({ south: minLat, west: minLng, north: maxLat, east: maxLng })
            }, zoom);
          }}
          userLocation={location.coordinates}
          onUserLocationClick={handleGetLocation}
          selectedPropertyId={selectedProperty?.id}
          onPropertySelect={(property) => setSelectedProperty(property)}
        />

        {/* Mobile List View Drawer Trigger */}
        <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <Button
            className="rounded-full shadow-xl px-6"
            onClick={() => setShowList(true)}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
        </div>

        {/* Mobile List Drawer (Overlay) */}
        {showList && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setShowList(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 h-[60vh] bg-background rounded-t-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">{searchResults.length} Properties</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowList(false)}>Close</Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {searchResults.map((property) => (
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
                    distance={property.distance_km}
                    userId={property.user_id}
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default MapView;
