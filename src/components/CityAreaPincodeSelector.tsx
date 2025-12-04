import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCities, useAreas, usePincodes, useResolveLocation } from "@/hooks/useLocationData";
import { toast } from "sonner";
import { LiveLocationButton } from "@/components/LiveLocationButton";
import { supabase } from "@/integrations/supabase/client";

interface CityAreaPincodeSelectorProps {
  onLocationChange: (location: {
    cityId: string;
    cityName: string;
    areaId: string;
    areaName: string;
    pincode: string;
  }) => void;
  defaultValues?: {
    cityId?: string;
    areaId?: string;
    pincode?: string;
  };
  required?: boolean;
}

export const CityAreaPincodeSelector = ({
  onLocationChange,
  defaultValues,
  required = true,
}: CityAreaPincodeSelectorProps) => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    defaultValues?.cityId || null
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(
    defaultValues?.areaId || null
  );
  const [selectedPincode, setSelectedPincode] = useState<string | null>(
    defaultValues?.pincode || null
  );

  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: areas, isLoading: areasLoading } = useAreas(selectedCityId);
  const { data: pincodes, isLoading: pincodesLoading } = usePincodes(selectedAreaId);
  const { resolveLocation } = useResolveLocation();

  useEffect(() => {
    if (selectedCityId && selectedAreaId && selectedPincode) {
      const city = cities?.find((c) => c.id === selectedCityId);
      const area = areas?.find((a) => a.id === selectedAreaId);

      if (city && area) {
        onLocationChange({
          cityId: selectedCityId,
          cityName: city.name,
          areaId: selectedAreaId,
          areaName: area.name,
          pincode: selectedPincode,
        });
      }
    }
  }, [selectedCityId, selectedAreaId, selectedPincode, cities, areas, onLocationChange]);

  const handleLocationDetected = async (location: {
    latitude: number;
    longitude: number;
    city: string;
    area: string;
    pincode: string;
  }) => {
    // Try to resolve using database function first
    const resolved = await resolveLocation(location.latitude, location.longitude);

    if (resolved && Array.isArray(resolved) && resolved.length > 0) {
      const dbLocation = resolved[0] as any;
      setSelectedCityId(dbLocation.city_id);
      setSelectedAreaId(dbLocation.area_id);
      setSelectedPincode(dbLocation.pincode);
    } else {
      // Fallback: try to match city/area/pincode from geocoding result
      const matchedCity = cities?.find(
        (c) => c.name.toLowerCase() === location.city.toLowerCase()
      );

      if (matchedCity) {
        setSelectedCityId(matchedCity.id);

        // Try to match area
        const { data: cityAreas } = await supabase
          .from("areas")
          .select("*")
          .eq("city_id", matchedCity.id)
          .order("name");

        const matchedArea = (cityAreas as any[])?.find(
          (a) => a.name.toLowerCase() === location.area.toLowerCase()
        );

        if (matchedArea) {
          setSelectedAreaId(matchedArea.id);

          // Try to match pincode
          if (location.pincode) {
            setSelectedPincode(location.pincode);
          }
        }
      } else {
        toast.warning(
          `Could not find "${location.city}" in database. Please select manually.`
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Location</Label>
        <LiveLocationButton
          onLocationDetected={handleLocationDetected}
          variant="outline"
          size="sm"
        />
      </div>

      <div className="space-y-3">
        {/* City Selection */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm">
            City {required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={selectedCityId || ""}
            onValueChange={(value) => {
              setSelectedCityId(value);
              setSelectedAreaId(null);
              setSelectedPincode(null);
            }}
            required={required}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {citiesLoading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading cities...
                </div>
              ) : (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Tier 1 Cities
                  </div>
                  {cities
                    ?.filter((c) => c.tier === "tier1")
                    .map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name} ({city.state})
                      </SelectItem>
                    ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Tier 2 Cities
                  </div>
                  {cities
                    ?.filter((c) => c.tier === "tier2")
                    .map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name} ({city.state})
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Area Selection */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm">
            Area/Locality {required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={selectedAreaId || ""}
            onValueChange={(value) => {
              setSelectedAreaId(value);
              setSelectedPincode(null);
            }}
            disabled={!selectedCityId}
            required={required}
          >
            <SelectTrigger id="area">
              <SelectValue
                placeholder={
                  selectedCityId ? "Select area" : "Select city first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {areasLoading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading areas...
                </div>
              ) : areas && areas.length > 0 ? (
                areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No areas available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Pincode Selection */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-sm">
            Pincode {required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={selectedPincode || ""}
            onValueChange={setSelectedPincode}
            disabled={!selectedAreaId}
            required={required}
          >
            <SelectTrigger id="pincode">
              <SelectValue
                placeholder={
                  selectedAreaId ? "Select pincode" : "Select area first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {pincodesLoading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading pincodes...
                </div>
              ) : pincodes && pincodes.length > 0 ? (
                pincodes.map((pincode) => (
                  <SelectItem key={pincode.id} value={pincode.pincode}>
                    {pincode.pincode}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No pincodes available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
