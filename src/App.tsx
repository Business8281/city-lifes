import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { useAppInitialize } from "./hooks/useAppInitialize";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Favorites from "./pages/Favorites";
import MapView from "./pages/MapView";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";
import Settings from "./pages/Settings";
import AdCampaign from "./pages/AdCampaign";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useAppInitialize();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="listings" element={<Listings />} />
                <Route path="property/:id" element={<PropertyDetails />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="map" element={<MapView />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="messages" element={<Messages />} />
                <Route path="add-property" element={<AddProperty />} />
                <Route path="my-listings" element={<MyListings />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ad-campaign" element={<AdCampaign />} />
                <Route path="admin-dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
