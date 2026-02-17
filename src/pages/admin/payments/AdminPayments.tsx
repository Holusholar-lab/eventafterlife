import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const AdminPayments = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Host earnings and payment history.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment History
          </CardTitle>
          <p className="text-sm text-gray-600">
            View total earnings per host, pending payments, and payment history. Integrate with Selar or your payment processor for payouts.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Payment history will appear here when host payouts are configured.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
