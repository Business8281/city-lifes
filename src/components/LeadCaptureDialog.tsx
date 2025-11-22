import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLeads } from '@/hooks/useLeads';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  ownerId: string;
  listingTitle: string;
  leadType?: 'organic' | 'paid';
  sourcePage?: 'listing_page' | 'category_page' | 'internal_ad';
  campaignId?: string;
  category?: string;
  subcategory?: string;
}
export const LeadCaptureDialog = ({
  open,
  onOpenChange,
  listingId,
  ownerId,
  listingTitle,
  leadType = 'organic',
  sourcePage = 'listing_page',
  campaignId,
  category,
  subcategory
}: LeadCaptureDialogProps) => {
  const {
    createLead
  } = useLeads();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting lead with data:', {
        listing_id: listingId,
        owner_id: ownerId,
        name: formData.name,
        phone: formData.phone
      });

      const result = await createLead({
        listing_id: listingId,
        owner_id: ownerId,
        user_id: null,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: null,
        message: null,
        status: 'new',
        source: 'listing',
        lead_type: leadType,
        source_page: sourcePage,
        campaign_id: campaignId || null,
        category: category || null,
        subcategory: subcategory || null
      });

      console.log('Lead created successfully:', result);
      
      if (result) {
        toast.success('Your inquiry has been sent successfully!');
        setFormData({
          name: '',
          phone: ''
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Owner</DialogTitle>
          <DialogDescription className="space-y-2">
            <span className="block text-sm text-muted-foreground">Send your inquiry about:</span>
            <span className="block font-semibold text-foreground text-base">{listingTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" required value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} placeholder="Enter your phone number" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </> : 'Submit Inquiry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};