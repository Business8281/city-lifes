import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  // Fetch and pre-fill user profile data when dialog opens
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!open) {
        setFormData({ name: '', phone: '' });
        return;
      }

      if (!user) {
        setFormData({ name: '', phone: '' });
        return;
      }

      try {
        // First try database profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.full_name && profile?.phone) {
          // Database profile has complete data
          setFormData({
            name: profile.full_name,
            phone: profile.phone
          });
          return;
        }

        // Fallback chain for incomplete or missing profile
        const nameFromMetadata = 
          user.user_metadata?.full_name || 
          user.user_metadata?.name || 
          user.user_metadata?.display_name ||
          (user.email ? user.email.split('@')[0] : '');

        const phoneFromMetadata = 
          user.user_metadata?.phone || 
          user.phone || 
          profile?.phone || 
          '';

        setFormData({
          name: nameFromMetadata,
          phone: phoneFromMetadata
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        // Emergency fallback
        setFormData({
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          phone: user.user_metadata?.phone || ''
        });
      }
    };

    fetchUserProfile();
  }, [open, user]);

  // Retry logic for network failures
  const submitWithRetry = async (data: any, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const { data: result, error } = await supabase
          .from('leads')
          .insert(data)
          .select()
          .single();
        
        if (error) {
          // If it's the last retry, throw the error
          if (i === retries - 1) throw error;
          // Otherwise wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        
        return { data: result, error: null };
      } catch (err) {
        // Network error - retry
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    
    // Validation
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Please enter a valid name (minimum 2 characters)');
      return;
    }

    if (!trimmedPhone) {
      toast.error('Please enter your phone number');
      return;
    }

    // Phone validation - support multiple formats
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    // Validate owner ID
    if (!ownerId || ownerId.length === 0) {
      toast.error('Invalid listing - please try again');
      return;
    }
    
    setLoading(true);
    
    try {
      const leadData = {
        listing_id: listingId || null,
        owner_id: ownerId,
        user_id: user?.id || null,
        name: trimmedName,
        phone: trimmedPhone,
        email: user?.email || null,
        message: null,
        status: 'new',
        source: 'listing',
        lead_type: leadType,
        source_page: sourcePage,
        campaign_id: campaignId || null,
        category: category || null,
        subcategory: subcategory || null
      };

      // Submit with retry logic
      const result = await submitWithRetry(leadData);
      
      if (result?.data) {
        // Show prominent success message
        toast.success('✅ Inquiry Sent Successfully!', {
          description: `The owner will contact you at ${trimmedPhone}`,
          duration: 5000,
        });
        
        // Reset form
        setFormData({ name: '', phone: '' });
        
        // Close dialog immediately to show success
        onOpenChange(false);
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (error: any) {
      console.error('Lead submission error:', error);
      
      // User-friendly error messages with clear icons
      let errorMessage = '❌ Failed to submit inquiry. Please try again.';
      let errorDescription = 'If the problem persists, please contact support.';
      
      if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = '🌐 Network Error';
        errorDescription = 'Please check your internet connection and try again.';
      } else if (error?.code === '23505' || error?.message?.includes('already submitted')) {
        errorMessage = '⚠️ Already Submitted';
        errorDescription = 'You have already sent an inquiry for this listing.';
      } else if (error?.code === '23503') {
        errorMessage = '❌ Invalid Listing';
        errorDescription = 'Please refresh the page and try again.';
      } else if (error?.message) {
        errorDescription = error.message;
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset form to empty - will be refilled on next open
      setFormData({ name: '', phone: '' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => loading && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Contact Owner</DialogTitle>
          <DialogDescription className="space-y-2">
            <span className="block text-sm text-muted-foreground">Send your inquiry about:</span>
            <span className="block font-semibold text-foreground text-sm sm:text-base">{listingTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name" className="text-sm font-medium">Full Name *</Label>
            <Input 
              id="lead-name" 
              name="name"
              type="text"
              autoComplete="name"
              required 
              minLength={2}
              maxLength={100}
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Enter your name"
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone" className="text-sm font-medium">Phone Number *</Label>
            <Input 
              id="lead-phone" 
              name="phone"
              type="tel" 
              autoComplete="tel"
              required 
              minLength={10}
              maxLength={15}
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              placeholder="Enter your phone number"
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              The owner will contact you on this number
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="w-full sm:flex-1 order-2 sm:order-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || !formData.phone.trim()} 
              className="w-full sm:flex-1 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                '📤 Submit Inquiry'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
