import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Lock, Globe, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
        {/* Appearance */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Appearance</h2>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" />
            </div>
          </Card>
        </div>

        {/* Notifications section removed */}

        {/* Privacy & Security */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Privacy & Security</h2>
          <Card className="divide-y">
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => toast.info("Change password coming soon!")}
            >
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span>Change Password</span>
            </button>
            <button
              className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors text-left"
              onClick={() => toast.info("Privacy settings coming soon!")}
            >
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span>Privacy Settings</span>
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
              onClick={() => toast.info("Help center coming soon!")}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span>Help & Support</span>
            </button>
          </Card>
        </div>

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
