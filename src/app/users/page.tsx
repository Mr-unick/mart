import DashboardLayout from "@/app/dashboard-layout";
import UsersList from "@/components/users-list";

export default function UsersPage() {
    return (
        <DashboardLayout>
            <UsersList />
        </DashboardLayout>
    )
}
