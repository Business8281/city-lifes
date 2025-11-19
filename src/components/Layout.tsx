import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen fixed inset-0 overflow-hidden">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Main Content */}
  <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content - scrollable */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y px-safe-edge pt-safe-edge mobile-page"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <Outlet />
          </div>
        </SidebarInset>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
