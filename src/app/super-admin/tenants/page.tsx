import DashboardLayout from "@/app/dashboard-layout";
import TenantsList from "@/components/tenants-list";
import { prisma } from "@/lib/db";

export default async function TenantsPage() {
    const tenants = await prisma.tenant.findMany({
      where: {
        id: {
          not: 'system' // Exclude the system tenant
        }
      }
    });

    return (
        <DashboardLayout>
            <TenantsList initialTenants={tenants} />
        </DashboardLayout>
    )
}
