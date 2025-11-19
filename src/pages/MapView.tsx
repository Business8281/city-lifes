import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";

interface Property {
  id: string;
  title: string;
  price: number;
  price_type: string;
  property_type: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  images: string[];
  verified: boolean;
}

const MapView = () => {
  const navigate = useNavigate();
  const { location, getCurrentLocation } = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (location.coordinates?.lat && location.coordinates?.lng) {
      const coords = {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      };
      setMapCenter(coords);
      setUserLocation(coords);
    }
  }, [location.coordinates]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .eq("available", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    if (error) {
      console.error("Error fetching properties:", error);
      return;
    }

    setProperties(data || []);
  };

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

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

  return (
    <div className="relative h-screen w-full pb-16 md:pb-0">
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
          {/* User location marker */}
          {userLocation && (
            <AdvancedMarker
              position={userLocation}
              title="Your Location"
            >
              <div className="bg-primary rounded-full p-3 shadow-lg border-4 border-background">
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
            </AdvancedMarker>
          )}

          {/* Property markers */}
          {properties.map((property) => (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.latitude, lng: property.longitude }}
              onClick={() => setSelectedProperty(property)}
            >
              <div className="bg-card rounded-full p-2 shadow-lg border-2 border-primary hover:scale-110 transition-transform cursor-pointer">
                <Home className="h-4 w-4 text-primary" />
              </div>
            </AdvancedMarker>
          ))}

          {/* Info window for selected property */}
          {selectedProperty && (
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
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
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
        className="absolute top-4 right-4 z-10 rounded-full shadow-lg"
        onClick={handleGetLocation}
      >
        <Navigation className="h-4 w-4" />
      </Button>

      <BottomNav />
    </div>
  );
};

export default MapView;
