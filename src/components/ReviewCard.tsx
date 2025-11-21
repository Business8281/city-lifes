import { Star, CheckCircle2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/hooks/useReviews';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({ review, showActions, onEdit, onDelete }: ReviewCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewer?.avatar_url || ''} />
            <AvatarFallback>
              {review.reviewer?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{review.reviewer?.full_name || 'Anonymous User'}</p>
              {review.verified && (
                <Badge variant="default" className="text-xs gap-1">
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

        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-sm">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}

      {showActions && (
        <div className="flex gap-2 pt-2">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-xs text-primary hover:underline"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-xs text-destructive hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
