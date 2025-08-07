
import { PrismaClient, CouponType } from '@prisma/client';

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
        { id: 'perm_manage_products', name: 'Manage Products', description: 'Can create, edit, and delete products.' },
        { id: 'perm_manage_coupons', name: 'Manage Coupons', description: 'Can create, edit, and delete coupons.' },
        { id: 'perm_manage_banners', name: 'Manage Banners', description: 'Can create, edit, and delete banners.' },
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
            ownerName: 'Nikhil Admin',
            ownerEmail: 'nikhil@gmail.com',
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
        where: { email: 'nikhil@gmail.com' },
        update: {},
        create: {
            id: 'user_super_admin',
            name: 'Nikhil Admin',
            email: 'nikhil@gmail.com',
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
                    { id: 'perm_manage_products' },
                    { id: 'perm_manage_coupons' },
                    { id: 'perm_manage_banners' },
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
    
    // --- Seed Products for Sample Tenant ---
    const productsData = [
        { name: 'Cloud-Powered AI Mug', description: 'A coffee mug that uses cloud AI to keep your drink at the perfect temperature.', defaultPrice: 29.99, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'coffee mug' },
        { name: 'Quantum-Entangled Socks', description: 'A pair of socks that are quantumly entangled. Lose one, and the other disappears too!', defaultPrice: 15.50, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'pair socks' },
        { name: 'Blockchain-Verified Water Bottle', description: 'Stay hydrated with a water bottle whose authenticity is secured on the blockchain.', defaultPrice: 45.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'water bottle' },
        { name: 'Neural-Interface VR Headset', description: 'Experience virtual reality like never before with a direct neural interface.', defaultPrice: 899.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'vr headset' },
        { name: 'Self-Driving Skateboard', description: 'The future of personal transport. Tell it where to go, and it takes you there.', defaultPrice: 1200.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'electric skateboard' },
        { name: 'AI-Powered Personal Chef', description: 'A robotic chef that learns your preferences and cooks gourmet meals for you.', defaultPrice: 2500.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'robot chef' }
    ];

    for (const p of productsData) {
        await prisma.product.create({
            data: { ...p, tenantId: sampleTenant.id },
        });
    }
    console.log('Seeded products for sample tenant');

    // --- Seed Coupons for Sample Tenant ---
    const couponsData = [
      { code: 'SUMMER20', type: CouponType.PERCENTAGE, discount: 20, tenantId: sampleTenant.id, isActive: true },
      { code: 'SAVE10', type: CouponType.FIXED, discount: 10, tenantId: sampleTenant.id, isActive: true },
      { code: 'EXPIRED', type: CouponType.PERCENTAGE, discount: 15, tenantId: sampleTenant.id, isActive: false },
    ];

    for (const c of couponsData) {
        await prisma.coupon.upsert({
            where: { code: c.code },
            update: c,
            create: c,
        });
    }
    console.log('Seeded coupons for sample tenant');


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
