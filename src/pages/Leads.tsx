import { useState } from 'react';
import { useLeads, Lead } from '@/hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Trash2,
  Search,
  Filter,
  MessageCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useSearchParams } from 'react-router-dom';

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { leads, loading, updateLeadStatus, deleteLead } = useLeads();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

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

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesLeadType = leadTypeFilter === 'all' || lead.lead_type === leadTypeFilter;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.phone.includes(searchQuery);
    return matchesStatus && matchesLeadType && matchesSearch;
  });

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

  const getSourceBadge = (source: Lead['source']) => {
    const icons = {
      listing: '🏠',
      chat: '💬',
      whatsapp: '📱',
      call: '📞'
    };
    return <span className="text-sm">{icons[source]} {source}</span>;
  };

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Lead Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage organic leads from all categories including business listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">{leadStats.new}</div>
            <p className="text-sm text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{leadStats.contacted}</div>
            <p className="text-sm text-muted-foreground">Contacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{leadStats.interested}</div>
            <p className="text-sm text-muted-foreground">Interested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-500">{leadStats.closed}</div>
            <p className="text-sm text-muted-foreground">Closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Listing Stats */}
      {/* Lead Sources & Types Stats */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Lead Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Real-time breakdown of lead sources and types
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
        {/* Organic Leads Breakdown */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  🌱 {leads.filter(l => !l.campaign_id).length}
                </div>
                <p className="text-sm text-muted-foreground">Organic Leads</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-green-200/60">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-700">
                  {leads.filter(l => !l.campaign_id && l.source === 'call').length}
                </div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <Phone className="h-3 w-3" /> Calls
                </div>
              </div>
              <div className="text-center border-l border-green-200/60">
                <div className="text-lg font-semibold text-green-700">
                  {leads.filter(l => !l.campaign_id && (l.source === 'chat' || l.source === 'whatsapp')).length}
                </div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Chats
                </div>
              </div>
              <div className="text-center border-l border-green-200/60">
                <div className="text-lg font-semibold text-green-700">
                  {leads.filter(l => !l.campaign_id && l.source === 'listing').length}
                </div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> Forms
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paid Leads Breakdown */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  💰 {leads.filter(l => !!l.campaign_id).length}
                </div>
                <p className="text-sm text-muted-foreground">Paid Leads</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-blue-200/60">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-700">
                  {leads.filter(l => !!l.campaign_id && l.source === 'call').length}
                </div>
                <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                  <Phone className="h-3 w-3" /> Calls
                </div>
              </div>
              <div className="text-center border-l border-blue-200/60">
                <div className="text-lg font-semibold text-blue-700">
                  {leads.filter(l => !!l.campaign_id && (l.source === 'chat' || l.source === 'whatsapp')).length}
                </div>
                <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Chats
                </div>
              </div>
              <div className="text-center border-l border-blue-200/60">
                <div className="text-lg font-semibold text-blue-700">
                  {leads.filter(l => !!l.campaign_id && l.source === 'listing').length}
                </div>
                <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> Forms
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="lost">Not Interested</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading leads...
            </CardContent>
          </Card>
        ) : filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-3">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">No leads yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    When someone submits an inquiry on your properties, their contact details will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lead.properties?.title || 'Property inquiry'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(lead.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        {lead.lead_type === 'paid' ? '💰 Paid Lead' : '🌱 Organic Lead'}
                      </Badge>
                      {lead.category && (
                        <Badge variant="secondary">{lead.category}</Badge>
                      )}
                      {getSourceBadge(lead.source)}
                    </div>
                  </div>

                  {lead.message && (
                    <div className="flex gap-2 p-3 bg-muted rounded-lg">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{lead.message}</p>
                    </div>
                  )}

                  {/* Contact Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => handleCall(lead.phone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => handleChat(lead)}
                      disabled={!lead.user_id}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {lead.user_id ? 'Chat' : 'User Not Registered'}
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={async (value) => {
                        console.log('🔄 Status change triggered:', { leadId: lead.id, oldStatus: lead.status, newStatus: value });
                        await updateLeadStatus(lead.id, value as Lead['status']);
                      }}
                    >
                      <SelectTrigger className="w-full sm:flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">🆕 New</SelectItem>
                        <SelectItem value="contacted">📞 Contacted</SelectItem>
                        <SelectItem value="interested">✅ Interested</SelectItem>
                        <SelectItem value="lost">❌ Not Interested</SelectItem>
                        <SelectItem value="closed">🔒 Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this lead?')) {
                          deleteLead(lead.id);
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:hidden ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leads;
