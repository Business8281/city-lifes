import { useState } from 'react';
import { useMyReviews } from '@/hooks/useReviews';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewForm } from '@/components/ReviewForm';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Review } from '@/hooks/useReviews';
import { useReviews } from '@/hooks/useReviews';

export default function MyReviews() {
  const { reviews, loading, refetch } = useMyReviews();
  const { updateReview, deleteReview } = useReviews();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: { rating: number; title?: string; comment?: string }) => {
    if (!editingReview) return;
    
    await updateReview(editingReview.id, data);
    setEditingReview(null);
    setIsEditDialogOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    if (!deletingReviewId) return;
    
    const success = await deleteReview(deletingReviewId);
    if (success) {
      refetch();
    }
    setDeletingReviewId(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You haven't written any reviews yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start interacting with property owners to leave reviews
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showActions
                onEdit={handleEdit}
                onDelete={(id) => setDeletingReviewId(id)}
              />
            ))}
          </div>
        )}

        {/* Edit Review Dialog */}
        <ReviewForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdate}
          existingReview={editingReview}
          isEdit
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingReviewId} onOpenChange={(open) => !open && setDeletingReviewId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <BottomNav />
    </>
  );
}
