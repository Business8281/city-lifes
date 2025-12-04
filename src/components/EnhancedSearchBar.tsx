import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building2, Home, Hash, X } from "lucide-react";
import { Input } from "./ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: any) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedSearchBar = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search by city, area or PIN code (e.g., Hyderabad, Banjara Hills, 500072)",
  className
}: EnhancedSearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placesLib = useMapsLibrary('places');
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    setAutocompleteService(new placesLib.AutocompleteService());
    setPlacesService(new placesLib.PlacesService(document.createElement('div')));
  }, [placesLib]);

  useEffect(() => {
    if (!autocompleteService || !value || value.length < 2) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      autocompleteService.getPlacePredictions(
        { input: value, componentRestrictions: { country: 'in' } },
        (results) => {
          setPredictions(results || []);
        }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [value, autocompleteService]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    onChange(prediction.description);
    setIsFocused(false);

    if (placesService && onSelect) {
      placesService.getDetails(
        { placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            onSelect({
              label: prediction.description,
              type: 'place',
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            });
          }
        }
      );
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const showDropdown = isFocused && predictions.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 bg-muted border-0 focus-visible:ring-primary w-full"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
        >
          <ul className="py-2">
            {predictions.map((prediction) => (
              <li key={prediction.place_id}>
                <button
                  onClick={() => handleSelect(prediction)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{prediction.structured_formatting.main_text}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
