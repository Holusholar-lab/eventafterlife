import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import {
  Upload,
  Video,
  BarChart3,
  Settings,
  LayoutDashboard,
  LogOut,
  Play,
  Eye,
  Mail,
  Users,
  FolderOpen,
  UserPlus,
  CreditCard,
  DollarSign,
  MessageSquare,
  FileText,
  Send,
  ChevronDown,
  Tag,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/lib/auth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();

const AdminLayout = () => {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (ADMIN_EMAIL && user.email.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to view the admin panel.</p>
          <Link to="/" className="text-teal-600 hover:underline">Return to site</Link>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const contentOpenPath =
    location.pathname.startsWith("/admin/videos") ||
    location.pathname.startsWith("/admin/upload") ||
    location.pathname.startsWith("/admin/categories");
  const hostsOpenPath =
    location.pathname.startsWith("/admin/hosts") ||
    location.pathname.startsWith("/admin/commissions") ||
    location.pathname.startsWith("/admin/payments");
  const communityOpenPath =
    location.pathname.startsWith("/admin/forums") ||
    location.pathname.startsWith("/admin/comments");

  const [contentOpen, setContentOpen] = useState(contentOpenPath);
  const [hostsOpen, setHostsOpen] = useState(hostsOpenPath);
  const [communityOpen, setCommunityOpen] = useState(communityOpenPath);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (contentOpenPath) setContentOpen(true);
    if (hostsOpenPath) setHostsOpen(true);
    if (communityOpenPath) setCommunityOpen(true);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navSections = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    {
      label: "Content",
      icon: FolderOpen,
      open: contentOpen,
      onOpenChange: setContentOpen,
      children: [
        { path: "/admin/videos", label: "All Videos", icon: Video },
        { path: "/admin/upload", label: "Add New", icon: Upload },
        { path: "/admin/categories", label: "Categories", icon: Tag },
      ],
    },
    {
      label: "Event Hosts",
      icon: UserPlus,
      open: hostsOpen,
      onOpenChange: setHostsOpen,
      children: [
        { path: "/admin/hosts", label: "All Hosts", icon: Users },
        { path: "/admin/commissions", label: "Commissions", icon: CreditCard },
        { path: "/admin/payments", label: "Payments", icon: DollarSign },
      ],
    },
    { path: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    {
      label: "Community",
      icon: MessageSquare,
      open: communityOpen,
      onOpenChange: setCommunityOpen,
      children: [
        { path: "/admin/forums", label: "Forums", icon: MessageSquare },
        { path: "/admin/comments", label: "Comments", icon: FileText },
      ],
    },
    { path: "/admin/newsletter", label: "Newsletter", icon: Send },
    { path: "/admin/messages", label: "Messages", icon: Mail },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#212B36] text-white border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Event Afterlife</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-[#212B36] text-white overflow-y-auto z-40 transition-transform duration-300",
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <div className="p-6 border-b border-gray-700 lg:block hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Event Afterlife</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navSections.map((item) => {
              if ("path" in item) {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      active ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              }

              const Icon = item.icon;
              return (
                <Collapsible
                  key={item.label}
                  open={item.open}
                  onOpenChange={(v) => (item as { onOpenChange?: (v: boolean) => void }).onOpenChange?.(v)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.label}
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 data-[state=open]:rotate-180 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-4 mt-1 space-y-1 border-l border-gray-700 ml-2">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.path);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "flex items-center gap-2 py-2 pl-3 rounded-r-lg text-sm transition-colors",
                              childActive
                                ? "bg-teal-500/20 text-teal-400 border-l-2 border-teal-500 -ml-[2px] pl-[10px]"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            )}
                          >
                            <ChildIcon className="w-4 h-4 shrink-0" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-700 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
              View as Guest
            </a>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen bg-white pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
