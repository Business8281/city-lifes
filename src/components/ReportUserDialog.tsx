import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useReports, CreateReportInput } from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';

interface ReportUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUserId: string;
  reportedUserName?: string;
  listingId?: string;
}

const REASON_TYPES = [
  { value: 'fraud', label: 'Fraud' },
  { value: 'cheating', label: 'Cheating' },
  { value: 'misleading', label: 'Misleading Information' },
  { value: 'inactive_owner', label: 'Inactive Owner' },
  { value: 'spam', label: 'Spam' },
  { value: 'abuse', label: 'Abuse or Harassment' },
  { value: 'other', label: 'Other' }
] as const;

export function ReportUserDialog({
  open,
  onOpenChange,
  reportedUserId,
  reportedUserName,
  listingId
}: ReportUserDialogProps) {
  const [reasonType, setReasonType] = useState<CreateReportInput['reason_type']>('fraud');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { createReport } = useReports();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      return;
    }

    setSubmitting(true);
    const result = await createReport({
      reported_user_id: reportedUserId,
      listing_id: listingId,
      reason_type: reasonType,
      description: description.trim()
    });

    if (result) {
      setDescription('');
      setReasonType('fraud');
      onOpenChange(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              {reportedUserName && `Report ${reportedUserName} for violating our community guidelines.`}
              {!reportedUserName && 'Report this user for violating our community guidelines.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Reporting</Label>
              <Select value={reasonType} onValueChange={(value) => setReasonType(value as any)}>
                <SelectTrigger id="reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASON_TYPES.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about why you're reporting this user..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Describe the issue in detail. Your report will be reviewed by our safety team.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !description.trim()}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
