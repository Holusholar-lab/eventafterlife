import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { login, getCurrentUser, saveUserToLocalStorage } from "@/lib/auth";
import { ensureRentalsLoaded } from "@/lib/rentals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      await ensureRentalsLoaded();
      
      // Ensure user is saved and available immediately
      if (result.user) {
        // Force save user (login() should have already done this, but ensure it)
        saveUserToLocalStorage(result.user);
        
        // Wait a moment for localStorage to be written
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verify user is now available
        const verifyUser = getCurrentUser();
        console.log("Login successful - User ID:", result.user.id);
        console.log("Session token:", localStorage.getItem("afterlife_session"));
        console.log("User available in getCurrentUser():", verifyUser ? "Yes" : "No");
        console.log("User data:", verifyUser);
        
        if (!verifyUser) {
          console.error("CRITICAL: User not found after login! Attempting to fix...");
          // Try one more time with explicit save
          saveUserToLocalStorage(result.user);
          const retryUser = getCurrentUser();
          console.log("After retry, user available:", retryUser ? "Yes" : "No");
          
          if (!retryUser) {
            toast({
              title: "Login issue detected",
              description: "Please refresh the page after login.",
              variant: "destructive",
            });
            // Still redirect, but user might need to refresh
          }
        }
      }
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      
      // Force Navbar to refresh by triggering a custom event BEFORE navigation
      window.dispatchEvent(new Event("user-logged-in"));
      
      // Verify user one final time before redirect
      const finalUserCheck = getCurrentUser();
      if (!finalUserCheck && result.user) {
        // Last attempt - save user again
        saveUserToLocalStorage(result.user);
        console.log("Final save attempt - User ID:", result.user.id);
      }
      
      // Use window.location for hard redirect to ensure clean state
      // Increased delay to ensure everything is saved
      setTimeout(() => {
        const targetPath = redirectTo || "/";
        console.log("Redirecting to:", targetPath);
        console.log("User should be available:", getCurrentUser() ? "Yes" : "No");
        window.location.href = targetPath;
      }, 500);
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Sign In</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
