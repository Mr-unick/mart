export interface Tenant {
  id: string;
  name: string;
  address: Address;
}

export type Role = 'admin' | 'internal' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  id: string;
  name: string;
  tenantId: string;
  address: Address;
  // Map<productId, price>
  specificPrices?: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  defaultPrice: number;
  tenantId: string;
  dataAiHint: string;
}

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

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'flat' | 'percentage';
  tenantId: string;
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

export interface Order extends Bill {
  id: string;
  customerId: string;
  customerName: string;
  deliveryAddress: Address;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: string;
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
