
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // --- Seed Permissions ---
    const permissionsData = [
        { id: 'perm_view_products', name: 'View Products', description: 'Can view the product catalog.' },
        { id: 'perm_manage_cart', name: 'Manage Cart', description: 'Can add/remove items from the cart.' },
        { id: 'perm_view_orders', name: 'View Orders', description: 'Can view their own order history.' },
        { id: 'perm_manage_routes', name: 'Manage Route Planner', description: 'Can access and operate the route planner.' },
        { id: 'perm_manage_settings', name: 'Manage Tenant Settings', description: 'Can edit tenant profile.' },
        { id: 'perm_manage_users', name: 'Manage Users', description: 'Can add, edit, and remove users.' },
        { id: 'perm_manage_roles', name: 'Manage Roles', description: 'Can define roles and assign permissions.' },
        { id: 'perm_manage_tenants', name: 'Manage Tenants', description: 'Can create, edit, and delete tenants.' },
    ];
    for (const p of permissionsData) {
        await prisma.permission.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
    }
    console.log('Seeded permissions');

    // --- Seed System Tenant for Super Admin ---
    const systemTenant = await prisma.tenant.upsert({
        where: { id: 'system' },
        update: {},
        create: {
            id: 'system',
            name: 'System',
            street: '123 System St',
            city: 'Systemville',
            state: 'SS',
            zip: '00000',
            ownerName: 'Sys Admin',
            ownerEmail: 'super@admin.com',
        },
    });
    console.log('Upserted system tenant');

    // --- Seed Super Admin Role ---
    const superAdminRole = await prisma.role.upsert({
        where: { name_tenantId: { name: 'Super Admin', tenantId: systemTenant.id } },
        update: {},
        create: {
            id: 'role_super_admin',
            name: 'Super Admin',
            tenantId: systemTenant.id,
            permissions: {
                connect: [{ id: 'perm_manage_tenants' }]
            }
        },
    });
    console.log('Seeded Super Admin role');

    // --- Seed Super Admin User ---
    await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            id: 'user_super_admin',
            name: 'Alice Admin',
            email: 'alice@example.com',
            roleId: superAdminRole.id,
            tenantId: systemTenant.id,
        },
    });
    console.log('Seeded Super Admin user');

    // --- Seed Sample Tenant ---
    const sampleTenant = await prisma.tenant.upsert({
        where: { id: 'tenant_innovate' },
        update: {},
        create: {
            id: 'tenant_innovate',
            name: 'Innovate Corp',
            street: '456 Innovation Dr',
            city: 'Tech City',
            state: 'TX',
            zip: '75001',
            ownerName: 'Bob Builder',
            ownerEmail: 'owner@innovate.com',
        },
    });
    console.log('Upserted sample tenant');

    // --- Seed Tenant Admin Role for Sample Tenant ---
     const tenantAdminRole = await prisma.role.upsert({
        where: { name_tenantId: { name: 'Tenant Admin', tenantId: sampleTenant.id } },
        update: {},
        create: {
            id: 'role_tenant_admin_innovate',
            name: 'Tenant Admin',
            tenantId: sampleTenant.id,
            permissions: {
                connect: [
                    { id: 'perm_view_products' },
                    { id: 'perm_manage_cart' },
                    { id: 'perm_view_orders' },
                    { id: 'perm_manage_routes' },
                    { id: 'perm_manage_settings' },
                    { id: 'perm_manage_users' },
                    { id: 'perm_manage_roles' },
                ]
            }
        },
    });
    console.log('Seeded Tenant Admin role for sample tenant');

    // --- Seed Tenant Admin User for Sample Tenant ---
    await prisma.user.upsert({
        where: { email: 'owner@innovate.com' },
        update: {},
        create: {
            id: 'user_tenant_admin_innovate',
            name: 'Bob Builder',
            email: 'owner@innovate.com',
            roleId: tenantAdminRole.id,
            tenantId: sampleTenant.id,
        },
    });
    console.log('Seeded Tenant Admin user for sample tenant');


    console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
