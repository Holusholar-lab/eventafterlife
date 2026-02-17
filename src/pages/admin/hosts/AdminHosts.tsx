import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";

const AdminHosts = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Hosts</h1>
        <p className="text-gray-600">Manage event hosts and their content.</p>
      </div>
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Hosts
          </CardTitle>
          <p className="text-sm text-gray-600">
            List hosts, view uploaded content, commission tracking, and earnings. Approve or reject host applications.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Event host management will be available when host accounts are enabled.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHosts;
