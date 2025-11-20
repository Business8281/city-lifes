import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdCampaigns } from '@/hooks/useAdCampaigns';
import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics';
import { useLeads } from '@/hooks/useLeads';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  MousePointer,
  Activity
} from 'lucide-react';

export default function CampaignAnalytics() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { campaigns, loading: campaignsLoading } = useAdCampaigns();
  const { analytics, loading: analyticsLoading } = useCampaignAnalytics(campaignId || null);
  const { leads, loading: leadsLoading } = useLeads();

  const campaign = campaigns.find(c => c.id === campaignId);
  const campaignLeads = leads.filter(l => l.campaign_id === campaignId);

  if (campaignsLoading || analyticsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <Button onClick={() => navigate('/ad-campaign')}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Leads',
      value: analytics?.total_leads || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Organic Leads',
      value: analytics?.organic_leads || 0,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Paid Leads',
      value: analytics?.paid_leads || 0,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversion_rate?.toFixed(1) || 0}%`,
      icon: MousePointer,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Cost Per Lead',
      value: `₹${analytics?.cpl?.toFixed(0) || 0}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Impressions',
      value: campaign.impressions || 0,
      icon: Eye,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Clicks',
      value: campaign.clicks || 0,
      icon: MousePointer,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      title: 'Budget Spent',
      value: `₹${campaign.spent || 0}`,
      icon: DollarSign,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/ad-campaign')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <p className="text-muted-foreground mt-2">Campaign Analytics</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads from this Campaign</CardTitle>
            <CardDescription>
              Showing {campaignLeads.length} leads generated from this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : campaignLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leads generated yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaignLeads.slice(0, 10).map(lead => (
                  <div 
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.phone} • {lead.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {lead.lead_type === 'paid' ? 'Paid Lead' : 'Organic Lead'}
                        </Badge>
                        <Badge variant={
                          lead.status === 'new' ? 'default' :
                          lead.status === 'interested' ? 'default' :
                          lead.status === 'closed' ? 'default' :
                          'secondary'
                        }>
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/leads`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
