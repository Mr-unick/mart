import DashboardLayout from "@/app/dashboard-layout";
import TenantsList from "@/components/tenants-list";

export default function TenantsPage() {
    return (
        <DashboardLayout>
            <TenantsList />
        </DashboardLayout>
    )
}
