import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  price: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  verified?: boolean;
  sponsored?: boolean;
  onClick?: () => void;
  className?: string;
}

const PropertyCard = ({
  id,
  image,
  title,
  type,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  verified = false,
  sponsored = false,
  onClick,
  className,
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(id);
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, id]));
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg overflow-hidden border border-border hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-lg max-w-full",
        className
      )}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-destructive text-destructive" : "text-foreground"
            )}
          />
        </button>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {sponsored && (
            <Badge className="bg-amber-500 hover:bg-amber-600">
              Sponsored
            </Badge>
          )}
          {verified && (
            <Badge className="bg-secondary">
              Verified
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-2 overflow-hidden">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3 className="font-semibold text-foreground line-clamp-1 min-w-0 flex-1">{title}</h3>
          <span className="text-sm text-muted-foreground shrink-0">{type}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1 min-w-0 flex-1">{location}</span>
        </div>
        
        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{area}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
