import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Pin } from "lucide-react";

const AdminForums = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum Management</h1>
        <p className="text-gray-600">View and moderate forum posts. Create categories, pin discussions, and manage content.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Forums
          </CardTitle>
          <p className="text-sm text-gray-600">
            View all forum posts and comments, approve or delete content, ban or warn users, create forum categories, and pin important discussions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Forum moderation will appear here when the community forum is connected to the admin panel.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForums;
