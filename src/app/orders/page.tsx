import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "../dashboard-layout";

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No orders yet. This is a placeholder.</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
