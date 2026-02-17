import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const AdminCommissions = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Commissions</h1>
        <p className="text-gray-600">Commission tracking per event host.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Commission Tracking
          </CardTitle>
          <p className="text-sm text-gray-600">
            View commission rates, earnings per host, and configure commission settings in Settings.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Commission data will appear here when event hosts and revenue sharing are configured.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommissions;
