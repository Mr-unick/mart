
"use client";

import { useState } from 'react';
import { mockCustomers } from '@/data/mock-data';
import type { Customer } from '@/types';
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

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function CustomerDetailsDialog({ customer, isOpen, onOpenChange }: { customer: Customer | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    if (!customer) return null;
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{customer.name}</DialogTitle>
                    <DialogDescription>
                        {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zip}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <h3 className="font-semibold mb-2">Specific Pricing</h3>
                    {customer.specificPrices && Object.keys(customer.specificPrices).length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(customer.specificPrices).map(([productId, price]) => (
                                    <TableRow key={productId}>
                                        <TableCell>{productId}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(price)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">No specific pricing for this customer.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function CustomersList() {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>A list of all customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCustomers.map((customer) => (
                                <TableRow key={customer.id} onClick={() => handleRowClick(customer)} className="cursor-pointer">
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>{`${customer.address.city}, ${customer.address.state}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CustomerDetailsDialog customer={selectedCustomer} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
