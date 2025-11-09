import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, TrendingUp, Eye, MousePointerClick, DollarSign, PlayCircle, PauseCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { useAdCampaigns } from "@/hooks/useAdCampaigns";
import { format } from "date-fns";

const AdCampaign = () => {
  const navigate = useNavigate();
  const { campaigns, loading, updateCampaignStatus, deleteCampaign } = useAdCampaigns(true); // Only business campaigns

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

  const handleStatusToggle = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateCampaignStatus(campaignId, newStatus as 'active' | 'paused');
  };

  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await deleteCampaign(campaignId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background mobile-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-muted-foreground">Loading campaigns...</p>
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
              onClick={() => navigate("/listings?type=business")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">View</span> Businesses
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mobile-container md:px-4 py-6 space-y-6 overflow-x-hidden">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Business Campaigns</h2>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      {getStatusBadge(campaign.status)}
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
                </div>
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
                onClick={() => navigate("/listings?type=business")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                View Business Listings
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AdCampaign;
