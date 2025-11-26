import { Star, CheckCircle2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/hooks/useReviews';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({ review, showActions, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const isOwnReview = user?.id === review.reviewer_id;
  
  return (
    <Card className="p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 md:gap-3 min-w-0 flex-1">
          <Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0">
            <AvatarImage src={review.reviewer?.avatar_url || ''} />
            <AvatarFallback>
              {review.reviewer?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm md:text-base truncate">{review.reviewer?.full_name || 'Anonymous User'}</p>
              {review.verified && (
                <Badge variant="default" className="text-xs gap-1 flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 md:h-4 md:w-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-sm md:text-base">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-sm md:text-base text-muted-foreground break-words">{review.comment}</p>
      )}

      {showActions && isOwnReview && (onEdit || onDelete) && (
        <div className="flex gap-2 pt-2 border-t">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-xs md:text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-xs md:text-sm text-destructive hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
