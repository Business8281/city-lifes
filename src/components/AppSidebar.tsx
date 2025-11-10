import { Home, Map, MessageCircle, Heart, User, Plus, FileText, Bell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Profile", url: "/profile", icon: User },
];

const actionItems = [
  { title: "Add Property", url: "/add-property", icon: Plus },
  { title: "My Listings", url: "/my-listings", icon: FileText },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);

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
  }, [user]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitial = () => {
    const name = profile?.full_name || user?.user_metadata?.full_name || user?.email;
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary">citylifes</h1>
              <p className="text-xs text-muted-foreground">Find your perfect space</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* User Section */}
        {!isCollapsed && (
          <>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-accent text-accent-foreground">{getUserInitial()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{profile?.full_name || user?.user_metadata?.full_name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
          </>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && <Separator className="my-2" />}

        {/* Action Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
