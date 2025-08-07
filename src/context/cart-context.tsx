
"use client";

import { createContext, useState, useMemo, useCallback, useContext, ReactNode, useEffect } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem('cart');
      if (savedCart) {
        setCart(new Map(JSON.parse(savedCart)));
      }

      const savedCoupon = window.localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
        setCouponInput(savedCoupon);
      }
      
      const savedCustomer = window.localStorage.getItem('currentCustomer');
      if (savedCustomer) {
        const customer = JSON.parse(savedCustomer);
        const existingCustomer = mockCustomers.find(c => c.id === customer.id);
        if(existingCustomer) {
            setCurrentCustomer(existingCustomer);
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
            window.localStorage.setItem('appliedCoupon', appliedCoupon);
            window.localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
        } catch (error) {
            console.error("Failed to save cart to localStorage", error);
        }
    }
  }, [cart, appliedCoupon, currentCustomer, isLoaded]);

  const bill: Bill | null = useMemo(() => {
    if (!isLoaded) return null;
    return calculateBill({
      cart,
      customer: currentCustomer,
      allProducts: mockProducts,
      couponCode: appliedCoupon,
      allCoupons: mockCoupons,
    });
  }, [cart, currentCustomer, appliedCoupon, isLoaded]);

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

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
