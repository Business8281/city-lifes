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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[Lead Form] Submit button clicked');
    console.log('[Lead Form] Form data:', formData);
    
    // Validate form data
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    
    console.log('[Lead Form] Trimmed values:', { name: trimmedName, phone: trimmedPhone });
    
    if (!trimmedName) {
      console.warn('[Lead Form] Validation failed: Name is empty');
      toast.error('Please enter your name');
      return;
    }
    
    if (!trimmedPhone) {
      console.warn('[Lead Form] Validation failed: Phone is empty');
      toast.error('Please enter your phone number');
      return;
    }
    
    // Basic phone validation (at least 10 digits)
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      console.warn('[Lead Form] Validation failed: Phone too short');
      toast.error('Please enter a valid phone number (minimum 10 digits)');
      return;
    }
    
    console.log('[Lead Form] Validation passed, starting submission');
    setLoading(true);
    
    try {
      const leadPayload = {
        listing_id: listingId,
        owner_id: ownerId,
        name: trimmedName,
        phone: trimmedPhone,
        email: null,
        message: null,
        status: 'new' as const,
        source: 'listing' as const,
        lead_type: leadType,
        source_page: sourcePage,
        campaign_id: campaignId || null,
        category: category || null,
        subcategory: subcategory || null
      };
      
      console.log('[Lead Form] Submitting inquiry with payload:', leadPayload);

      const result = await createLead(leadPayload);

      console.log('[Lead Form] Inquiry submitted successfully:', result);
      
      if (result) {
        console.log('[Lead Form] Showing success toast');
        toast.success('Inquiry sent successfully!', {
          description: 'The owner will contact you soon.',
          duration: 3000,
        });
        
        // Reset form
        console.log('[Lead Form] Resetting form');
        setFormData({
          name: '',
          phone: ''
        });
        
        // Close dialog after short delay for better UX
        console.log('[Lead Form] Closing dialog in 500ms');
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      } else {
        console.error('[Lead Form] No result returned from createLead');
        throw new Error('Failed to create lead - no result returned');
      }
    } catch (error: any) {
      console.error('[Lead Form] Submission error caught:', error);
      console.error('[Lead Form] Error type:', typeof error);
      console.error('[Lead Form] Error message:', error?.message);
      console.error('[Lead Form] Error stack:', error?.stack);
      
      toast.error('Failed to submit inquiry', {
        description: error?.message || 'Please check your connection and try again.',
        duration: 5000,
      });
    } finally {
      console.log('[Lead Form] Setting loading to false');
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
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              name="name"
              type="text"
              autoComplete="name"
              required 
              value={formData.name} 
              onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} 
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              autoComplete="tel"
              required 
              value={formData.phone} 
              onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} 
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || !formData.phone.trim()} 
              className="flex-1"
            >
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