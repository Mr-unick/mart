import CustomersList from "@/components/customers-list";
import DashboardLayout from "../dashboard-layout";

export default function CustomersPage() {
    return (
        <DashboardLayout>
            <CustomersList />
        </DashboardLayout>
    )
}
