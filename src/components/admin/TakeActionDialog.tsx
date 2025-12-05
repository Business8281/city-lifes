import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TakeActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAction: (action: string, notes: string) => Promise<void>;
    reportId: string;
}

export function TakeActionDialog({ open, onOpenChange, onAction, reportId }: TakeActionDialogProps) {
    const [action, setAction] = useState<string>("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!action) return;
        setLoading(true);
        try {
            await onAction(action, notes);
            onOpenChange(false);
            setAction("");
            setNotes("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Take Action on Report</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Action</Label>
                        <Select value={action} onValueChange={setAction}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="warning">Send Warning</SelectItem>
                                <SelectItem value="suspend_7d">Suspend 7 Days</SelectItem>
                                <SelectItem value="suspend_30d">Suspend 30 Days</SelectItem>
                                <SelectItem value="suspend_permanent">Suspend Permanently</SelectItem>
                                <SelectItem value="ban">Ban User</SelectItem>
                                <SelectItem value="listing_removed">Remove Listing</SelectItem>
                                <SelectItem value="dismissed">Dismiss Report</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Admin Notes (Optional)</Label>
                        <Textarea
                            placeholder="Reason for action..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!action || loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Action
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
