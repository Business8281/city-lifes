import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
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
import PriceMarker from "@/components/PriceMarker";
import MapFilters from "@/components/MapFilters";
import { OptimizedImage } from "@/components/OptimizedImage";

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
  const { data: clusters = [] } = useMapClusters(mapBounds, mapBounds?.zoom ? mapBounds.zoom <= 13 : false);

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

  const handleSearchSelect = (result: AutocompleteResult) => {
    if (result.latitude && result.longitude) {
      setMapCenter({ lat: result.latitude, lng: result.longitude });
      setSearchFilters(prev => ({
        ...prev,
        userLat: result.latitude,
        userLng: result.longitude,
        radiusKm: 5,
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
  }, []);

  const formatPrice = (price: number, priceType: string) => {
    return `₹${price.toLocaleString("en-IN")}${priceType === "monthly" ? "/mo" : priceType === "daily" ? "/day" : ""}`;
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <MapPin className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-center text-muted-foreground">
              Google Maps API key is not configured. Please add it to your environment variables.
            </p>
          </CardContent>
        </Card>
        <BottomNav />
      </div>
    );
  }

  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;
      
      const boundsListener = map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        const zoom = map.getZoom() || 12;
        handleMapBoundsChange(bounds, zoom);
      });
      
      return () => {
        google.maps.event.removeListener(boundsListener);
      };
    }, [map]);
    
    return null;
  };

  return (
    <div className="relative h-screen w-full pb-16 md:pb-0">
      {/* Search Bar & Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
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
          className="shrink-0 h-12 w-12 bg-background shadow-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="shrink-0 h-12 w-12 bg-background shadow-lg"
          onClick={() => setShowList(!showList)}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-20 left-4 z-20 w-80 max-sm:w-[calc(100%-2rem)]">
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

      {/* Map */}
      <APIProvider apiKey={apiKey}>
        <Map
          defaultZoom={12}
          center={mapCenter}
          mapId="citylifes-map"
          className="w-full h-full"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          fullscreenControl={false}
          streetViewControl={false}
        >
          <MapController />
          
          {/* User location marker */}
          {location.coordinates && (
            <AdvancedMarker
              position={{ lat: location.coordinates.lat, lng: location.coordinates.lng }}
              title="Your Location"
            >
              <div className="bg-primary rounded-full p-3 shadow-lg border-4 border-background">
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
            </AdvancedMarker>
          )}

          {/* Clusters for zoomed out view */}
          {clusters.map((cluster, idx) => (
            <AdvancedMarker
              key={`cluster-${idx}`}
              position={{ lat: cluster.cluster_lat, lng: cluster.cluster_lng }}
              onClick={() => {
                setMapCenter({ lat: cluster.cluster_lat, lng: cluster.cluster_lng });
              }}
            >
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-background font-bold cursor-pointer hover:scale-110 transition-transform">
                {cluster.property_count}
              </div>
            </AdvancedMarker>
          ))}

          {/* Individual property markers with prices for zoomed in view */}
          {searchResults.length > 0 && searchResults.slice(0, 100).map((property) => (
            property.latitude && property.longitude && (
              <AdvancedMarker
                key={property.id}
                position={{ lat: property.latitude, lng: property.longitude }}
                onClick={() => setSelectedProperty(property)}
              >
                <PriceMarker
                  price={property.price}
                  priceType={property.price_type || undefined}
                  isSelected={selectedProperty?.id === property.id}
                />
              </AdvancedMarker>
            )
          ))}

          {/* Info window for selected property */}
          {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude,
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <Card className="border-0 shadow-none max-w-xs">
                <CardContent className="p-3">
                  {selectedProperty.images?.[0] && (
                    <div className="w-full rounded-lg mb-2 overflow-hidden">
                      <OptimizedImage
                        src={selectedProperty.images[0]}
                        alt={selectedProperty.title}
                        aspectRatio="square"
                        width={400}
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {selectedProperty.title}
                    </h3>
                    {selectedProperty.verified && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-primary font-bold text-lg mb-1">
                    {formatPrice(selectedProperty.price, selectedProperty.price_type)}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedProperty.area}, {selectedProperty.city}
                  </p>
                  {selectedProperty.distance_km && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedProperty.distance_km.toFixed(1)}km away
                    </p>
                  )}
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/property/${selectedProperty.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Location button */}
      <Button
        size="icon"
        className="absolute bottom-24 right-4 z-10 rounded-full shadow-lg"
        onClick={handleGetLocation}
      >
        <Navigation className="h-4 w-4" />
      </Button>

      {/* List View Sidebar */}
      {showList && (
        <div className="absolute left-4 top-20 bottom-20 w-96 bg-background rounded-lg shadow-xl overflow-hidden z-10 flex flex-col max-sm:left-0 max-sm:w-full max-sm:bottom-16">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">
              {isLoading ? 'Loading...' : `${searchResults.length} properties found`}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {searchResults.map((property) => (
              <div key={property.id} className="cursor-pointer" onClick={() => {
                if (property.latitude && property.longitude) {
                  setMapCenter({ lat: property.latitude, lng: property.longitude });
                  setSelectedProperty(property);
                }
              }}>
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
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MapView;
