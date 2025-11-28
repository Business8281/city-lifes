import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  MessageCircle, 
  Mail, 
  Calendar,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/hooks/useLeads';

interface CampaignLeadsSectionProps {
  campaignId: string;
  campaignTitle: string;
  initialLeadCount?: number;
}

const CampaignLeadsSection = ({ campaignId, campaignTitle, initialLeadCount = 0 }: CampaignLeadsSectionProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaignLeads = async () => {
    if (!expanded) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties:listing_id (
            id,
            title,
            property_type,
            city,
            area
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('lead_type', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data || []) as Lead[]);
    } catch (error: any) {
      console.error('Error fetching campaign leads:', error);
      toast.error('Failed to load campaign leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchCampaignLeads();

      // Real-time subscription for campaign leads
      const channel = supabase
        .channel(`campaign-leads-${campaignId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `campaign_id=eq.${campaignId}`
        }, () => {
          fetchCampaignLeads();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [expanded, campaignId]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleChat = (lead: Lead) => {
    if (!lead.user_id) {
      toast.error('Cannot start chat: Lead user is not registered');
      return;
    }
    navigate(`/messages?user=${lead.user_id}&property=${lead.listing_id || ''}`);
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;
      toast.success(`Lead status updated to "${status.replace('_', ' ')}"`);
      fetchCampaignLeads();
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    const variants: Record<Lead['status'], string> = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      interested: 'bg-green-500',
      not_interested: 'bg-gray-500',
      closed: 'bg-purple-500'
    };
    return <Badge className={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="border-t pt-4 mt-4">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Campaign Leads
          <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-700 border-green-500/20">
            {expanded ? leads.length : initialLeadCount}
          </Badge>
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading campaign leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No paid leads yet for this campaign
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold">{lead.name}</h4>
                        {getStatusBadge(lead.status)}
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                          💰 Paid Lead
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      {lead.category && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {lead.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.message && (
                    <div className="p-3 bg-muted rounded-lg mb-3 text-sm">
                      <p className="italic">"{lead.message}"</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCall(lead.phone)}
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleChat(lead)}
                      disabled={!lead.user_id}
                    >
                      <MessageCircle className="h-3 w-3 mr-2" />
                      {lead.user_id ? 'Chat' : 'User Not Registered'}
                    </Button>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateLeadStatus(lead.id, value as Lead['status'])}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">🆕 New</SelectItem>
                        <SelectItem value="contacted">📞 Contacted</SelectItem>
                        <SelectItem value="interested">✅ Interested</SelectItem>
                        <SelectItem value="not_interested">❌ Not Interested</SelectItem>
                        <SelectItem value="closed">🔒 Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignLeadsSection;