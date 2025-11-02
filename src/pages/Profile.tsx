import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Bell, Settings, HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const menuItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Guest User</h2>
              <p className="text-muted-foreground">guest@citylifes.com</p>
            </div>
          </div>
          
          <Button className="w-full">Edit Profile</Button>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className="flex items-center gap-3 w-full p-4 hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white">
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
