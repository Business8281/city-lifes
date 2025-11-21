import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { OptimizedImage } from "./OptimizedImage";
import { toast } from "sonner";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  propertyType?: string; // Actual property type string
  price: string;
  priceType?: string; // 'monthly', 'fixed', 'yearly'
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
  propertyType,
  price,
  priceType = 'monthly',
  location,
  bedrooms,
  bathrooms,
  area,
  verified = false,
  sponsored = false,
  onClick,
  className,
}: PropertyCardProps) => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite: toggleFavoriteInDb } = useFavorites(user?.id);
  const isFavorite = favoriteIds.has(id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    await toggleFavoriteInDb(id);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-lg max-w-full relative",
        sponsored 
          ? "border-amber-400 dark:border-amber-600 shadow-md hover:shadow-amber-200 dark:hover:shadow-amber-900/50 ring-2 ring-amber-300 dark:ring-amber-700 shadow-amber-100 dark:shadow-amber-900/30" 
          : "border-border hover:border-primary",
        className
      )}
    >
      {/* Sponsored Glow Effect */}
      {sponsored && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none z-0" />
      )}
      <div className="relative">
        <OptimizedImage
          src={image}
          alt={title}
          aspectRatio="square"
          width={600}
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Sponsored Ribbon - Top Corner */}
        {sponsored && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-1 text-xs font-bold shadow-lg transform rotate-0 rounded-bl-lg">
              ⭐ SPONSORED
            </div>
          </div>
        )}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all active:scale-90 z-10",
            isFavorite 
              ? "bg-destructive/20 hover:bg-destructive/30" 
              : "bg-background/80 hover:bg-background"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-transform",
              isFavorite 
                ? "fill-destructive text-destructive scale-110" 
                : "text-foreground"
            )}
          />
        </button>
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
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
        
        {propertyType !== 'business' && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{price}</span>
            {priceType === 'monthly' && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
            {priceType === 'yearly' && (
              <span className="text-sm text-muted-foreground">/year</span>
            )}
            {priceType === 'fixed' && (
              <Badge variant="secondary" className="ml-2">For Sale</Badge>
            )}
          </div>
        )}
        
        {propertyType === 'business' && (
          <div className="pt-2">
            <Badge variant="secondary">Business Listing</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
