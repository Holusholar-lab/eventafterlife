import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Mail, FileText } from "lucide-react";
import { getAllUsersForAdmin } from "@/lib/auth";

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsersForAdmin();
      setSubscribers(users.filter((u) => u.newsletter).length);
    };
    loadUsers();
  }, []);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Newsletter</h1>
        <p className="text-sm sm:text-base text-gray-600">Email subscriber list, send newsletters, templates, and campaign analytics.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{subscribers}</p>
            <p className="text-xs text-gray-500">Users who opted in to newsletter at signup</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-600">Email templates and scheduled emails will be configured here.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg sm:text-xl">Send Newsletter</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600">
            Compose and send newsletters, schedule emails, and view campaign analytics (open rates, click rates). Segment subscribers by interest or activity.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4 sm:p-8 text-center">
            <Send className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-600 mb-4">Connect an email provider (SMTP) in Settings to send newsletters.</p>
            <Button variant="outline" disabled className="border-gray-300 w-full sm:w-auto">
              Send newsletter (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletter;
