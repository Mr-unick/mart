
import type { Product, Customer, Coupon, Order, Driver, Vehicle, Tenant, User, Role, Permission } from '@/types';

export const mockTenant: Tenant = {
  id: 'tenant_01',
  name: 'Innovate Corp Tenant',
  address: {
    street: '123 Tenant Main St',
    city: 'Businessville',
    state: 'CA',
    zip: '90210'
  },
  ownerName: "Alice Admin",
  ownerEmail: "alice@example.com",
};

export const mockTenants: Tenant[] = [
    {
        id: 'tenant_01',
        name: 'Innovate Corp',
        address: { street: '123 Tech Avenue', city: 'Silicon Valley', state: 'CA', zip: '94043' },
        ownerName: "Alice Admin",
        ownerEmail: "alice@example.com",
    },
    {
        id: 'tenant_02',
        name: 'Synergy Solutions',
        address: { street: '456 Business Blvd', city: 'Metropolis', state: 'NY', zip: '10001' },
        ownerName: "Dana Developer",
        ownerEmail: "dana@synergy.com",
    },
    {
        id: 'tenant_03',
        name: 'Quantum Dynamics',
        address: { street: '789 Innovation Drive', city: 'Boston', state: 'MA', zip: '02110' },
        ownerName: "Evan Engineer",
        ownerEmail: "evan@quantum.com",
    }
]

export const mockPermissions: Permission[] = [
    { id: 'perm_view_products', name: 'View Products', description: 'Can view the product catalog.' },
    { id: 'perm_manage_cart', name: 'Manage Cart', description: 'Can add/remove items from the cart.' },
    { id: 'perm_view_orders', name: 'View Orders', description: 'Can view their own order history.' },
    { id: 'perm_manage_routes', name: 'Manage Route Planner', description: 'Can access and operate the route planner.' },
    { id: 'perm_manage_settings', name: 'Manage Tenant Settings', description: 'Can edit tenant profile.' },
    { id: 'perm_manage_users', name: 'Manage Users', description: 'Can add, edit, and remove users.' },
    { id: 'perm_manage_roles', name: 'Manage Roles', description: 'Can define roles and assign permissions.' },
    { id: 'perm_manage_tenants', name: 'Manage Tenants', description: 'Can create, edit, and delete tenants.' },
];

export const mockRoles: Role[] = [
    {
        id: 'role_super_admin',
        name: 'Super Admin',
        tenantId: 'system',
        permissions: ['perm_manage_tenants'],
    },
    {
        id: 'role_admin',
        name: 'Admin',
        tenantId: 'tenant_01',
        permissions: mockPermissions.filter(p => p.id !== 'perm_manage_tenants').map(p => p.id), // Admin has all tenant-level permissions
    },
    {
        id: 'role_internal',
        name: 'Internal',
        tenantId: 'tenant_01',
        permissions: [
            'perm_view_products',
            'perm_manage_routes',
        ],
    },
    {
        id: 'role_customer',
        name: 'Customer',
        tenantId: 'tenant_01',
        permissions: [
            'perm_view_products',
            'perm_manage_cart',
            'perm_view_orders',
        ]
    }
];

