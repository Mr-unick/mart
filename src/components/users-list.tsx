
"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User, Role } from '@/types';
import { Skeleton } from './ui/skeleton';

const usersSchema = z.object({
    users: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        roleId: z.string().min(1, 'Role is required'),
    }))
});

export default function UsersList() {
    const { toast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof usersSchema>>({
        resolver: zodResolver(usersSchema),
        defaultValues: {
            users: [],
        }
    });
    
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/roles')
                ]);
                const usersData = await usersRes.json();
                const rolesData = await rolesRes.json();
                form.reset({ users: usersData });
                setRoles(rolesData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast({ title: "Error", description: "Could not load user data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [form, toast]);


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "users",
    });

    function onSubmit(values: z.infer<typeof usersSchema>) {
        console.log(values);
        // Here you would make an API call to save the users
        toast({ title: "Users Updated", description: "User information has been saved successfully." });
    }
    
    const onAddNewUser = () => {
        const defaultRole = roles.find(r => r.name === 'Customer');
        append({
            id: `new_user_${Math.random().toString(36).substring(2, 9)}`,
            name: '',
            email: '',
            roleId: defaultRole?.id || (roles.length > 0 ? roles[0].id : '')
        })
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage users and their assigned roles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({length: 3}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-10 w-10" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`users.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="John Doe" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`users.${index}.email`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="john@example.com" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`users.${index}.roleId`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a role" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {roles.map(role => (
                                                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button type="button" variant="outline" onClick={onAddNewUser} disabled={loading}>Add New User</Button>
                        <Button type="submit" disabled={loading}>Save Users</Button>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}
