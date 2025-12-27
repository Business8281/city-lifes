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
import { LoadingSpinner } from "./components/ui/loading-spinner";
import ScrollToTop from "./components/ScrollToTop";

// Route-based code splitting
const Index = lazy(() => import("./pages/Index"));
const Listings = lazy(() => import("./pages/Listings"));
const PropertyCategory = lazy(() => import("./pages/PropertyCategory"));
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
const CancellationRefundPolicy = lazy(() => import("./pages/CancellationRefundPolicy.tsx"));
const ContactPolicy = lazy(() => import("./pages/ContactPolicy.tsx"));
const AdCampaign = lazy(() => import("./pages/AdCampaign"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Leads = lazy(() => import("./pages/Leads"));
const CRM = lazy(() => import("./pages/CRM"));
const CampaignAnalytics = lazy(() => import("./pages/CampaignAnalytics"));
const UserReports = lazy(() => import("./pages/UserReports"));
const AdminReports = lazy(() => import("./pages/AdminReports"));

const ReviewModeration = lazy(() => import("./pages/ReviewModeration"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Subscription = lazy(() => import("./pages/Subscription"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
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
              <ScrollToTop />
              <Suspense fallback={<LoadingSpinner size={40} />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/setup-profile" element={<ProfileSetup />} />
                  <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                    <Route index element={<Index />} />
                    <Route path="listings" element={<Listings />} />
                    <Route path="category/:type" element={<PropertyCategory />} />
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
                    <Route path="cancellation-refund-policy" element={<CancellationRefundPolicy />} />
                    <Route path="contact-policy" element={<ContactPolicy />} />
                    <Route path="ad-campaign" element={<RequireAuth><AdCampaign /></RequireAuth>} />
                    <Route path="ad-campaign/:campaignId" element={<RequireAuth><CampaignAnalytics /></RequireAuth>} />
                    <Route path="leads" element={<RequireAuth><Leads /></RequireAuth>} />
                    <Route path="crm" element={<RequireAuth><CRM /></RequireAuth>} />
                    <Route path="my-reports" element={<RequireAuth><UserReports /></RequireAuth>} />
                    <Route path="admin/reports" element={<RequireAuth><AdminReports /></RequireAuth>} />

                    <Route path="admin/reviews" element={<RequireAuth><ReviewModeration /></RequireAuth>} />
                    <Route path="admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="subscription" element={<RequireAuth><Subscription /></RequireAuth>} />
                    <Route path="team" element={<RequireAuth><TeamManagement /></RequireAuth>} />
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
