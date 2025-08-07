"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockPermissions, mockRoles } from '@/data/mock-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const rolesSchema = z.object({
    roles: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Role name is required"),
        permissions: z.array(z.string()),
    }))
});

export default function RolesAndPermissions() {
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
