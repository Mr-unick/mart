
"use client";

import { useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockTenant, mockUsers, mockRoles, mockPermissions } from '@/data/mock-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const profileSchema = z.object({
    name: z.string().min(1, 'Tenant name is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip code is required'),
});

const usersSchema = z.object({
    users: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        roleId: z.string().min(1, 'Role is required'),
    }))
});

const rolesSchema = z.object({
    roles: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Role name is required"),
        permissions: z.array(z.string()),
    }))
});

function TenantProfileForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: mockTenant.name,
            ...mockTenant.address,
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

function UsersAndRolesForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof usersSchema>>({
        resolver: zodResolver(usersSchema),
        defaultValues: {
            users: mockUsers,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "users",
    });

    function onSubmit(values: z.infer<typeof usersSchema>) {
        console.log(values);
        toast({ title: "Users Updated", description: "User information has been saved successfully." });
    }
    
    const onAddNewUser = () => {
        append({
            id: `user_${Math.random().toString(36).substring(2, 9)}`,
            name: '',
            email: '',
            roleId: mockRoles.find(r => r.name === 'Customer')?.id || ''
        })
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Users & Roles</CardTitle>
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
                                {fields.map((field, index) => (
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
                                                            {mockRoles.map(role => (
                                                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button type="button" variant="outline" onClick={onAddNewUser}>Add New User</Button>
                        <Button type="submit">Save Users</Button>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}

function RolesAndPermissionsForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof rolesSchema>>({
        resolver: zodResolver(rolesSchema),
        defaultValues: {
            roles: mockRoles,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "roles",
    });

    function onSubmit(values: z.infer<typeof rolesSchema>) {
        console.log(values);
        toast({ title: "Roles Updated", description: "Roles and permissions have been saved successfully." });
    }

    const onAddNewRole = () => {
        append({
            id: `role_${Math.random().toString(36).substring(2, 9)}`,
            name: 'New Role',
            permissions: []
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
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); remove(index);}}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {mockPermissions.map((permission) => (
                                            <FormField
                                                key={permission.id}
                                                control={form.control}
                                                name={`roles.${index}.permissions`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(permission.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, permission.id])
                                                                        : field.onChange(field.value?.filter((value) => value !== permission.id))
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
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={onAddNewRole}>Add New Role</Button>
                        <Button type="submit">Save Roles</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

export default function TenantSettings() {
    return (
        <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="users">Users & Roles</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <TenantProfileForm />
            </TabsContent>
            <TabsContent value="users">
                <UsersAndRolesForm />
            </TabsContent>
            <TabsContent value="roles">
                <RolesAndPermissionsForm />
            </TabsContent>
        </Tabs>
    );
}
