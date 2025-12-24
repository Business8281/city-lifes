import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, TrendingUp, Eye, MousePointerClick, DollarSign, PlayCircle, PauseCircle, Trash2, Megaphone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAdCampaigns } from "@/hooks/useAdCampaigns";
import { useMyListings } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Property } from "@/types/database";
import CreateCampaignDialog from "@/components/CreateCampaignDialog";
import CampaignLeadsSection from "@/components/CampaignLeadsSection";

const AdCampaign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { campaigns, loading, updateCampaignStatus, deleteCampaign, createCampaign } = useAdCampaigns(true);
  const { properties: myProperties, loading: propertiesLoading } = useMyListings(user?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter only business listings that don't have active campaigns
  const activeCampaignPropertyIds = campaigns.map(c => c.property_id);
  const availableBusinesses = myProperties.filter(
    p => p.property_type === 'business' && !activeCampaignPropertyIds.includes(p.id)
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      completed: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leads_generated || 0), 0);

  const handleStatusToggle = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateCampaignStatus(campaignId, newStatus as 'active' | 'paused');
  };

  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await deleteCampaign(campaignId);
    }
  };

  const handleCreateCampaign = async (data: {
    property_id: string;
    title: string;
    budget: number;
    end_date: string;
    start_date?: string;
  }) => {
    await createCampaign(data);
  };

  const handleSelectBusiness = (property: Property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  if (loading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-background mobile-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mobile-page overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-6xl mx-auto mobile-container md:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Business Ad Campaigns</h1>
                <p className="text-sm text-muted-foreground">{campaigns.length} business campaigns</p>
              </div>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mobile-container md:px-4 py-6 space-y-6 overflow-x-hidden">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-xl font-bold">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-xl font-bold">{totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MousePointerClick className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-xl font-bold">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-xl font-bold text-green-600">{totalLeads.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Business Listings */}
        {availableBusinesses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Campaign</h2>
              <Badge variant="secondary">{availableBusinesses.length} available</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a business listing to create an ad campaign
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBusinesses.map((property) => (
                <Card key={property.id} className="p-4 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    {property.images && property.images[0] && (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">{property.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        📍 {property.area}, {property.city}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleSelectBusiness(property)}
                        className="gap-2"
                      >
                        <Megaphone className="h-3 w-3" />
                        Run Ad
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Campaigns</h2>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      {getStatusBadge(campaign.status)}
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-700 border-green-500/20"
                      >
                        🎯 {campaign.leads_generated || 0} Leads
                      </Badge>
                    </div>
                    {campaign.properties && (
                      <p className="text-sm text-muted-foreground mb-1">
                        📍 {campaign.properties.area}, {campaign.properties.city}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(campaign.start_date), 'MMM dd, yyyy')} to {format(new Date(campaign.end_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(campaign.id, campaign.status)}
                      disabled={campaign.status === 'completed'}
                    >
                      {campaign.status === 'active' ? (
                        <><PauseCircle className="h-4 w-4 mr-1" /> Pause</>
                      ) : (
                        <><PlayCircle className="h-4 w-4 mr-1" /> Resume</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold">₹{Number(campaign.budget).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="text-lg font-semibold">₹{Number(campaign.spent).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                    <p className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                    <p className="text-lg font-semibold text-green-600">{campaign.leads_generated || 0}</p>
                  </div>
                </div>

                {/* Paid Leads Management Section */}
                <CampaignLeadsSection
                  campaignId={campaign.id}
                  campaignTitle={campaign.title}
                  initialLeadCount={campaign.leads_generated || 0}
                />
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">No business campaigns yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create ad campaigns for your business listings to reach more customers
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateCampaignDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedProperty(null);
        }}
        property={selectedProperty}
        onCreateCampaign={handleCreateCampaign}
      />


    </div>
  );
};

export default AdCampaign;
