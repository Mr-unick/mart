
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Coupon } from '@/types';
import { CouponType } from '@prisma/client';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from './ui/badge';

const couponSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(1, 'Coupon code is required').max(20, 'Code must be 20 characters or less'),
    type: z.nativeEnum(CouponType),
    discount: z.coerce.number().min(0.01, 'Discount must be greater than 0'),
    isActive: z.boolean(),
});

function CouponForm({ coupon, onSave, onOpenChange }: { coupon: Partial<Coupon> | null, onSave: (coupon: Coupon) => void, onOpenChange: (open: boolean) => void }) {
    if (!coupon) return null;
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof couponSchema>>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            id: coupon.id,
            code: coupon.code || '',
            type: coupon.type || CouponType.FIXED,
            discount: coupon.discount || 0,
            isActive: coupon.isActive === undefined ? true : coupon.isActive,
        }
    });

    const onSubmit = async (values: z.infer<typeof couponSchema>) => {
        const method = values.id ? 'PUT' : 'POST';
        const url = values.id ? `/api/coupons/${values.id}` : '/api/coupons';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to save coupon');
            }
            const savedCoupon = await response.json();
            onSave(savedCoupon);
            toast({
                title: `Coupon ${values.id ? 'Updated' : 'Created'}`,
                description: `${values.code} has been saved successfully.`
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Could not save coupon.', variant: 'destructive' });
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="code" render={({ field }) => (
                    <FormItem><FormLabel>Coupon Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value={CouponType.FIXED}>Fixed</SelectItem>
                                <SelectItem value={CouponType.PERCENTAGE}>Percentage</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="discount" render={({ field }) => (
                        <FormItem><FormLabel>Discount Value</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <p className="text-sm text-muted-foreground">Is this coupon currently available for use?</p>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Coupon</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default function CouponMaster() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoupon, setSelectedCoupon] = useState<Partial<Coupon> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchCoupons() {
            setLoading(true);
            try {
                const res = await fetch('/api/coupons');
                const data = await res.json();
                setCoupons(data);
            } catch (error) {
                console.error("Failed to fetch coupons:", error);
                toast({ title: "Error", description: "Could not load coupon data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchCoupons();
    }, [toast]);

    const handleSave = (savedCoupon: Coupon) => {
        if (selectedCoupon?.id) {
            setCoupons(coupons.map(c => c.id === savedCoupon.id ? savedCoupon : c));
        } else {
            setCoupons([...coupons, savedCoupon]);
        }
    }

    const handleEdit = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsFormOpen(true);
    }
    
    const handleAddNew = () => {
        setSelectedCoupon({});
        setIsFormOpen(true);
    }

    const handleDelete = (coupon: Coupon) => {
        setCouponToDelete(coupon);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!couponToDelete) return;
        try {
            const response = await fetch(`/api/coupons/${couponToDelete.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setCoupons(coupons.filter(c => c.id !== couponToDelete.id));
            toast({ title: "Coupon Deleted", description: `Coupon ${couponToDelete.code} has been deleted.` });
        } catch (error) {
             toast({ title: 'Error', description: 'Could not delete coupon.', variant: 'destructive' });
        } finally {
            setIsDeleteDialogOpen(false);
            setCouponToDelete(null);
        }
    };
    
    const formatDiscount = (coupon: Coupon) => {
      if (coupon.type === CouponType.PERCENTAGE) {
        return `${Number(coupon.discount)}%`;
      }
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(coupon.discount));
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Coupon Master</CardTitle>
                            <CardDescription>Manage all coupons for your tenant.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Coupon
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-medium">{coupon.code}</TableCell>
                                        <TableCell>{coupon.type}</TableCell>
                                        <TableCell>{formatDiscount(coupon)}</TableCell>
                                        <TableCell>
                                            <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(coupon)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(coupon)} className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCoupon?.id ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
                        <DialogDescription>Fill in the details for the coupon below.</DialogDescription>
                    </DialogHeader>
                    <CouponForm coupon={selectedCoupon} onSave={handleSave} onOpenChange={setIsFormOpen} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the coupon &quot;{couponToDelete?.code}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCouponToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
