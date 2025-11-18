import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewedUserId: string;
  reviewedUserName: string | null;
  onSuccess?: () => void;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  reviewedUserId,
  reviewedUserName,
  onSuccess,
}: WriteReviewDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('user_reviews')
        .insert({
          reviewed_user_id: reviewedUserId,
          reviewer_id: user.id,
          rating,
          review_text: reviewText.trim() || null,
        } as any);

      if (error) throw error;

      toast.success('Review submitted successfully');
      setRating(0);
      setReviewText('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      if (error.code === '23505') {
        toast.error('You have already reviewed this user');
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Write a Review for {reviewedUserName || 'User'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Rating</label>
            <div className="flex gap-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors touch-manipulation"
                >
                  <Star
                    className={cn(
                      'h-7 w-7 sm:h-8 sm:w-8',
                      (hoveredRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label htmlFor="review-text" className="text-xs sm:text-sm font-medium">
              Review (Optional)
            </label>
            <Textarea
              id="review-text"
              placeholder="Share your experience with this user..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              maxLength={500}
              className="text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/500
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={submitting}
            className="w-full sm:w-auto text-sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || rating === 0}
            className="w-full sm:w-auto text-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
