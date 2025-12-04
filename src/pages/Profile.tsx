import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Home, TrendingUp, Settings, Shield, ChevronRight, LogOut, Users, ClipboardList, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useMyListings } from "@/hooks/useProperties";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { properties } = useMyListings(user?.id);
  const { conversations } = useMessages(user?.id);
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();

    // Subscribe to live changes to this user's profile so the UI stays fresh
    if (user?.id) {
      const channel = supabase
        .channel('profile-live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          () => loadProfile()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Edit Profile", path: "/profile/edit" },
    { icon: Home, label: "My Listings", path: "/my-listings" },
    { icon: TrendingUp, label: "Ad Campaign", path: "/ad-campaign" },
    { icon: Users, label: "CRM", path: "/crm" },
    { icon: ClipboardList, label: "Lead Management", path: "/leads" },
    { icon: AlertCircle, label: "My Reports", path: "/my-reports" },
    { icon: Shield, label: "Safety & Reports (Admin)", path: "/admin/reports", adminOnly: true },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Shield, label: "Admin Dashboard", path: "/admin-dashboard" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };


  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile?.full_name || user?.user_metadata?.full_name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {profile?.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{properties.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{conversations.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Chats</div>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
            // Hide Admin Dashboard for non-admin users
            if (item.path === '/admin-dashboard' && !isAdmin) {
              return null;
            }

            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
