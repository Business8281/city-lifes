import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    
    if (!trimmedName || !trimmedPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number (minimum 10 digits)');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          listing_id: listingId,
          owner_id: ownerId,
          name: trimmedName,
          phone: trimmedPhone,
          email: null,
          message: null,
          status: 'new',
          source: 'listing',
          lead_type: leadType,
          source_page: sourcePage,
          campaign_id: campaignId || null,
          category: category || null,
          subcategory: subcategory || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        toast.success('Inquiry sent successfully!', {
          description: 'The owner will contact you soon.'
        });
        
        setFormData({ name: '', phone: '' });
        setTimeout(() => onOpenChange(false), 500);
      }
    } catch (error: any) {
      console.error('Lead creation error:', error);
      toast.error('Failed to submit inquiry', {
        description: error?.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Label htmlFor="lead-name">Full Name *</Label>
            <Input 
              id="lead-name" 
              name="name"
              type="text"
              autoComplete="name"
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone Number *</Label>
            <Input 
              id="lead-phone" 
              name="phone"
              type="tel" 
              autoComplete="tel"
              required 
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })} 
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Inquiry'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
