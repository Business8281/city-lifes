import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { User, Home, Heart, TrendingUp, Settings, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyListings } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import { useMessages } from "@/hooks/useMessages";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { properties } = useMyListings(user?.id);
  const { favorites } = useFavorites(user?.id);
  const { conversations } = useMessages(user?.id);

  const menuItems = [
    { icon: User, label: "Edit Profile", path: "/profile/edit" },
    { icon: Home, label: "My Listings", path: "/my-listings" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: TrendingUp, label: "Ad Campaign", path: "/ad-campaign" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Shield, label: "Admin Dashboard", path: "/admin-dashboard" },
  ];


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
              <h2 className="text-2xl font-bold">{user?.user_metadata?.full_name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email || 'admin@urbanrent.com'}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{properties.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{favorites.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{conversations.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Chats</div>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
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
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
