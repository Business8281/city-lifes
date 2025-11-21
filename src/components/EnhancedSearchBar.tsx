import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building2, Home, Hash, X } from "lucide-react";
import { Input } from "./ui/input";
import { useAutocomplete, type AutocompleteResult } from "@/hooks/useAutocomplete";
import { cn } from "@/lib/utils";

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: AutocompleteResult) => void;
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: suggestions = [], isLoading } = useAutocomplete(value, isFocused);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelect = (result: AutocompleteResult) => {
    onChange(result.label);
    onSelect?.(result);
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "city":
        return <Building2 className="h-4 w-4 text-primary" />;
      case "area":
        return <MapPin className="h-4 w-4 text-primary" />;
      case "pincode":
        return <Hash className="h-4 w-4 text-primary" />;
      case "category":
        return <Home className="h-4 w-4 text-primary" />;
      default:
        return <MapPin className="h-4 w-4 text-primary" />;
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || isLoading);

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
          onKeyDown={handleKeyDown}
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
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((result, index) => (
                <li key={`${result.type}-${result.label}-${index}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors",
                      selectedIndex === index && "bg-accent"
                    )}
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {result.type}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
