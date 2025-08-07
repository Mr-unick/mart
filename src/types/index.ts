// This file is now primarily for client-side type definitions
// that may not directly map to the Prisma schema, or for API route types.
// The source of truth for database models is prisma/schema.prisma.
import type { Prisma } from '@prisma/client';

// We can export Prisma-generated types
export type { Tenant, User, Role, Permission, Product, Customer, Coupon, Order } from '@prisma/client';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// Example of extending a Prisma type for client-side use
export type UserWithRoleAndPermissions = Prisma.UserGetPayload<{
  include: {
    role: {
      include: {
        permissions: true;
      };
    };
  };
}>;


export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount: number;
  tax: number;
  finalTotal: number;
  description: string;
}

export interface Bill {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  couponDiscount: {
    code: string;
    amount: number;
  } | null;
  taxableAmount: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

export interface Driver {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
}

export interface RouteStop {
  orderId: string;
  customerName: string;
  address: string;
  sequence: number;
}

export interface RoutePlan {
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  stops: RouteStop[];
}
