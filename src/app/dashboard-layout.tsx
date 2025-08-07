import Link from 'next/link';
import {
  Package2,
  Users,
  LineChart,
  ShoppingCart,
  Map,
  Store,
  Settings,
  ShieldCheck,
  User,
  Users2,
  Palette,
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
import { CartProvider } from '@/context/cart-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
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
                      <Store />
                      <span>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Cart">
                    <Link href="/cart">
                      <ShoppingCart />
                      <span>Cart</span>
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
                  <SidebarMenuButton asChild tooltip="Customers">
                    <Link href="/customers">
                      <Users />
                      <span>Customers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Users">
                    <Link href="/users">
                      <Users2 />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Route Planner">
                    <Link href="/route-planner">
                      <Map />
                      <span>Route Planner</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Roles & Permissions">
                    <Link href="/roles-and-permissions">
                      <ShieldCheck />
                      <span>Roles &amp; Permissions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
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
    </CartProvider>
  );
}
