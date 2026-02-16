import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ensureAdminVideosLoaded } from "@/lib/admin-videos";
import { ensureRentalsLoaded } from "@/lib/rentals";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard";
import UploadVideo from "./pages/admin/upload";
import ManageVideos from "./pages/admin/manage-videos";
import EditVideo from "./pages/admin/edit-video";
import Analytics from "./pages/admin/analytics";
import Settings from "./pages/admin/settings";
import ManageMessages from "./pages/admin/manage-messages";

const queryClient = new QueryClient();

const App = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([ensureAdminVideosLoaded(), ensureRentalsLoaded()]).then(() => setReady(true));
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
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="upload" element={<UploadVideo />} />
            <Route path="videos" element={<ManageVideos />} />
            <Route path="videos/edit/:id" element={<EditVideo />} />
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
            path="/community"
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
