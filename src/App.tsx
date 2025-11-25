import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { useAppInitialize } from "./hooks/useAppInitialize";

// Route-based code splitting
const Index = lazy(() => import("./pages/Index"));
const Listings = lazy(() => import("./pages/Listings"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));
const MapView = lazy(() => import("./pages/MapView"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Messages = lazy(() => import("./pages/Messages"));
const AddProperty = lazy(() => import("./pages/AddProperty"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Settings = lazy(() => import("./pages/Settings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const AdCampaign = lazy(() => import("./pages/AdCampaign"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Leads = lazy(() => import("./pages/Leads"));
const CRM = lazy(() => import("./pages/CRM"));
const CampaignAnalytics = lazy(() => import("./pages/CampaignAnalytics"));
const UserReports = lazy(() => import("./pages/UserReports"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const MyReviews = lazy(() => import("./pages/MyReviews"));
const ReviewModeration = lazy(() => import("./pages/ReviewModeration"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  useAppInitialize();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/setup-profile" element={<ProfileSetup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="property/:id" element={<PropertyDetails />} />
                  <Route path="user/:userId" element={<UserProfile />} />
                  <Route path="favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
                  <Route path="map" element={<MapView />} />
                    <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
                    <Route path="profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
                    <Route path="messages" element={<RequireAuth><Messages /></RequireAuth>} />
                    <Route path="add-property" element={<RequireAuth><AddProperty /></RequireAuth>} />
                    <Route path="my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
                    <Route path="settings" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="ad-campaign" element={<RequireAuth><AdCampaign /></RequireAuth>} />
                  <Route path="ad-campaign/:campaignId" element={<RequireAuth><CampaignAnalytics /></RequireAuth>} />
                   <Route path="leads" element={<RequireAuth><Leads /></RequireAuth>} />
                    <Route path="crm" element={<RequireAuth><CRM /></RequireAuth>} />
                    <Route path="my-reports" element={<RequireAuth><UserReports /></RequireAuth>} />
                    <Route path="admin/reports" element={<RequireAuth><AdminReports /></RequireAuth>} />
                    <Route path="my-reviews" element={<RequireAuth><MyReviews /></RequireAuth>} />
                    <Route path="admin/reviews" element={<RequireAuth><ReviewModeration /></RequireAuth>} />
                    <Route path="admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
