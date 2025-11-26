import { Star } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { Review, ReviewStats } from '@/hooks/useReviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewsListProps {
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onWriteReview?: () => void;
  canReview?: boolean;
  hasUserReview?: boolean;
}

export function ReviewsList({
  reviews,
  stats,
  loading,
  showActions,
  onEdit,
  onDelete,
  onWriteReview,
  canReview,
  hasUserReview,
}: ReviewsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Section */}
      {stats && stats.total_reviews > 0 && (
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <div className="text-center sm:text-left min-w-[100px]">
              <div className="text-3xl md:text-4xl font-bold">{stats.average_rating.toFixed(1)}</div>
              <div className="flex gap-0.5 mt-1 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 md:h-4 md:w-4 ${
                      i < Math.round(stats.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <p className="text-sm md:text-base text-muted-foreground">
                {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {stats.verified_reviews} verified {stats.verified_reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Write Review Button */}
      {onWriteReview && canReview && (
        <div className="flex justify-center">
          <Button onClick={onWriteReview} className="w-full sm:w-auto">
            {hasUserReview ? 'Edit Your Review' : 'Write a Review'}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-muted-foreground">No reviews yet</p>
          {canReview && onWriteReview && (
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Be the first to review!
            </p>
          )}
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
