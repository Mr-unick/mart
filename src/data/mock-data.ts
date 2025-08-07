import type { Product, Customer, Coupon } from '@/types';

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
    specificPrices: {
      prod_001: 89.99, // Special price for Pro Plan
      prod_002: 450.00, // Special price for Enterprise Suite
    },
  },
  {
    id: 'cust_02',
    name: 'Synergy Solutions',
    tenantId: 'tenant_01',
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
