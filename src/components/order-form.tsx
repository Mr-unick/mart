
"use client";

import { useCallback } from 'react';
import ProductCard from './product-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { Skeleton } from './ui/skeleton';

export default function OrderForm() {
  const { toast } = useToast();
  const { handleAddToCart, currentCustomer, handleCustomerChange, products, customers } = useCart();

  const onAddToCart = useCallback((productId: string) => {
    handleAddToCart(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
      });
    }
  }, [handleAddToCart, toast, products]);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Catalog</CardTitle>
            <div className="w-64">
                {customers.length > 0 ? (
                  <Select value={currentCustomer?.id} onValueChange={handleCustomerChange}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                          {customers.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))
            ) : (
              <>
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
