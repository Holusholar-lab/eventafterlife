import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, LogOut, Play, Clock, Eye, MessageSquare, Filter, Calendar, CreditCard, Bell, Mail, Shield, Download } from "lucide-react";
import { getCurrentUser, getCurrentUserAsync, logout } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRentals, ensureRentalsLoaded } from "@/lib/rentals";
import { getAllAdminVideos } from "@/lib/admin-videos";
import { getPublicVideo } from "@/lib/public-videos";
import { formatDistanceToNow } from "date-fns";
import VideoCard from "@/components/VideoCard";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState("overview");
  const [watchHistoryFilter, setWatchHistoryFilter] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    ensureRentalsLoaded();
    
    // Try to load user from Supabase if not found
    if (!user) {
      getCurrentUserAsync().then((loadedUser) => {
        if (loadedUser) {
          setUser(loadedUser);
        } else {
          // Redirect to login if no user found
          navigate("/login?redirect=/profile", { replace: true });
        }
      });
    }
  }, [navigate, user]);

  // Show loading or redirect if no user
  if (!user) {
    return null; // Will redirect in useEffect
  }
    return null;
  }

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Get user's rentals and watched videos
  const rentals = getRentals();
  const allVideos = getAllAdminVideos();
  const activeRentals = rentals.filter((r) => r.expiresAt > Date.now());
  const watchedVideos = rentals
    .map((r) => {
      const video = allVideos.find((v) => v.id === r.videoId);
      return video ? { ...r, video } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => b.rentedAt - a.rentedAt);

  // Quick stats
  const stats = {
    videosWatched: watchedVideos.length,
    savedVideos: 0, // Placeholder - would come from a "saved" feature
    forumPosts: 0, // Placeholder - would come from forum data
  };

  // Continue watching (active rentals)
  const continueWatching = activeRentals
    .map((r) => {
      const video = allVideos.find((v) => v.id === r.videoId);
      return video ? { rental: r, video } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  // Recent activity (placeholder - would come from activity log)
  const recentActivity = [
    { type: "rental", message: "Rented a video", time: "2 hours ago" },
    { type: "watch", message: "Watched a video", time: "1 day ago" },
    { type: "forum", message: "Posted in forum", time: "2 days ago" },
  ];

  // Filter watch history
  const filteredWatchHistory = useMemo(() => {
    if (watchHistoryFilter === "all") return watchedVideos;
    const now = Date.now();
    const filterTime = {
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: now - 30 * 24 * 60 * 60 * 1000,
      year: now - 365 * 24 * 60 * 60 * 1000,
    }[watchHistoryFilter] || 0;
    return watchedVideos.filter((w) => w.rentedAt >= filterTime);
  }, [watchedVideos, watchHistoryFilter]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container max-w-6xl px-4">
        {/* Profile Header */}
        <Card className="border border-border mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-display font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{user.fullName}</h1>
                  <p className="text-sm text-muted-foreground">Subscriber since {memberSince}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted p-1">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="history" className="text-sm">Watch History</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
            <TabsTrigger value="billing" className="text-sm">Billing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.videosWatched}</p>
                      <p className="text-xs text-muted-foreground">Videos watched</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.savedVideos}</p>
                      <p className="text-xs text-muted-foreground">Saved videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.forumPosts}</p>
                      <p className="text-xs text-muted-foreground">Forum posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Continue Watching */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Watching</CardTitle>
                <CardDescription>Videos you're currently renting</CardDescription>
              </CardHeader>
              <CardContent>
                {continueWatching.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No active rentals. Browse the library to rent a video.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {continueWatching.map(({ rental, video }) => {
                      const publicVideo = getPublicVideo(video.id);
                      if (!publicVideo) return null;
                      const progress = ((Date.now() - rental.rentedAt) / (rental.expiresAt - rental.rentedAt)) * 100;
                      return (
                        <div key={rental.videoId} className="relative">
                          <Link to={`/watch/${video.id}`}>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-2">
                              <img
                                src={publicVideo.image}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">{video.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(rental.expiresAt), { addSuffix: true })}
                            </p>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="p-2 rounded-full bg-muted">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Watch History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Watch History</CardTitle>
                    <CardDescription>All videos you've rented and watched</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={watchHistoryFilter} onValueChange={setWatchHistoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="year">This year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredWatchHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No watch history yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWatchHistory.map(({ video, rental }) => {
                      const publicVideo = getPublicVideo(video.id);
                      if (!publicVideo) return null;
                      return (
                        <div key={rental.videoId}>
                          <VideoCard
                            {...publicVideo}
                            onRent={() => {}}
                          />
                          <div className="mt-2 text-xs text-muted-foreground">
                            Watched {formatDistanceToNow(new Date(rental.rentedAt), { addSuffix: true })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.fullName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Email Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Email Preferences</CardTitle>
                <CardDescription>Control what emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Receive updates and new content</p>
                  </div>
                  <Switch defaultChecked={user.newsletter} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional content and offers</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New video alerts</Label>
                    <p className="text-sm text-muted-foreground">When new videos are added</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your active subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Pay-per-view</p>
                    <p className="text-sm text-muted-foreground">Rent videos individually</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">No payment method on file</p>
                      <p className="text-xs text-muted-foreground">Add a payment method to rent videos</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchedVideos.slice(0, 5).map(({ video, rental }) => {
                    const price = { "24": 2.99, "48": 4.99, "72": 6.99 }[rental.plan] || 0;
                    return (
                      <div key={rental.videoId} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium text-foreground">{video.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(rental.rentedAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-foreground">${price.toFixed(2)}</span>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {watchedVideos.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No billing history yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
