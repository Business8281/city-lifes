import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Phone, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProperty } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { property, loading } = useProperty(id);
  const { favoriteIds, toggleFavorite } = useFavorites(user?.id);
  const [currentImage, setCurrentImage] = useState(0);

  const isFavorite = id ? favoriteIds.has(id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between px-4 py-3 max-w-full">
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
              onClick={() => id && toggleFavorite(id)}
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
      <div className="relative aspect-[4/3] md:aspect-[16/9] bg-muted">
        <img
          src={property.images[currentImage] || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {property.images.length > 1 && (
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
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        {/* Title and Price */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
            {property.status === 'active' && (
              <Badge className="bg-secondary shrink-0">Active</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{property.area}, {property.city} - {property.pin_code}</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">₹{property.price.toLocaleString()}</span>
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
                    <div className="text-2xl font-bold text-primary">{property.area}</div>
                    <div className="text-sm text-muted-foreground">sq.ft</div>
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
        {property.amenities.length > 0 && (
          <>
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
          </>
        )}

        {/* Owner Details */}
        {(property.contact_name || property.contact_phone || property.contact_email) && (
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {property.contact_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{property.contact_name || 'Property Owner'}</h4>
                <p className="text-sm text-muted-foreground">{property.contact_phone || property.contact_email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button className="gap-2" onClick={() => property.contact_phone && (window.location.href = `tel:${property.contact_phone}`)}>
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => {
                  if (!user) {
                    toast.error("Please login to start a conversation");
                    navigate("/auth");
                    return;
                  }
                  navigate(`/messages?user=${property.user_id}&property=${id}`);
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>
          </Card>
        )}

        {/* Posted Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Posted {format(new Date(property.created_at), 'PPP')}</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PropertyDetails;
