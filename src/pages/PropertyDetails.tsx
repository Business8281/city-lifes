import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Phone, MessageCircle, Calendar, Tag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useState, useRef } from "react";
import ListingGallery from '@/components/ListingGallery';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProperty } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { propertyTypes } from "@/data/propertyTypes";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { property, loading } = useProperty(id);
  const { favoriteIds, toggleFavorite } = useFavorites(user?.id);
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goPrev = () => {
    setCurrentImage((prev) => {
      const total = property?.images?.length || 0;
      if (total <= 1) return prev;
      return (prev - 1 + total) % total;
    });
  };

  const goNext = () => {
    setCurrentImage((prev) => {
      const total = property?.images?.length || 0;
      if (total <= 1) return prev;
      return (prev + 1) % total;
    });
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchEndX.current - touchStartX.current;
    const threshold = 50; // px
    if (delta > threshold) {
      goPrev();
    } else if (delta < -threshold) {
      goNext();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const isFavorite = id ? favoriteIds.has(id) : false;

  const getPropertyTypeInfo = () => {
    return propertyTypes.find(pt => pt.type === property?.property_type);
  };

  const formatPriceType = (priceType: string) => {
    const typeMap: Record<string, string> = {
      'rent': 'For Rent',
      'sale': 'For Sale',
      'daily_rent': 'Daily Rent',
      'month': 'Monthly'
    };
    return typeMap[priceType] || priceType;
  };

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
      <ListingGallery images={property.images || []} title={property.title} />

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4 overflow-x-hidden">
        {/* Title and Price */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{property.title}</h1>
            {property.status === 'active' && (
              <Badge className="bg-secondary shrink-0 text-xs">Active</Badge>
            )}
          </div>
          
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              {property.address && `${property.address}, `}
              {property.area}, {property.city} - {property.pin_code}
            </span>
          </div>
          
          {property.price > 0 && (
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl md:text-3xl font-bold text-primary">₹{property.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/{property.price_type || 'month'}</span>
            </div>
          )}

          {/* Category and Type Info */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Tag className="h-3 w-3" />
              {getPropertyTypeInfo()?.label || property.property_type}
            </Badge>
            {property.price_type && (
              <Badge variant="secondary">
                {formatPriceType(property.price_type)}
              </Badge>
            )}
            {property.is_agent && (
              <Badge variant="outline" className="bg-primary/10">
                Agent
              </Badge>
            )}
            {property.verified && (
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                Verified
              </Badge>
            )}
            {property.business_metadata && (property.business_metadata as any).targetAudience && (
              <Badge variant="outline" className="capitalize">
                {(property.business_metadata as any).targetAudience}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Property Details Card - Unified Style for All Categories */}
        {(property.bedrooms || property.bathrooms || property.area_sqft || 
          property.business_metadata || property.property_type) && (
          <>
            <Card className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Property Details</h3>
              <div className="grid grid-cols-3 gap-6 md:gap-8">
                {/* Residential Properties */}
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{property.bedrooms}</div>
                    <div className="text-sm md:text-base text-muted-foreground">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{property.bathrooms}</div>
                    <div className="text-sm md:text-base text-muted-foreground">Bathrooms</div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{property.area_sqft}</div>
                    <div className="text-sm md:text-base text-muted-foreground">sq.ft</div>
                  </div>
                )}

                {/* PG Properties */}
                {property.property_type === 'pg' && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).pgType && (
                      <div className="text-center col-span-3">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).pgType}</div>
                        <div className="text-sm md:text-base text-muted-foreground">PG Type</div>
                      </div>
                    )}
                    {(property.business_metadata as any).roomType && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).roomType}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Room Type</div>
                      </div>
                    )}
                    {(property.business_metadata as any).foodIncluded !== undefined && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).foodIncluded ? 'Yes' : 'No'}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Food Included</div>
                      </div>
                    )}
                    {(property.business_metadata as any).securityDeposit && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">₹{(property.business_metadata as any).securityDeposit}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Security Deposit</div>
                      </div>
                    )}
                  </>
                )}

                {/* Hotels */}
                {property.property_type === 'hotels' && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).roomTypes && (
                      <div className="text-center col-span-3">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).roomTypes}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Room Types</div>
                      </div>
                    )}
                    {(property.business_metadata as any).totalRooms && (
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{(property.business_metadata as any).totalRooms}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Total Rooms</div>
                      </div>
                    )}
                    {(property.business_metadata as any).starRating && (
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{(property.business_metadata as any).starRating} ⭐</div>
                        <div className="text-sm md:text-base text-muted-foreground">Star Rating</div>
                      </div>
                    )}
                  </>
                )}

                {/* Restaurants & Cafes */}
                {(property.property_type === 'restaurant' || property.property_type === 'cafe') && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).cuisine && (
                      <div className="text-center col-span-3">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).cuisine}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Cuisine Type</div>
                      </div>
                    )}
                    {(property.business_metadata as any).seatingCapacity && (
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{(property.business_metadata as any).seatingCapacity}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Seating Capacity</div>
                      </div>
                    )}
                  </>
                )}

                {/* Vehicles (Cars & Bikes) */}
                {(property.property_type === 'cars' || property.property_type === 'bikes') && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).brand && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).brand}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Brand</div>
                      </div>
                    )}
                    {(property.business_metadata as any).model && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).model}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Model</div>
                      </div>
                    )}
                    {(property.business_metadata as any).year && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).year}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Year</div>
                      </div>
                    )}
                    {(property.business_metadata as any).mileage && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).mileage}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Mileage</div>
                      </div>
                    )}
                    {(property.business_metadata as any).fuelType && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).fuelType}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Fuel Type</div>
                      </div>
                    )}
                    {(property.business_metadata as any).transmission && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).transmission}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Transmission</div>
                      </div>
                    )}
                  </>
                )}

                {/* Electronics */}
                {property.property_type === 'electronics' && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).brand && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).brand}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Brand</div>
                      </div>
                    )}
                    {(property.business_metadata as any).model && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).model}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Model</div>
                      </div>
                    )}
                    {(property.business_metadata as any).condition && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).condition}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Condition</div>
                      </div>
                    )}
                    {(property.business_metadata as any).warranty && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{(property.business_metadata as any).warranty ? 'Yes' : 'No'}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Warranty</div>
                      </div>
                    )}
                  </>
                )}

                {/* Roommate */}
                {property.property_type === 'roommate' && property.business_metadata && (
                  <>
                    {(property.business_metadata as any).occupation && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).occupation}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Occupation</div>
                      </div>
                    )}
                    {(property.business_metadata as any).monthlyRent && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2">₹{(property.business_metadata as any).monthlyRent}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Monthly Rent</div>
                      </div>
                    )}
                    {(property.business_metadata as any).foodPreference && (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 capitalize">{(property.business_metadata as any).foodPreference}</div>
                        <div className="text-sm md:text-base text-muted-foreground">Food Preference</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
            <Separator />
          </>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-4">About this property</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        <Separator />

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge 
                    key={amenity} 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm md:text-base rounded-full"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Business Metadata - for business properties */}
        {property.property_type === 'business' && property.business_metadata && Object.keys(property.business_metadata).length > 0 && (
          <>
            <Card className="p-3 md:p-4">
              <h3 className="font-semibold text-sm md:text-base mb-3">Business Details</h3>
              <div className="space-y-2.5">
                {(property.business_metadata as any).category && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium capitalize">{(property.business_metadata as any).category}</span>
                  </div>
                )}
                {(property.business_metadata as any).yearEstablished && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year Established:</span>
                    <span className="font-medium">{(property.business_metadata as any).yearEstablished}</span>
                  </div>
                )}
                {(property.business_metadata as any).employees && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium">{(property.business_metadata as any).employees}</span>
                  </div>
                )}
                {(property.business_metadata as any).services && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Services/Products:</span>
                    <p className="text-sm font-medium">{(property.business_metadata as any).services}</p>
                  </div>
                )}
                {(property.business_metadata as any).operatingHours && Object.keys((property.business_metadata as any).operatingHours).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground font-semibold">Operating Hours:</span>
                    <div className="space-y-1">
                      {Object.entries((property.business_metadata as any).operatingHours)
                        .filter(([_, hours]: any) => hours.isOpen)
                        .map(([day, hours]: any) => (
                          <div key={day} className="flex justify-between text-xs md:text-sm">
                            <span className="text-muted-foreground capitalize">{day}:</span>
                            <span className="font-medium">{hours.open} - {hours.close}</span>
                          </div>
                        ))}
                      {Object.entries((property.business_metadata as any).operatingHours)
                        .filter(([_, hours]: any) => !hours.isOpen).length > 0 && (
                        <div className="text-xs text-muted-foreground italic">
                          Closed: {Object.entries((property.business_metadata as any).operatingHours)
                            .filter(([_, hours]: any) => !hours.isOpen)
                            .map(([day]: any) => day.charAt(0).toUpperCase() + day.slice(1))
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {(property.business_metadata as any).website && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Website:</span>
                    <a href={(property.business_metadata as any).website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {(property.business_metadata as any).socialMedia && Object.values((property.business_metadata as any).socialMedia).some(url => url) && (
                  <div>
                    <span className="text-sm text-muted-foreground mb-1.5 block">Social Media:</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries((property.business_metadata as any).socialMedia).map(([platform, url]) => (
                        url && (
                          <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="capitalize cursor-pointer hover:bg-secondary">
                              {platform}
                            </Badge>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
                {(property.business_metadata as any).businessLicense && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Business License:</span>
                    <span className="font-medium">{(property.business_metadata as any).businessLicense}</span>
                  </div>
                )}
                {(property.business_metadata as any).gstNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST Number:</span>
                    <span className="font-medium">{(property.business_metadata as any).gstNumber}</span>
                  </div>
                )}
              </div>
            </Card>
            <Separator />
          </>
        )}

        {/* Owner Details */}
        {(property.contact_name || property.contact_phone || property.contact_email) && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => navigate(`/user/${property.user_id}`)}>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-2xl md:text-3xl">
                {property.contact_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg md:text-xl font-bold truncate hover:text-primary transition-colors">{property.contact_name || 'Property Owner'}</h4>
                <p className="text-sm md:text-base text-muted-foreground truncate">{property.contact_phone || property.contact_email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                size="lg" 
                className="gap-2 text-sm md:text-base py-6" 
                onClick={() => property.contact_phone && (window.location.href = `tel:${property.contact_phone}`)}
              >
                <Phone className="h-5 w-5" />
                Call
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="gap-2 text-sm md:text-base py-6" 
                onClick={() => {
                  if (!user) {
                    toast.error("Please login to start a conversation");
                    navigate("/auth");
                    return;
                  }
                  navigate(`/messages?user=${property.user_id}&property=${id}`);
                }}
              >
                <MessageCircle className="h-5 w-5" />
                Chat
              </Button>
            </div>
          </Card>
        )}

        {/* Posted Date */}
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span>Posted {format(new Date(property.created_at), 'PPP')}</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PropertyDetails;
