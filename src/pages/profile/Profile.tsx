import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Bell, LogOut } from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/profile", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground">Your account information</p>
        </div>

        <Card className="border border-border">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-display font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="font-display text-xl">{user.fullName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Full name</p>
                <p className="text-sm text-muted-foreground">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Member since</p>
                <p className="text-sm text-muted-foreground">{memberSince}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Bell className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Newsletter</p>
                <p className="text-sm text-muted-foreground">
                  {user.newsletter ? "You're subscribed to updates" : "Not subscribed"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/90 border border-destructive/50 rounded-md hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
          <Link
            to="/library"
            className="text-sm text-primary hover:underline"
          >
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
