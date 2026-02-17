import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Globe,
  CreditCard,
  Mail,
  Percent,
  DollarSign,
  FileText,
  Users,
  Tag,
} from "lucide-react";

const settingsSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  supportEmail: z.string().email("Invalid email address"),
  newVideoUploads: z.boolean(),
  revenueMilestones: z.boolean(),
  weeklyAnalyticsDigest: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platformName: "Event Afterlife",
      supportEmail: "support@eventafterlife.com",
      newVideoUploads: true,
      revenueMilestones: true,
      weeklyAnalyticsDigest: false,
    },
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_settings");
      if (raw) {
        const data = JSON.parse(raw);
        form.reset(data);
      }
    } catch {}
    setLoaded(true);
  }, [form]);

  const onSubmit = async (data: SettingsValues) => {
    setIsSaving(true);
    try {
      localStorage.setItem("admin_settings", JSON.stringify(data));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Site, payment, email, commission, and more.</p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 gap-1 flex flex-wrap h-auto">
          <TabsTrigger value="site" className="data-[state=active]:bg-white">
            <Globe className="w-4 h-4 mr-2" />
            Site
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-white">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="commission" className="data-[state=active]:bg-white">
            <Percent className="w-4 h-4 mr-2" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-white">
            <FileText className="w-4 h-4 mr-2" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="admins" className="data-[state=active]:bg-white">
            <Users className="w-4 h-4 mr-2" />
            Admin users
          </TabsTrigger>
          <TabsTrigger value="marketing" className="data-[state=active]:bg-white">
            <Tag className="w-4 h-4 mr-2" />
            Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-6">
          {loaded && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">General</CardTitle>
                    <CardDescription>Site name, logo, and support contact.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="platformName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Platform Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Support Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Notifications</CardTitle>
                    <CardDescription>Admin notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="newVideoUploads"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-900">New video uploads</FormLabel>
                            <FormDescription className="text-gray-600">Get notified when processing completes</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="revenueMilestones"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-900">Revenue milestones</FormLabel>
                            <FormDescription className="text-gray-600">Alerts when you hit revenue goals</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weeklyAnalyticsDigest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-900">Weekly analytics digest</FormLabel>
                            <FormDescription className="text-gray-600">Summary of weekly performance</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Button type="submit" disabled={isSaving} className="bg-teal-500 hover:bg-teal-600 px-8">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="payment">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Payment (Selar)</CardTitle>
              <CardDescription>Selar integration details. View payment status and refunds from Subscriptions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Add your Selar API keys and webhook URL when ready. Payment settings will be stored securely.</p>
              <div className="space-y-3 max-w-md">
                <Input placeholder="Selar API key" className="border-gray-300" disabled />
                <Input placeholder="Webhook secret" className="border-gray-300" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Email (SMTP)</CardTitle>
              <CardDescription>SMTP and email templates for newsletters and transactional emails.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Configure SMTP server and default sender for newsletters and system emails.</p>
              <div className="space-y-3 max-w-md">
                <Input placeholder="SMTP host" className="border-gray-300" disabled />
                <Input placeholder="From email" className="border-gray-300" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Commission rates</CardTitle>
              <CardDescription>Commission rates for event hosts. View breakdown in Event Hosts → Commissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Set default host commission percentage. Overrides can be set per host.</p>
              <Input type="number" placeholder="e.g. 20" className="border-gray-300 max-w-[120px] mt-2" disabled />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Subscription pricing</CardTitle>
              <CardDescription>Subscription plans and pricing. Manage active subscriptions in Subscriptions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Configure plan tiers and prices when subscription plans are enabled.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Privacy & Terms</CardTitle>
              <CardDescription>Manage Privacy Policy and Terms of Service content or links.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Edit or link to your privacy policy and terms of service pages.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Admin user management</CardTitle>
              <CardDescription>Add or remove admin users. Access is currently controlled by VITE_ADMIN_EMAIL.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Only the email set in .env (VITE_ADMIN_EMAIL) can access the admin panel. Multi-admin support can be added later.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Marketing & Promotions</CardTitle>
              <CardDescription>Promo codes, discounts, landing page content, and referral tracking.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Create promo codes and discounts. Edit landing page content and track referral sources when marketing tools are enabled.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
