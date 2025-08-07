
"use client";

import { useState } from 'react';
import { mockOrders } from '@/data/mock-data';
import type { Order } from '@/types';
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

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

function OrderDetailsDialog({ order, isOpen, onOpenChange }: { order: Order | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
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
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                             <div key={index} className="flex justify-between items-center">
                                <span className="text-sm">{item.quantity}x {item.product.name}</span>
                                <span className="text-sm">{formatCurrency(item.lineTotal)}</span>
                            </div>
                        ))}
                    </div>
                    <Separator />
                     <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        {order.couponDiscount && (
                            <div className="flex justify-between text-accent">
                                <span className="text-muted-foreground">Coupon ({order.couponDiscount.code})</span>
                                <span>- {formatCurrency(order.couponDiscount.amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>{formatCurrency(order.totalTax)}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Grand Total</span>
                        <span>{formatCurrency(order.grandTotal)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function OrdersList() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (order: Order) => {
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
                            {mockOrders.map((order) => (
                                <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(order.grandTotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <OrderDetailsDialog order={selectedOrder} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
