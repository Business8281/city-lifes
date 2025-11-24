import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/database';
import { MapPin, Star, Eye, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { OptimizedImage } from './OptimizedImage';

interface PromotedListingCardProps {
  property: Property;
  campaignId: string;
  onImpression?: () => void;
  onClick?: () => void;
}

export const PromotedListingCard = ({ 
  property, 
  campaignId,
  onImpression,
  onClick 
}: PromotedListingCardProps) => {
  const navigate = useNavigate();
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) onClick();
    navigate(`/property/${property.id}`);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(); // Track click for paid lead
    setLeadDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-primary/30 relative">
        {/* Sponsored Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            Sponsored
          </Badge>
        </div>

        <div onClick={handleCardClick}>
          {/* Image */}
          <div className="relative overflow-hidden">
            <OptimizedImage
              src={property.images?.[0] || '/placeholder-property.jpg'}
              alt={property.title}
              aspectRatio="square"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              width={900}
              quality={80}
              priority={true}
            />
            {property.verified && (
              <Badge className="absolute top-3 right-3 bg-green-500">
                <Star className="w-3 h-3 mr-1" fill="white" />
                Verified
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-xl font-bold text-foreground line-clamp-2 flex-1">
                {property.title}
              </h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ₹{property.price?.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.price_type || 'per month'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{property.area}, {property.city}</span>
            </div>

            {property.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {property.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{property.views || 0} views</span>
              </div>
              <Button 
                onClick={handleContactClick}
                className="bg-primary hover:bg-primary/90"
              >
                Contact Owner
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <LeadCaptureDialog
        open={leadDialogOpen}
        onOpenChange={setLeadDialogOpen}
        listingId={property.id}
        ownerId={property.user_id}
        listingTitle={property.title}
        leadType="paid"
        sourcePage="internal_ad"
        campaignId={campaignId}
        category={property.property_type}
        subcategory={property.business_metadata?.subcategory}
      />
    </>
  );
};
