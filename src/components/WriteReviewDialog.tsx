import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Star } from 'lucide-react';
import { useReviews, Review } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewedUserId: string;
  reviewedUserName: string | null;
  listingId?: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  reviewedUserId,
  reviewedUserName,
  listingId,
  existingReview,
  onSuccess,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ownerListingId, setOwnerListingId] = useState<string | null>(listingId || null);
  
  const { createReview, updateReview } = useReviews(reviewedUserId);
  const isEditMode = !!existingReview;

  // Load existing review data when in edit mode
  useEffect(() => {
    if (open && existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title || '');
      setComment(existingReview.comment || '');
      setOwnerListingId(existingReview.listing_id);
    } else if (open && !existingReview) {
      setRating(0);
      setTitle('');
      setComment('');
    }
  }, [open, existingReview]);

  // Fetch owner's first listing if not provided
  useEffect(() => {
    if (open && !listingId && reviewedUserId) {
      const fetchOwnerListing = async () => {
        const { data } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', reviewedUserId)
          .limit(1)
          .single();
        
        if (data) {
          setOwnerListingId(data.id);
        }
      };
      fetchOwnerListing();
    }
  }, [open, listingId, reviewedUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!isEditMode && !ownerListingId) {
      toast.error('Cannot submit review: Owner has no listings');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      
      if (isEditMode && existingReview) {
        result = await updateReview(existingReview.id, {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        });
      } else {
        result = await createReview({
          owner_id: reviewedUserId,
          listing_id: ownerListingId!,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        });
      }

      if (result) {
        setRating(0);
        setTitle('');
        setComment('');
        onOpenChange(false);
        onSuccess?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Your Review' : 'Write a Review'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update your review for' : 'Share your experience with'} {reviewedUserName || 'this owner'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Review (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
              maxLength={500}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !rating || (!isEditMode && !ownerListingId)}>
              {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Review' : 'Submit Review')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
