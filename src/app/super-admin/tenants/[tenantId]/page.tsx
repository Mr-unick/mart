
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Palette } from 'lucide-react';
import React from 'react';
import DashboardLayout from '@/app/dashboard-layout';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tenant } from '@prisma/client';

const profileSchema = z.object({
    name: z.string().min(1, 'Tenant name is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip code is required'),
});

const themeSchema = z.object({
    primary: z.string(),
    background: z.string(),
    accent: z.string(),
});

function TenantProfileForm({ tenant }: { tenant: Tenant }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: tenant.name,
            street: tenant.street,
            city: tenant.city,
            state: tenant.state,
            zip: tenant.zip,
        }
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        console.log(values);
        toast({ title: "Profile Updated", description: "Tenant profile has been saved successfully." });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Tenant Profile</CardTitle>
                        <CardDescription>Update your tenant's information here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

function ThemeCustomizationForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof themeSchema>>({
        resolver: zodResolver(themeSchema),
        defaultValues: {
            primary: '207 90% 54%',
            background: '0 0% 96.1%',
            accent: '16 100% 63%',
        }
    });

    const applyTheme = React.useCallback((values: z.infer<typeof themeSchema>) => {
        document.documentElement.style.setProperty('--primary', values.primary);
        document.documentElement.style.setProperty('--background', values.background);
        document.documentElement.style.setProperty('--accent', values.accent);
    }, []);

    function onSubmit(values: z.infer<typeof themeSchema>) {
        console.log(values);
        applyTheme(values);
        toast({ title: "Theme Updated", description: "Color scheme has been updated." });
    }
    
    React.useEffect(() => {
        const defaultValues = form.getValues();
        applyTheme(defaultValues);
    }, [form, applyTheme]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette />
                            Theme Customization
                        </CardTitle>
                        <CardDescription>Customize the look and feel of your application. Provide HSL values.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="background"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Background Color</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0 0% 96.1%" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="primary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Color</FormLabel>
                                        <FormControl>
                                            <Input placeholder="207 90% 54%" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accent Color</FormLabel>
                                        <FormControl>
                                            <Input placeholder="16 100% 63%" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Theme</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

export default function TenantDetailsPage() {
    const params = useParams();
    const tenantId = params.tenantId as string;
    const [tenant, setTenant] = React.useState<Tenant | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchTenant() {
            if (tenantId) {
                // In a real app, you would fetch this from an API route
                // For now, we simulate an async fetch.
                // const fetchedTenant = await getTenantById(tenantId);
                // setTenant(fetchedTenant);
                setLoading(false); // Remove this when you have a real fetch
            }
        }
        // Mocking the fetch since we can't call prisma directly in a client component
        // This would be replaced by an API call.
        setTimeout(() => {
             const mockTenant: Tenant = {
                id: tenantId,
                name: 'Innovate Corp (Loaded)',
                street: '123 Tech Avenue',
                city: 'Silicon Valley',
                state: 'CA',
                zip: '94043',
                ownerName: "Alice Admin",
                ownerEmail: "alice@example.com",
             };
             setTenant(mockTenant);
             setLoading(false);
        }, 500);

    }, [tenantId]);


    if (loading) {
        return (
             <DashboardLayout>
                <div className="space-y-8">
                    <Card>
                        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
                    </Card>
                     <Card>
                        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                        <CardContent className="space-y-4">
                           <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    if (!tenant) {
        notFound();
    }
    
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <TenantProfileForm tenant={tenant} />
                <ThemeCustomizationForm />
            </div>
        </DashboardLayout>
    );
}
