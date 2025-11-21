// This component is deprecated - use ReviewForm instead
// Kept for backward compatibility
import { ReviewForm } from './ReviewForm';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewedUserId: string;
  reviewedUserName: string | null;
  listingId?: string;
  onSuccess?: () => void;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  reviewedUserId,
  listingId,
  onSuccess,
}: WriteReviewDialogProps) {
  const handleSubmit = async (data: { rating: number; title?: string; comment?: string }) => {
    // This is a compatibility wrapper
    // Actual implementation should use useReviews hook
    onSuccess?.();
  };

  return (
    <ReviewForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  );
}
