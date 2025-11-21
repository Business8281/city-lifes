import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Geolocation } from "@capacitor/geolocation";
import { toast } from "sonner";

export type DistanceRadius = 1 | 5 | 10 | 25 | 50;

interface NearMeFilterProps {
  onDistanceSelect: (coords: { lat: number; lng: number }, radius: DistanceRadius) => void;
  onClear: () => void;
  activeRadius?: DistanceRadius | null;
}

export const NearMeFilter = ({
  onDistanceSelect,
  onClear,
  activeRadius,
}: NearMeFilterProps) => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const distanceOptions: DistanceRadius[] = [1, 5, 10, 25, 50];

  const detectLocation = async () => {
    setLoading(true);
    try {
      let position;
      try {
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
      } catch {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }

      const detectedCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setCoords(detectedCoords);
      // Default to 5km radius
      onDistanceSelect(detectedCoords, 5);
      toast.success("Location detected! Showing nearby listings.");
    } catch (error: any) {
      console.error("Location detection error:", error);
      if (error.code === 1) {
        toast.error("Location access denied. Please enable in settings.");
      } else {
        toast.error("Failed to detect location.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (radius: DistanceRadius) => {
    if (coords) {
      onDistanceSelect(coords, radius);
    }
  };

  const handleClear = () => {
    setCoords(null);
    onClear();
  };

  if (activeRadius && coords) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Within {activeRadius}km
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {distanceOptions.map((distance) => (
              <DropdownMenuItem
                key={distance}
                onClick={() => handleRadiusChange(distance)}
              >
                Within {distance}km
                {activeRadius === distance && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={detectLocation}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Detecting...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Near Me
        </>
      )}
    </Button>
  );
};
