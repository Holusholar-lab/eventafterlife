import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

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

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platformName: "VidAdmin",
      supportEmail: "admin@vidadmin.com",
      newVideoUploads: true,
      revenueMilestones: true,
      weeklyAnalyticsDigest: false,
    },
  });

  const onSubmit = async (data: SettingsValues) => {
    setIsSaving(true);
    try {
      // Save settings to localStorage
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your platform configuration.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">General</CardTitle>
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

          {/* Notifications */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newVideoUploads"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-gray-900">New video uploads</FormLabel>
                      <FormDescription className="text-gray-600">
                        Get notified when processing completes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-teal-500"
                      />
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
                      <FormDescription className="text-gray-600">
                        Alerts when you hit revenue goals
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-teal-500"
                      />
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
                      <FormDescription className="text-gray-600">
                        Summary of weekly performance
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-teal-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-teal-500 hover:bg-teal-600 px-8"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
