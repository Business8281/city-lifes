import { useParams, useNavigate } from "react-router-dom";
import { sampleProperties } from "@/data/properties";
import { ArrowLeft, Heart, Share2, MapPin, Phone, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = sampleProperties.find((p) => p.id === id);

  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(id);
  });

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      toast.success("Removed from favorites");
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, id]));
      toast.success("Added to favorites");
    }
    
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite && "fill-destructive text-destructive"
                )}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src={property.images[currentImage]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentImage === index
                  ? "bg-white w-6"
                  : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Title and Price */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
            {property.verified && (
              <Badge className="bg-secondary shrink-0">Verified</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{property.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </div>

        <Separator />

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <>
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Property Details</h3>
              <div className="grid grid-cols-3 gap-4">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                )}
                {property.area && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{property.area.split(' ')[0]}</div>
                    <div className="text-sm text-muted-foreground">{property.area.split(' ')[1]}</div>
                  </div>
                )}
              </div>
            </Card>
            <Separator />
          </>
        )}

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-3">About this property</h3>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Owner Details */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {property.owner.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{property.owner.name}</h4>
                {property.owner.isAgent && (
                  <Badge variant="outline" className="text-xs">Agent</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{property.owner.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button className="gap-2" onClick={() => window.location.href = `tel:${property.owner.phone}`}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Messaging coming soon!")}>
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          </div>
        </Card>

        {/* Posted Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Posted {property.postedDate}</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PropertyDetails;
