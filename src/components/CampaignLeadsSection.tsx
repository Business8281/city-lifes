import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

const CampaignLeadsSection = ({ campaignId, initialLeadCount = 0 }: CampaignLeadsSectionProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaignLeads = useCallback(async () => {
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
  }, [expanded, campaignId]);

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
  }, [expanded, campaignId, fetchCampaignLeads]);



  const getStatusBadge = (status: Lead['status']) => {
    const variants: Record<Lead['status'], string> = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      interested: 'bg-green-500',
      lost: 'bg-gray-500',
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
          {/* Lead Source Breakdown */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="bg-orange-50/50 border-orange-200">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {leads.filter(l => l.source === 'call').length}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Phone className="h-3 w-3" /> Calls
                </div>
              </CardContent>
            </Card>
            <Card className="bg-cyan-50/50 border-cyan-200">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-cyan-600">
                  {leads.filter(l => l.source === 'chat' || l.source === 'whatsapp').length}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Chats
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50/50 border-purple-200">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {leads.filter(l => l.source === 'listing').length}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> Forms
                </div>
              </CardContent>
            </Card>
          </div>
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

                  <div
                    className="flex flex-col sm:flex-row gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors"
                    onClick={() => navigate(`/leads?search=${lead.phone}`)}
                  >
                    <div className="flex-1 text-sm text-muted-foreground flex items-center gap-2">
                      <span>Click to view details in Lead Management</span>
                      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    </div>
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