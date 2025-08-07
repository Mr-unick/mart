"use client";

import { useCart } from '@/context/cart-context';
import type { OrderItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MinusCircle, PlusCircle, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';
import OrderSummary from './order-summary';
import Link from 'next/link';

const OrderItemsList = ({ items }: { items: OrderItem[] }) => {
    const { handleUpdateQuantity } = useCart();
    return (
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
  };

export default function CartView() {
    const { bill, couponInput, setCouponInput, handleApplyCoupon } = useCart();

    if (!bill || bill.items.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        Your Cart
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                    <p className="text-center text-muted-foreground">Your cart is empty.</p>
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6" />
                            Your Cart
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderItemsList items={bill.items} />
                    </CardContent>
                    <Separator className="my-4" />
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Coupon Code"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                className="flex-grow"
                            />
                            <Button onClick={handleApplyCoupon}>Apply</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <OrderSummary bill={bill} />
                </div>
            </div>
        </div>
    )
}
