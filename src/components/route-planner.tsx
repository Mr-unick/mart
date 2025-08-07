
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Checkbox } from './ui/checkbox';
import { mockOrders, mockDrivers, mockVehicles } from '@/data/mock-data';
import type { Order, RoutePlan } from '@/types';
import { generateRoutePlan } from '@/ai/flows/route-planner-flow';
import { Bot, Loader2, MapPinned, Truck } from 'lucide-react';

const RoutePlanDisplay = ({ plans }: { plans: RoutePlan[] }) => {
  return (
    <div className="space-y-6">
      {plans.map((plan) => (
        <Card key={plan.driverId}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Route for {plan.driverName}
            </CardTitle>
            <CardDescription>
              Vehicle: {plan.vehicleName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3" />
              {plan.stops.sort((a,b) => a.sequence - b.sequence).map((stop, index) => (
                <div key={stop.orderId} className="relative flex items-start gap-4 mb-6">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold ring-8 ring-background">
                    {stop.sequence}
                  </div>
                  <div>
                    <p className="font-semibold">{stop.customerName}</p>
                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                    <p className="text-xs text-muted-foreground">Order ID: {stop.orderId}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function RoutePlanner() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleGeneratePlan = async () => {
    if (selectedOrders.size === 0) return;
    setIsLoading(true);
    setRoutePlans([]);
    try {
        const ordersToRoute = mockOrders.filter((o) => selectedOrders.has(o.id));
        const result = await generateRoutePlan({
            orders: ordersToRoute,
            drivers: mockDrivers,
            vehicles: mockVehicles,
            warehouseAddress: "1 Rocket Road, Hawthorne, CA 90250"
        });
        setRoutePlans(result);
    } catch (error) {
        console.error("Failed to generate route plan:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>
                    Select orders to include in the route plan.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                        <Checkbox
                            checked={selectedOrders.size === mockOrders.length && mockOrders.length > 0}
                            onCheckedChange={(checked) => {
                            setSelectedOrders(
                                checked ? new Set(mockOrders.map((o) => o.id)) : new Set()
                            );
                            }}
                        />
                        </TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {mockOrders.map((order: Order) => (
                        <TableRow key={order.id}>
                        <TableCell>
                            <Checkbox
                            checked={selectedOrders.has(order.id)}
                            onCheckedChange={() => handleSelectOrder(order.id)}
                            />
                        </TableCell>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{`${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}</TableCell>
                        <TableCell>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.grandTotal)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGeneratePlan} disabled={selectedOrders.size === 0 || isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        Generate Plan
                    </Button>
                </CardFooter>
            </Card>
        </div>
      <div className="lg:col-span-1">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPinned className="h-6 w-6" />
                    Generated Route Plan
                </CardTitle>
                <CardDescription>
                    AI-optimized delivery routes for your drivers.
                </CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating optimized routes...</p>
              </div>
            )}
            {!isLoading && routePlans.length === 0 && (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-center text-muted-foreground">No route plan generated yet.</p>
                </div>
            )}
            {routePlans.length > 0 && <RoutePlanDisplay plans={routePlans} />}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
