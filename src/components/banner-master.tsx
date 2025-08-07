
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Banner } from '@/types';
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
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import Image from 'next/image';

const bannerSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Banner title is required'),
    imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
    isActive: z.boolean(),
});

function BannerForm({ banner, onSave, onOpenChange }: { banner: Partial<Banner> | null, onSave: (banner: Banner) => void, onOpenChange: (open: boolean) => void }) {
    if (!banner) return null;
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof bannerSchema>>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            id: banner.id,
            title: banner.title || '',
            imageUrl: banner.imageUrl || 'https://placehold.co/1200x400.png',
            isActive: banner.isActive === undefined ? true : banner.isActive,
        }
    });

    const onSubmit = async (values: z.infer<typeof bannerSchema>) => {
        const method = values.id ? 'PUT' : 'POST';
        const url = values.id ? `/api/banners/${values.id}` : '/api/banners';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to save banner');
            }
            const savedBanner = await response.json();
            onSave(savedBanner);
            toast({
                title: `Banner ${values.id ? 'Updated' : 'Created'}`,
                description: `${values.title} has been saved successfully.`
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Could not save banner.', variant: 'destructive' });
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Banner Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <p className="text-sm text-muted-foreground">Is this banner currently visible?</p>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Banner</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default function BannerMaster() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBanner, setSelectedBanner] = useState<Partial<Banner> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchBanners() {
            setLoading(true);
            try {
                const res = await fetch('/api/banners');
                const data = await res.json();
                setBanners(data);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
                toast({ title: "Error", description: "Could not load banner data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchBanners();
    }, [toast]);

    const handleSave = (savedBanner: Banner) => {
        if (selectedBanner?.id) {
            setBanners(banners.map(b => b.id === savedBanner.id ? savedBanner : b));
        } else {
            setBanners([savedBanner, ...banners]);
        }
    }

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsFormOpen(true);
    }
    
    const handleAddNew = () => {
        setSelectedBanner({});
        setIsFormOpen(true);
    }

    const handleDelete = (banner: Banner) => {
        setBannerToDelete(banner);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        try {
            const response = await fetch(`/api/banners/${bannerToDelete.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setBanners(banners.filter(b => b.id !== bannerToDelete.id));
            toast({ title: "Banner Deleted", description: `Banner ${bannerToDelete.title} has been deleted.` });
        } catch (error) {
             toast({ title: 'Error', description: 'Could not delete banner.', variant: 'destructive' });
        } finally {
            setIsDeleteDialogOpen(false);
            setBannerToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Banner Master</CardTitle>
                            <CardDescription>Manage promotional banners for your product page.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Banner
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-12 w-20 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                banners.map((banner) => (
                                    <TableRow key={banner.id}>
                                        <TableCell>
                                            <Image src={banner.imageUrl} alt={banner.title} width={80} height={40} className="rounded-md object-cover aspect-[2/1]" />
                                        </TableCell>
                                        <TableCell className="font-medium">{banner.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(banner)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(banner)} className="text-destructive">Delete</DropdownMenuItem>
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
                        <DialogTitle>{selectedBanner?.id ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                        <DialogDescription>Fill in the details for the banner below.</DialogDescription>
                    </DialogHeader>
                    <BannerForm banner={selectedBanner} onSave={handleSave} onOpenChange={setIsFormOpen} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the banner &quot;{bannerToDelete?.title}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBannerToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
