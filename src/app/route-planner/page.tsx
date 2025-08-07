import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "../dashboard-layout";

export default function RoutePlannerPage() {
  return (
    <DashboardLayout>
       <Card>
        <CardHeader>
          <CardTitle>Route Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Route planning functionality coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
