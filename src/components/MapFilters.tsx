import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { X, SlidersHorizontal } from "lucide-react";
import { propertyTypes } from "@/data/propertyTypes";

interface MapFiltersProps {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  priceType?: string;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  onPriceTypeChange: (value: string) => void;
  onClear: () => void;
}

const MapFilters = ({
  category,
  minPrice,
  maxPrice,
  priceType,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceTypeChange,
  onClear,
}: MapFiltersProps) => {
  const hasActiveFilters = category || minPrice || maxPrice;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-semibold">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Category</label>
          <Select value={category || ""} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.type} value={type.type}>
                  {type.icon} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Price Type</label>
          <Select value={priceType || ""} onValueChange={onPriceTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Min Price</label>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice || ""}
              onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Max Price</label>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice || ""}
              onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapFilters;
