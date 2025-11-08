import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Bell, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Not Logged In</h3>
            <p className="text-muted-foreground mb-6">
              Please login to view your profile
            </p>
            <Button onClick={() => navigate("/auth")}>Go to Login</Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || 'User'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Button className="w-full" onClick={() => toast.info("Edit profile coming soon!")}>
            Edit Profile
          </Button>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors"
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </Card>

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

export default Profile;
