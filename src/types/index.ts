export interface Tenant {
  id: string;
  name: string;
  // other tenant info
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'internal' | 'customer';
  tenantId: string;
}

export interface Customer {
  id: string;
  name: string;
  tenantId: string;
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
