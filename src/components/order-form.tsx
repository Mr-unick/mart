"use client";

import { useState, useMemo, useCallback } from 'react';
import { mockProducts, mockCustomers, mockCoupons } from '@/data/mock-data';
import { calculateBill } from '@/lib/billing';
import type { Bill, Customer, OrderItem } from '@/types';
import ProductCard from './product-card';
import OrderSummary from './order-summary';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MinusCircle, PlusCircle, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function OrderForm() {
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [couponCode, setCouponCode] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(mockCustomers[0]);

  const bill: Bill | null = useMemo(() => {
    return calculateBill({
      cart,
      customer: currentCustomer,
      allProducts: mockProducts,
      couponCode,
      allCoupons: mockCoupons,
    });
  }, [cart, currentCustomer, couponCode]);

  const handleAddToCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentQuantity = newCart.get(productId) || 0;
      newCart.set(productId, currentQuantity + 1);
      return newCart;
    });
  }, []);
  
  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      if (newQuantity > 0) {
        newCart.set(productId, newQuantity);
      } else {
        newCart.delete(productId);
      }
      return newCart;
    });
  }, []);

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    if(customer) {
      setCurrentCustomer(customer);
    }
  }

  const OrderItemsList = ({ items }: { items: OrderItem[] }) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.product.id} className="flex items-center gap-4">
          <div className="flex-grow">
            <p className="font-medium">{item.product.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}>
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span>{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>
              <PlusCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleUpdateQuantity(item.product.id, 0)}>
                <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Catalog</CardTitle>
            <div className="w-64">
                <Select value={currentCustomer.id} onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockCustomers.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bill && bill.items.length > 0 ? (
                <OrderItemsList items={bill.items} />
              ) : (
                <p className="text-center text-muted-foreground">Your cart is empty.</p>
              )}
            </CardContent>
            {bill && bill.items.length > 0 && (
                <>
                <Separator className="my-4" />
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-grow"
                        />
                    </div>
                </CardContent>
                </>
            )}
          </Card>

          {bill && <OrderSummary bill={bill} />}
        </div>
      </div>
    </div>
  );
}
