
"use client";

import { useState, useEffect } from 'react';
import type { Order, OrderItem as OrderItemType, Product } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatDate = (dateString: string | Date) => new Date(dateString).toLocaleDateString();

// Prisma returns decimal values as strings, let's ensure they are numbers
type OrderWithItems = Order & { items: (OrderItemType & { product: Product })[] };

function OrderDetailsDialog({ order, isOpen, onOpenChange }: { order: OrderWithItems | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    if (!order) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Order {order.orderNumber}</DialogTitle>
                    <DialogDescription>
                        Placed on {formatDate(order.createdAt)} for {order.customerName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Delivery Address</h3>
                        <p className="text-sm text-muted-foreground">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                        {order.items.map((item, index) => (
                             <div key={index} className="flex justify-between items-center">
                                <span className="text-sm">{item.quantity}x {item.product.name}</span>
                                <span className="text-sm">{formatCurrency(Number(item.lineTotal))}</span>
                            </div>
                        ))}
                    </div>
                    <Separator />
                     <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(Number(order.subtotal))}</span>
                        </div>
                        {order.couponDiscount && (
                            <div className="flex justify-between text-accent">
                                <span className="text-muted-foreground">Coupon ({order.couponDiscount.code})</span>
                                <span>- {formatCurrency(Number(order.couponDiscount.amount))}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>{formatCurrency(Number(order.totalTax))}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Grand Total</span>
                        <span>{formatCurrency(Number(order.grandTotal))}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function OrdersList() {
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

     useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            try {
                const res = await fetch('/api/orders');
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast({ title: "Error", description: "Could not load orders.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [toast]);

    const handleRowClick = (order: OrderWithItems) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>A list of your recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>{order.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(Number(order.grandTotal))}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <OrderDetailsDialog order={selectedOrder} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
