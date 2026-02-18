import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, getCurrentUserAsync, waitForAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  
  // Try to load user from Supabase if not found in localStorage
  useEffect(() => {
    // Always re-check user state on route change or login event
    const checkUser = () => {
      // First check synchronously (fastest) - don't wait for async
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return;
      }
      
      // If not found, try async load from Supabase
      getCurrentUserAsync().then((loadedUser) => {
        if (loadedUser) {
          setUser(loadedUser);
        }
      });
    };

    // Check immediately
    checkUser();

    // Listen for login events and auth initialization
    const handleLogin = () => {
      // Check multiple times to catch the user as soon as it's saved
      checkUser();
      setTimeout(checkUser, 50);
      setTimeout(checkUser, 100);
      setTimeout(checkUser, 200);
      setTimeout(checkUser, 500);
    };

    const handleAuthInit = () => {
      checkUser();
    };

    // Poll for user changes (useful after login)
    const pollInterval = setInterval(() => {
      if (!user) {
        checkUser();
      }
    }, 1000); // Check every second if no user

    window.addEventListener("user-logged-in", handleLogin);
    window.addEventListener("auth-initialized", handleAuthInit);
    
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("auth-initialized", handleAuthInit);
    };
  }, [location.pathname, user]); // Re-check on route change and when user changes
  
  const initials = user
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const links = [
    { to: "/", label: "Home" },
    { to: "/library", label: "Library" },
    { to: "/community", label: "Community" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-0 font-display text-xl font-bold tracking-tight">
          <span className="text-foreground">EVENT</span>
          <img 
            src={logo} 
            alt="Event Afterlife" 
            className="h-8 w-auto"
          />
          <span className="text-primary">AFTERLIFE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Profile"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium text-muted-foreground hover:text-primary mb-2">
                Sign In
              </Link>
              <Link to="/signup" className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
