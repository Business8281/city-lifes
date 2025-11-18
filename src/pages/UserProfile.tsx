import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import { WriteReviewDialog } from '@/components/WriteReviewDialog';
import BottomNav from '@/components/BottomNav';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Share2, 
  Star,
  MapPin,
  Calendar,
  Edit
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, stats, reviews, properties, loading, refetch } = useUserProfile(userId);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const isOwnProfile = user?.id === userId;

  const handleCall = () => {
    toast.info('Contact via messages');
  };

  const handleChat = () => {
    if (!user) {
      toast.error('Please login to start a conversation');
      navigate('/auth');
      return;
    }
    if (userId) {
      navigate(`/messages?user=${userId}`);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.full_name || 'User'}'s Profile`,
          text: `Check out ${profile?.full_name || 'this user'}'s profile on Citylifes`,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">User not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const averageRating = stats?.average_rating || 0;
  const totalReviews = stats?.total_reviews || 0;

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg truncate">User Profile</h1>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl md:text-4xl">
                  {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{averageRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({totalReviews})</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {profile.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(profile.created_at), 'MMM yyyy')}</span>
                </div>

                {properties.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{properties.length} Active Listings</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {!isOwnProfile && (
                    <>
                      <Button size="sm" onClick={handleCall} className="gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleChat} className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewDialogOpen(true)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Write Review
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Reviews ({totalReviews})</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                        {review.reviewer.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">
                            {review.reviewer.full_name || 'Anonymous'}
                          </p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.review_text && (
                          <p className="text-sm text-muted-foreground mb-2">{review.review_text}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Properties Section */}
          {properties.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Active Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    image={property.images?.[0] || '/placeholder.svg'}
                    title={property.title}
                    type={property.property_type}
                    price={`₹${property.price.toLocaleString()}`}
                    priceType={property.price_type}
                    location={`${property.area}, ${property.city}`}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area_sqft ? `${property.area_sqft} sqft` : undefined}
                    verified={property.verified}
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {properties.length === 0 && reviews.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No activity yet</p>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Review Dialog */}
      <WriteReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        reviewedUserId={userId!}
        reviewedUserName={profile.full_name}
        onSuccess={refetch}
      />
    </>
  );
}
