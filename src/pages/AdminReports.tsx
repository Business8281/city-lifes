import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminReports } from '@/hooks/useAdminReports';
import { format } from 'date-fns';
import { AlertCircle, Shield } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-500/10 text-blue-500' },
  in_review: { label: 'In Review', className: 'bg-yellow-500/10 text-yellow-500' },
  action_taken: { label: 'Action Taken', className: 'bg-green-500/10 text-green-500' },
  dismissed: { label: 'Dismissed', className: 'bg-gray-500/10 text-gray-500' }
};

const REASON_LABELS = {
  fraud: 'Fraud',
  cheating: 'Cheating',
  misleading: 'Misleading Information',
  inactive_owner: 'Inactive Owner',
  spam: 'Spam',
  abuse: 'Abuse',
  other: 'Other'
};

const ACTION_OPTIONS = [
  { value: 'warning', label: 'Send Warning' },
  { value: 'suspend_7d', label: 'Suspend 7 Days' },
  { value: 'suspend_30d', label: 'Suspend 30 Days' },
  { value: 'suspend_permanent', label: 'Suspend Permanently' },
  { value: 'ban', label: 'Ban User' },
  { value: 'listing_removed', label: 'Remove Listing' },
  { value: 'dismissed', label: 'Dismiss Report' }
];

export default function AdminReports() {
  const { reports, loading, stats, applyAdminAction } = useAdminReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'warning' | 'suspend_7d' | 'suspend_30d' | 'suspend_permanent' | 'ban' | 'listing_removed' | 'dismissed' | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredReports = reports.filter(report => {
    if (activeTab === 'all') return true;
    return report.status === activeTab;
  });

  const handleTakeAction = (report: any) => {
    setSelectedReport(report);
    setActionDialogOpen(true);
    setActionType('');
    setAdminNotes('');
  };

  const handleSubmitAction = async () => {
    if (!actionType || !selectedReport) return;

    setSubmitting(true);
    await applyAdminAction(selectedReport.id, actionType as any, adminNotes);
    setSubmitting(false);
    setActionDialogOpen(false);
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">User Safety & Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review and take action on user reports
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_reports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.new_reports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fraud Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.fraud_reports}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Action Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.action_taken}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Review and manage user reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="in_review">In Review</TabsTrigger>
              <TabsTrigger value="action_taken">Action Taken</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Reports</h3>
                  <p className="text-muted-foreground">
                    No reports found in this category
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">
                                {REASON_LABELS[report.reason_type]}
                              </CardTitle>
                              <Badge variant="outline" className={STATUS_CONFIG[report.status].className}>
                                {STATUS_CONFIG[report.status].label}
                              </Badge>
                            </div>
                            <CardDescription>
                              Reported {format(new Date(report.created_at), 'MMM dd, yyyy \'at\' h:mm a')}
                            </CardDescription>
                          </div>
                          {report.status === 'new' || report.status === 'in_review' ? (
                            <Button size="sm" onClick={() => handleTakeAction(report)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Take Action
                            </Button>
                          ) : null}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Reporter:</p>
                            <p className="text-sm text-muted-foreground">
                              {report.reporter?.full_name || 'Unknown'} ({report.reporter?.email})
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Reported User:</p>
                            <p className="text-sm text-muted-foreground">
                              {report.reported_user?.full_name || 'Unknown'} ({report.reported_user?.email})
                            </p>
                            {(report.reported_user as any)?.safety_score !== undefined && (
                              <p className="text-sm text-muted-foreground">
                                Safety Score: {(report.reported_user as any).safety_score}/100
                              </p>
                            )}
                          </div>
                        </div>
                        {report.listing && (
                          <div>
                            <p className="text-sm font-medium mb-1">Listing:</p>
                            <p className="text-sm text-muted-foreground">
                              {report.listing.title} - {report.listing.property_type}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium mb-1">Description:</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                        {report.admin_notes && (
                          <div className="pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Admin Notes:</p>
                            <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Take Action on Report</DialogTitle>
            <DialogDescription>
              Select an action to take against the reported user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={actionType} onValueChange={(value) => setActionType(value as any)}>
                <SelectTrigger id="action" className="w-full">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="max-h-[300px] overflow-y-auto"
                >
                  {ACTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this action..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setActionDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmitAction} disabled={!actionType || submitting} className="w-full sm:w-auto">
              {submitting ? 'Applying...' : 'Apply Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
