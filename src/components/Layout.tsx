import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Header with sidebar trigger for desktop */}
          <header className="sticky top-0 z-40 hidden md:flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          
          {/* Page Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
