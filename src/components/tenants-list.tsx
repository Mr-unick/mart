
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tenant } from '@prisma/client';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
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
import TenantFormDialog from './tenant-form-dialog';


export default function TenantsList({ initialTenants }: { initialTenants: Tenant[]}) {
    const router = useRouter();
    const [tenants, setTenants] = useState(initialTenants);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const filteredTenants = tenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRowClick = (tenant: Tenant) => {
        router.push(`/super-admin/tenants/${tenant.id}`);
    };

    const handleEditClick = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsFormDialogOpen(true);
    };

    const handleDeleteClick = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedTenant) {
            // Add API call to delete tenant
            console.log("Deleting tenant:", selectedTenant.id);
            // After successful deletion, update state
            setTenants(tenants.filter(t => t.id !== selectedTenant.id));
            setIsDeleteDialogOpen(false);
            setSelectedTenant(null);
        }
    };
    
    const handleAddNew = () => {
        setSelectedTenant(null);
        setIsFormDialogOpen(true);
    }

    const handleFormClose = () => {
        setIsFormDialogOpen(false);
        setSelectedTenant(null);
    }

    const handleFormSave = (savedTenant: Tenant) => {
        if (selectedTenant) {
            setTenants(tenants.map(t => t.id === savedTenant.id ? savedTenant : t));
        } else {
            setTenants([...tenants, savedTenant]);
        }
        handleFormClose();
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Tenant Management</CardTitle>
                            <CardDescription>A list of all tenants in the system.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Tenant
                        </Button>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search tenants..." 
                            className="pl-8" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTenants.map((tenant) => (
                                <TableRow key={tenant.id} onClick={() => handleRowClick(tenant)} className="cursor-pointer">
                                    <TableCell className="font-medium">{tenant.name}</TableCell>
                                    <TableCell>{tenant.ownerName}</TableCell>
                                    <TableCell>{`${tenant.city}, ${tenant.state}`}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(tenant)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteClick(tenant)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the tenant
                        and all associated data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TenantFormDialog 
                isOpen={isFormDialogOpen}
                onOpenChange={handleFormClose}
                onSave={handleFormSave}
                tenant={selectedTenant}
            />
        </>
    );
}
