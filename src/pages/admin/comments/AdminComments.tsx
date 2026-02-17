import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const AdminComments = () => {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Comments</h1>
        <p className="text-sm sm:text-base text-gray-600">Moderate comments and reported content.</p>
      </div>
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg sm:text-xl">Comments</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600">View reported content and moderate comments.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4 sm:p-8 text-center">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-600">Comment moderation will appear here when community is connected.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminComments;