export const mockUsers: User[] = [
    // To test the super admin view, change Alice's roleId to 'role_super_admin'.
    // To test the tenant admin view, change it to 'role_admin'.
    { id: 'user_01', name: 'Alice Admin', email: 'alice@example.com', roleId: 'role_super_admin', tenantId: 'tenant_01' },
    { id: 'user_02', name: 'Bob Internal', email: 'bob@example.com', roleId: 'role_internal', tenantId: 'tenant_01' },
    { id: 'user_03', name: 'Charlie Customer', email: 'charlie@example.com', roleId: 'role_customer', tenantId: 'tenant_01' },
    { id: 'user_super', name: 'Samantha Super', email: 'samantha@example.com', roleId: 'role_super_admin', tenantId: 'system' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Pro Plan Subscription',
    description: 'Monthly access to our Pro features.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 99.99,
    tenantId: 'tenant_01',
    dataAiHint: 'software subscription',
  },
  {
    id: 'prod_002',
    name: 'Enterprise Suite',
    description: 'Full enterprise-level software suite.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 499.99,
    tenantId: 'tenant_01',
    dataAiHint: 'enterprise software',
  },
  {
    id: 'prod_003',
    name: 'Basic Support Package',
    description: 'Standard email and chat support.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 29.99,
    tenantId: 'tenant_01',
    dataAiHint: 'customer support',
  },
  {
    id: 'prod_004',
    name: 'Premium Onboarding',
    description: 'Personalized onboarding and training.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 1200,
    tenantId: 'tenant_01',
    dataAiHint: 'professional service',
  },
  {
    id: 'prod_005',
    name: 'API Access Credits',
    description: 'Pack of 10,000 API calls.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 50,
    tenantId: 'tenant_01',
    dataAiHint: 'api credits',
  },
  {
    id: 'prod_006',
    name: 'Data Analytics Add-on',
    description: 'Advanced data analytics and reporting.',
    imageUrl: 'https://placehold.co/300x200.png',
    defaultPrice: 149,
    tenantId: 'tenant_01',
    dataAiHint: 'data analytics',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust_01',
    name: 'Innovate Corp',
    tenantId: 'tenant_01',
    address: { street: '123 Tech Avenue', city: 'Silicon Valley', state: 'CA', zip: '94043' },
    specificPrices: {
      prod_001: 89.99, // Special price for Pro Plan
      prod_002: 450.00, // Special price for Enterprise Suite
    },
  },
  {
    id: 'cust_02',
    name: 'Synergy Solutions',
    tenantId: 'tenant_01',
    address: { street: '456 Business Blvd', city: 'Metropolis', state: 'NY', zip: '10001' },
    specificPrices: {},
  },
  {
    id: 'cust_03',
    name: 'Quantum Dynamics',
    tenantId: 'tenant_01',
    address: { street: '789 Innovation Drive', city: 'Boston', state: 'MA', zip: '02110' },
    specificPrices: {},
    },
];

export const mockCoupons: Coupon[] = [
  {
    id: 'coupon_01',
    code: 'SAVE10',
    type: 'percentage',
    discount: 10,
    tenantId: 'tenant_01',
  },
  {
    id: 'coupon_02',
    code: '50OFF',
    type: 'flat',
    discount: 50,
    tenantId: 'tenant_01',
  },
];

export const mockOrders: Order[] = [
    {
        id: 'ord_01',
        orderNumber: 'ORD-1672532521-A2B3C',
        customerId: 'cust_01',
        customerName: 'Innovate Corp',
        deliveryAddress: { street: '123 Tech Avenue', city: 'Silicon Valley', state: 'CA', zip: '94043' },
        items: [],
        subtotal: 299.97,
        totalDiscount: 0,
        couponDiscount: null,
        taxableAmount: 299.97,
        totalTax: 53.99,
        cgst: 26.99,
        sgst: 26.99,
        grandTotal: 353.96,
        status: 'pending',
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: 'ord_02',
        orderNumber: 'ORD-1672532522-D4E5F',
        customerId: 'cust_02',
        customerName: 'Synergy Solutions',
        deliveryAddress: { street: '456 Business Blvd', city: 'Metropolis', state: 'NY', zip: '10001' },
        items: [],
        subtotal: 149.99,
        totalDiscount: 0,
        couponDiscount: null,
        taxableAmount: 149.99,
        totalTax: 27,
        cgst: 13.5,
        sgst: 13.5,
        grandTotal: 176.99,
        status: 'pending',
        createdAt: '2023-01-01T11:00:00Z',
    },
    {
        id: 'ord_03',
        orderNumber: 'ORD-1672532523-G6H7I',
        customerId: 'cust_03',
        customerName: 'Quantum Dynamics',
        deliveryAddress: { street: '789 Innovation Drive', city: 'Boston', state: 'MA', zip: '02110' },
        items: [],
        subtotal: 999.98,
        totalDiscount: 0,
        couponDiscount: null,
        taxableAmount: 999.98,
        totalTax: 180,
        cgst: 90,
        sgst: 90,
        grandTotal: 1179.98,
        status: 'pending',
        createdAt: '2023-01-01T12:30:00Z',
    }
];

export const mockDrivers: Driver[] = [
    { id: 'driver_01', name: 'John Doe' },
    { id: 'driver_02', name: 'Jane Smith' },
];

export const mockVehicles: Vehicle[] = [
    { id: 'vehicle_01', make: 'Ford', model: 'Transit', licensePlate: 'TRUCK1' },
    { id: 'vehicle_02', make: 'Mercedes', model: 'Sprinter', licensePlate: 'VANLIFE' },
];
