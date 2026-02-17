import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp } from "lucide-react";

const AdminSubscriptions = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriptions</h1>
        <p className="text-gray-600">Active, cancelled, and expired subscriptions. Revenue reports and Selar integration.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">—</p>
            <p className="text-xs text-gray-500">When subscription plans are enabled</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Revenue (this month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">—</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Subscription Management</CardTitle>
          <p className="text-sm text-gray-600">
            List active and cancelled subscriptions, manage plans, view revenue reports, and handle refunds. Connect Selar in Settings for payment status.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <p className="text-gray-600">Subscription data will appear here when subscription plans and payment integration are configured.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
