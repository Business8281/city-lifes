import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, HelpCircle, LogOut, Shield, FileText, ImagePlus, RefreshCcw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useSupport } from "@/hooks/useSupport";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { createTicket, loading: submitting } = useSupport();

  const [supportOpen, setSupportOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const previews = useMemo(() => files.map(f => ({ name: f.name, url: URL.createObjectURL(f) })), [files]);

  const onSelectFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const list = Array.from(e.target.files || []);
    const images = list.filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...images]);
  };

  const resetSupportForm = () => {
    setSubject("");
    setDescription("");
    setFiles([]);
  };

  const handleSubmitSupport = async () => {
    if (!user) {
      toast.info("Please sign in to contact support.");
      navigate("/auth");
      return;
    }
    if (!description.trim()) {
      toast.error("Please describe your issue.");
      return;
    }
    try {
      await createTicket({ subject: subject.trim() || undefined, description: description.trim(), files });
      toast.success("Support request sent. We'll get back to you soon.");
      setSupportOpen(false);
      resetSupportForm();
    } catch (err: unknown) {
      console.error("Support submit failed", err);
      const message = err instanceof Error ? err.message : "Failed to submit support request";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">

        {/* Notifications section removed */}

        {/* Legal */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Legal</h2>
          <Card className="divide-y">
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => navigate("/privacy-policy")}
            >
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span>Privacy Policy</span>
            </button>
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => navigate("/terms-of-service")}
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>Terms of Service</span>
            </button>
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => navigate("/cancellation-refund-policy")}
            >
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
              <span>Cancellations and Refunds</span>
            </button>
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => navigate("/contact-policy")}
            >
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>Contact Us</span>
            </button>

          </Card>
        </div>

        {/* General */}
        <div>
          <h2 className="text-lg font-semibold mb-3">General</h2>
          <Card className="divide-y">
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => toast.info("Language settings coming soon!")}
            >
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span>Language</span>
            </button>
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => setSupportOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span>Help & Support</span>
            </button>
          </Card>
        </div>

        {/* Help & Support Dialog */}
        <Dialog open={supportOpen} onOpenChange={(o) => { setSupportOpen(o); if (!o) resetSupportForm(); }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="support-subject">Subject (optional)</Label>
                <Input id="support-subject" placeholder="Short title" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-desc">Describe your issue</Label>
                <Textarea id="support-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us what happened..." rows={5} />
              </div>
              <div className="space-y-2">
                <Label>Attach screenshots/photos (optional)</Label>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="secondary" onClick={() => document.getElementById('support-files')?.click()} className="gap-2">
                    <ImagePlus className="h-4 w-4" /> Upload images
                  </Button>
                  <input id="support-files" type="file" accept="image/*" multiple className="hidden" onChange={onSelectFiles} />
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {previews.map(p => (
                      <img key={p.url} src={p.url} alt={p.name} className="w-full h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSupportOpen(false)} disabled={submitting}>Cancel</Button>
              <Button onClick={handleSubmitSupport} disabled={submitting} className="min-w-24">
                {submitting ? 'Sending…' : 'Send'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>

        <div className="text-center text-sm text-muted-foreground pt-4">
          Version 2.0.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
