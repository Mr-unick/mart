"use client";

import { createContext, useState, useMemo, useCallback, useContext, ReactNode } from 'react';
import { mockProducts, mockCustomers, mockCoupons } from '@/data/mock-data';
import { calculateBill } from '@/lib/billing';
import type { Bill, Customer, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Map<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  couponInput: string;
  setCouponInput: React.Dispatch<React.SetStateAction<string>>;
  appliedCoupon: string;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<string>>;
  currentCustomer: Customer;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  bill: Bill | null;
  handleApplyCoupon: () => void;
  handleAddToCart: (productId: string) => void;
  handleUpdateQuantity: (productId: string, newQuantity: number) => void;
  handleCustomerChange: (customerId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(mockCustomers[0]);
  const { toast } = useToast();

  const bill: Bill | null = useMemo(() => {
    return calculateBill({
      cart,
      customer: currentCustomer,
      allProducts: mockProducts,
      couponCode: appliedCoupon,
      allCoupons: mockCoupons,
    });
  }, [cart, currentCustomer, appliedCoupon]);

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (coupon || couponInput === "") {
      setAppliedCoupon(couponInput);
      if (couponInput !== "") {
        toast({ title: "Coupon applied successfully!" });
      }
    } else {
      toast({ title: "Invalid Coupon", description: "The coupon code you entered is not valid.", variant: "destructive" });
    }
  };

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
    if (customer) {
      setCurrentCustomer(customer);
    }
  };

  const value = {
    cart,
    setCart,
    couponInput,
    setCouponInput,
    appliedCoupon,
    setAppliedCoupon,
    currentCustomer,
    setCurrentCustomer,
    bill,
    handleApplyCoupon,
    handleAddToCart,
    handleUpdateQuantity,
    handleCustomerChange,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
