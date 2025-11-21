import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { format } from 'date-fns';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_CONFIG = {
  new: { label: 'New', icon: Clock, className: 'bg-blue-500/10 text-blue-500' },
  in_review: { label: 'In Review', icon: AlertCircle, className: 'bg-yellow-500/10 text-yellow-500' },
  action_taken: { label: 'Action Taken', icon: CheckCircle, className: 'bg-green-500/10 text-green-500' },
  dismissed: { label: 'Dismissed', icon: XCircle, className: 'bg-gray-500/10 text-gray-500' }
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

export default function UserReports() {
  const { reports, loading } = useReports();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reports</h1>
          <p className="text-muted-foreground">
            Track the status of reports you've submitted
          </p>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Reports</h3>
              <p className="text-muted-foreground">
                You haven't submitted any reports yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const statusConfig = STATUS_CONFIG[report.status];
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">
                          Report against {report.reported_user?.full_name || 'User'}
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(report.created_at), 'MMM dd, yyyy \'at\' h:mm a')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Reason: </span>
                      <span className="text-sm text-muted-foreground">
                        {REASON_LABELS[report.reason_type]}
                      </span>
                    </div>
                    {report.listing && (
                      <div>
                        <span className="text-sm font-medium">Listing: </span>
                        <span className="text-sm text-muted-foreground">
                          {report.listing.title}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-1">Description:</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    {report.admin_notes && report.status === 'action_taken' && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-1">Admin Response:</p>
                        <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
