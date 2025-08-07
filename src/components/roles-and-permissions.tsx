
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { Role, Permission } from '@/types';
import { Skeleton } from './ui/skeleton';

const rolesSchema = z.object({
    roles: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Role name is required"),
        permissions: z.array(z.string()),
        tenantId: z.string(), // Keep tenantId for the backend
    }))
});

export default function RolesAndPermissions() {
    const { toast } = useToast();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof rolesSchema>>({
        resolver: zodResolver(rolesSchema),
        defaultValues: {
            roles: [],
        }
    });

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [rolesRes, permissionsRes] = await Promise.all([
                    fetch('/api/roles'),
                    fetch('/api/permissions')
                ]);
                const rolesData = await rolesRes.json();
                const permissionsData = await permissionsRes.json();
                form.reset({ roles: rolesData });
                setPermissions(permissionsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast({ title: "Error", description: "Could not load roles and permissions.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [form, toast]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "roles",
    });

    function onSubmit(values: z.infer<typeof rolesSchema>) {
        console.log(values);
        // Here you would make an API call to save the roles
        toast({ title: "Roles Updated", description: "Roles and permissions have been saved successfully." });
    }

    const onAddNewRole = () => {
        append({
            id: `new_role_${Math.random().toString(36).substring(2, 9)}`,
            name: 'New Role',
            permissions: [],
            tenantId: 'tenant_1', // This should be the current user's tenantId
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Roles & Permissions</CardTitle>
                        <CardDescription>Define roles and assign permissions to them.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <Accordion type="multiple" className="w-full" defaultValue={fields.map(f => f.id)}>
                                {fields.map((field, index) => (
                                    <AccordionItem key={field.id} value={field.id}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-4 flex-grow">
                                                <FormField
                                                    control={form.control}
                                                    name={`roles.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-grow">
                                                            <FormControl>
                                                                <Input {...field} onClick={(e) => e.stopPropagation()}/>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); remove(index);}}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {permissions.map((permission) => (
                                                <FormField
                                                    key={permission.id}
                                                    control={form.control}
                                                    name={`roles.${index}.permissions`}
                                                    render={({ field: formField }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={formField.value?.includes(permission.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = checked
                                                                            ? [...formField.value, permission.id]
                                                                            : formField.value?.filter((value) => value !== permission.id);
                                                                        formField.onChange(newValue);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>{permission.name}</FormLabel>
                                                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={onAddNewRole} disabled={loading}>Add New Role</Button>
                        <Button type="submit" disabled={loading}>Save Roles</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
