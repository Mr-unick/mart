
"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockCustomers, mockProducts } from '@/data/mock-data';
import type { Customer, Product } from '@/types';
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
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const pricingSchema = z.object({
    prices: z.record(z.string(), z.coerce.number().min(0, "Price must be positive").optional())
});

function CustomerDetailsDialog({ customer, isOpen, onOpenChange }: { customer: Customer | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    if (!customer) return null;
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof pricingSchema>>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            prices: customer.specificPrices || {}
        }
    });

    const onSubmit = (values: z.infer<typeof pricingSchema>) => {
        console.log("Updated prices for", customer.name, values.prices);
        toast({
            title: "Pricing Updated",
            description: `Specific pricing for ${customer.name} has been saved.`
        });
        onOpenChange(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{customer.name}</DialogTitle>
                            <DialogDescription>
                                {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zip}
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <h3 className="font-semibold mb-4">Customer Specific Pricing</h3>
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="w-40">Default Price</TableHead>
                                                <TableHead className="w-48">Specific Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockProducts.map((product: Product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell>{formatCurrency(product.defaultPrice)}</TableCell>
                                                    <TableCell>
                                                        <FormField 
                                                            control={form.control}
                                                            name={`prices.${product.id}`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input 
                                                                            type="number" 
                                                                            step="0.01"
                                                                            placeholder="Default" 
                                                                            {...field} 
                                                                            onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit">Save Prices</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </FormProvider>
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