import { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useReviews, Review } from '@/hooks/useReviews';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface BusinessReviewSectionProps {
  ownerId: string;
  listingId: string;
}

export function BusinessReviewSection({ ownerId, listingId }: BusinessReviewSectionProps) {
  const { user } = useAuth();
  const { reviews, stats, loading, canReview, userReview, createReview, updateReview, deleteReview } = useReviews(ownerId, listingId);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleSubmitReview = async (data: { rating: number; title?: string; comment?: string }) => {
    try {
      if (userReview) {
        await updateReview(userReview.id, data);
        toast.success('Review updated successfully');
      } else {
        await createReview({
          owner_id: ownerId,
          listing_id: listingId,
          ...data,
        });
        toast.success('Review submitted successfully');
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      throw error;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  const getRatingBreakdown = () => {
    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      breakdown[review.rating - 1]++;
    });
    return breakdown.reverse();
  };

  const ratingBreakdown = getRatingBreakdown();

  return (
    <>
      <Card className="p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-1">Reviews</h2>
            {stats && stats.total_reviews > 0 && (
              <p className="text-sm text-muted-foreground">
                Based on {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>

          {/* Rating Summary - Google My Business Style */}
          {stats && stats.total_reviews > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Overall Rating */}
              <div className="flex flex-col items-center md:items-start justify-center space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold">
                    {stats.average_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-lg">/5</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 md:h-6 md:w-6 ${
                        i < Math.round(stats.average_rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
                  {stats.verified_reviews > 0 && (
                    <span className="ml-1">
                      • {stats.verified_reviews} verified
                    </span>
                  )}
                </p>
              </div>

              {/* Right: Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star, index) => {
                  const count = ratingBreakdown[index];
                  const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 font-medium">{star}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-muted-foreground text-xs">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-1">No reviews yet</p>
              <p className="text-sm text-muted-foreground">Be the first to review this business!</p>
            </div>
          )}

          {/* Write Review Button */}
          {canReview && user?.id !== ownerId && (
            <>
              <Separator />
              <Button 
                onClick={() => setReviewFormOpen(true)} 
                className="w-full md:w-auto"
                variant={userReview ? "outline" : "default"}
              >
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </Button>
            </>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={review.reviewer?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.reviewer?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-sm">
                            {review.reviewer?.full_name || 'Anonymous User'}
                          </p>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-sm mt-2">{review.title}</h4>
                        )}
                        {review.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                    <Separator className="last:hidden" />
                  </div>
                ))}

                {/* Show More/Less Button */}
                {reviews.length > 3 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full gap-2"
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Review Form Dialog */}
      <ReviewForm
        open={reviewFormOpen}
        onOpenChange={setReviewFormOpen}
        onSubmit={handleSubmitReview}
        existingReview={userReview}
        isEdit={!!userReview}
      />
    </>
  );
}
