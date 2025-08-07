import Link from 'next/link';
import {
  Package2,
  Users,
  LineChart,
  ShoppingCart,
  Map,
  Truck,
} from 'lucide-react';

import Header from '@/components/header';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>Customer</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Products">
                  <Link href="/products">
                    <ShoppingCart />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <Link href="/orders">
                    <Package2 />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Internal</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Route Planner">
                  <Link href="/route-planner">
                    <Map />
                    <span>Route Planner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen w-full bg-background">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
