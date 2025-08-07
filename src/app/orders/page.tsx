import OrdersList from "@/components/orders-list";
import DashboardLayout from "../dashboard-layout";

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrdersList />
    </DashboardLayout>
  );
}
