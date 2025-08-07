
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/types';
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
    DialogTrigger,
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
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    defaultPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
    dataAiHint: z.string().optional(),
});

function ProductForm({ product, onSave, onOpenChange }: { product: Partial<Product> | null, onSave: (product: Product) => void, onOpenChange: (open: boolean) => void }) {
    if (!product) return null;
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            id: product.id,
            name: product.name || '',
            description: product.description || '',
            defaultPrice: product.defaultPrice || 0,
            imageUrl: product.imageUrl || 'https://placehold.co/600x400.png',
            dataAiHint: product.dataAiHint || '',
        }
    });

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        const method = values.id ? 'PUT' : 'POST';
        const url = values.id ? `/api/products/${values.id}` : '/api/products';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to save product');
            }
            const savedProduct = await response.json();
            onSave(savedProduct);
            toast({
                title: `Product ${values.id ? 'Updated' : 'Created'}`,
                description: `${values.name} has been saved successfully.`
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Could not save product.', variant: 'destructive' });
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="defaultPrice" render={({ field }) => (
                    <FormItem><FormLabel>Default Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} placeholder="e.g. coffee mug" /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Product</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default function ProductMaster() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                toast({ title: "Error", description: "Could not load product data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [toast]);

    const handleSave = (savedProduct: Product) => {
        if (selectedProduct?.id) {
            setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
        } else {
            setProducts([...products, savedProduct]);
        }
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    }
    
    const handleAddNew = () => {
        setSelectedProduct({});
        setIsFormOpen(true);
    }

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            const response = await fetch(`/api/products/${productToDelete.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setProducts(products.filter(p => p.id !== productToDelete.id));
            toast({ title: "Product Deleted", description: `${productToDelete.name} has been deleted.` });
        } catch (error) {
             toast({ title: 'Error', description: 'Could not delete product.', variant: 'destructive' });
        } finally {
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Product Master</CardTitle>
                            <CardDescription>Manage all products for your tenant.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="max-w-sm truncate">{product.description}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(Number(product.defaultPrice))}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">Delete</DropdownMenuItem>
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
                        <DialogTitle>{selectedProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>Fill in the details for the product below.</DialogDescription>
                    </DialogHeader>
                    <ProductForm product={selectedProduct} onSave={handleSave} onOpenChange={setIsFormOpen} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product &quot;{productToDelete?.name}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
