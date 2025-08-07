
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import type { Tenant } from '@prisma/client';
import { Separator } from './ui/separator';

const formSchema = z.object({
    name: z.string().min(1, 'Tenant name is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip code is required'),
    ownerName: z.string().min(1, "Owner's name is required"),
    ownerEmail: z.string().email("Invalid email for owner"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type TenantFormDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (tenant: Tenant) => void;
    tenant: Tenant | null;
};

export default function TenantFormDialog({ isOpen, onOpenChange, onSave, tenant }: TenantFormDialogProps) {
    const { toast } = useToast();
    const isEditing = !!tenant;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            ownerName: '',
            ownerEmail: '',
            password: '',
            confirmPassword: '',
        }
    });
    
    React.useEffect(() => {
        if (isOpen) {
            form.reset({
                name: tenant?.name || '',
                street: tenant?.street || '',
                city: tenant?.city || '',
                state: tenant?.state || '',
                zip: tenant?.zip || '',
                ownerName: tenant?.ownerName || '',
                ownerEmail: tenant?.ownerEmail || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [isOpen, tenant, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would call an API to save the tenant
        // For now, we'll just log it and show a toast
        console.log(values);

        // This is a mock response, in a real app this would come from the server
        const savedTenant: Tenant = {
            id: tenant?.id || `tenant_${Date.now()}`,
            ...values,
        };
        
        onSave(savedTenant);
        toast({ 
            title: isEditing ? "Tenant Updated" : "Tenant Created", 
            description: `Tenant ${values.name} has been saved successfully.` 
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? `Editing details for ${tenant.name}.` : 'Create a new tenant and their primary administrator.'}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                             <h4 className="text-sm font-medium">Tenant Information</h4>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tenant Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Innovate Corp" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Tech Avenue" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Silicon Valley" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CA" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="94043" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <Separator className="my-4" />

                            <h4 className="text-sm font-medium">Tenant Owner / Admin</h4>
                             <FormField
                                control={form.control}
                                name="ownerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner's Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Alice Admin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="ownerEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner's Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="alice@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                 <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit">Save Tenant</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
}
