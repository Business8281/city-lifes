import { useState } from "react";
import { MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Geolocation } from "@capacitor/geolocation";
import { toast } from "sonner";
import { reverseGeocode, cacheGeocode, getCachedGeocode } from "@/utils/geocoding";

interface LiveLocationButtonProps {
  onLocationDetected: (location: {
    latitude: number;
    longitude: number;
    city: string;
    area: string;
    pincode: string;
    formattedAddress: string;
  }) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const LiveLocationButton = ({
  onLocationDetected,
  variant = "outline",
  size = "default",
  className,
}: LiveLocationButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const detectLocation = async () => {
    setLoading(true);
    setStatus("idle");

    try {
      // Request location permission and get coordinates
      let position;
      try {
        // Try Capacitor Geolocation first (for native apps)
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      } catch {
        // Fallback to browser geolocation
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
      }

      const { latitude, longitude } = position.coords;

      // Check cache first
      let geocodeResult = getCachedGeocode(latitude, longitude);

      // If not cached, perform reverse geocoding
      if (!geocodeResult) {
        toast.info("Detecting your location...");
        geocodeResult = await reverseGeocode(latitude, longitude);

        if (!geocodeResult) {
          throw new Error("Could not determine address from coordinates");
        }

        // Cache the result
        cacheGeocode(latitude, longitude, geocodeResult);
      }

      // Call the parent callback with full location data
      onLocationDetected({
        latitude,
        longitude,
        city: geocodeResult.city,
        area: geocodeResult.area,
        pincode: geocodeResult.pincode,
        formattedAddress: geocodeResult.formattedAddress,
      });

      setStatus("success");
      toast.success("Location detected successfully!");

      // Reset status after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error: any) {
      console.error("Location detection error:", error);
      setStatus("error");

      if (error.code === 1) {
        toast.error("Location access denied. Please enable location in settings.");
      } else if (error.code === 2) {
        toast.error("Location unavailable. Please try again.");
      } else if (error.code === 3) {
        toast.error("Location request timeout. Please try again.");
      } else {
        toast.error("Failed to detect location. Please enter manually.");
      }

      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={detectLocation}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Detecting...
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Location Verified
        </>
      ) : status === "error" ? (
        <>
          <XCircle className="h-4 w-4 mr-2 text-destructive" />
          Try Again
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Use Live Location
        </>
      )}
    </Button>
  );
};
