"use client";

import { useCallback } from 'react';
import { mockCustomers, mockProducts } from '@/data/mock-data';
import ProductCard from './product-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';

export default function OrderForm() {
  const { toast } = useToast();
  const { handleAddToCart, currentCustomer, handleCustomerChange } = useCart();

  const onAddToCart = useCallback((productId: string) => {
    handleAddToCart(productId);
    toast({
        title: "Added to cart",
        description: `${mockProducts.find(p => p.id === productId)?.name} has been added to your cart.`,
    });
  }, [handleAddToCart, toast]);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
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
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
