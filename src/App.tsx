import { useState, useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ensureAdminVideosLoaded } from "@/lib/admin-videos";
import { ensureRentalsLoaded } from "@/lib/rentals";
import { initializeAuth } from "@/lib/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/home";
import Library from "./pages/library";
import Community from "./pages/community";
import Watch from "./pages/watch";
import NotFound from "./pages/not-found";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Contact from "./pages/contact";
import Support from "./pages/support";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import AboutUs from "./pages/about-us";
import HowItWorks from "./pages/how-it-works";
import Profile from "./pages/profile";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard";
import UploadVideo from "./pages/admin/upload";
import ManageVideos from "./pages/admin/manage-videos";
import EditVideo from "./pages/admin/edit-video";
import Analytics from "./pages/admin/analytics";
import Settings from "./pages/admin/settings";
import ManageMessages from "./pages/admin/manage-messages";
import AdminUsers from "./pages/admin/users";
import AdminCategories from "./pages/admin/categories";
import AdminPartners from "./pages/admin/partners";
import AdminHosts from "./pages/admin/hosts";
import AdminCommissions from "./pages/admin/commissions";
import AdminPayments from "./pages/admin/payments";
import AdminSubscriptions from "./pages/admin/subscriptions";
import AdminForums from "./pages/admin/forums";
import AdminComments from "./pages/admin/comments";
import AdminNewsletter from "./pages/admin/newsletter";

const queryClient = new QueryClient();

const App = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Initialize auth session first (restore login state on page refresh)
    // Then load other data
    Promise.all([
      initializeAuth(), // Restore user session from Supabase/localStorage
      ensureAdminVideosLoaded(),
      ensureRentalsLoaded()
    ]).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <VercelAnalytics />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="upload" element={<UploadVideo />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="videos/edit/:id" element={<EditVideo />} />
            <Route path="hosts" element={<AdminHosts />} />
            <Route path="commissions" element={<AdminCommissions />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="forums" element={<AdminForums />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Index />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Navbar />
                <SignUp />
                <Footer />
              </>
            }
          />
          <Route
            path="/library"
            element={
              <>
                <Navbar />
                <Library />
                <Footer />
              </>
            }
          />
          <Route
            path="/community/:id?"
            element={
              <>
                <Navbar />
                <Community />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/support"
            element={
              <>
                <Navbar />
                <Support />
                <Footer />
              </>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <>
                <Navbar />
                <PrivacyPolicy />
                <Footer />
              </>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <>
                <Navbar />
                <TermsOfService />
                <Footer />
              </>
            }
          />
          <Route
            path="/about-us"
            element={
              <>
                <Navbar />
                <AboutUs />
                <Footer />
              </>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <>
                <Navbar />
                <HowItWorks />
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
                <Footer />
              </>
            }
          />
          <Route
            path="/watch/:id"
            element={
              <>
                <Navbar />
                <Watch />
                <Footer />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <NotFound />
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
