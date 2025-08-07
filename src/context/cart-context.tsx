
"use client";

import { createContext, useState, useMemo, useCallback, useContext, ReactNode, useEffect } from 'react';
import { calculateBill } from '@/lib/billing';
import type { Bill, Customer, OrderItem, Product, Coupon } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Map<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  couponInput: string;
  setCouponInput: React.Dispatch<React.SetStateAction<string>>;
  appliedCoupon: string;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<string>>;
  currentCustomer: Customer | null;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  bill: Bill | null;
  handleApplyCoupon: () => void;
  handleAddToCart: (productId: string) => void;
  handleUpdateQuantity: (productId: string, newQuantity: number) => void;
  handleCustomerChange: (customerId: string) => void;
  products: Product[];
  customers: Customer[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Data fetched from API
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);


  // Fetch initial data from APIs
  useEffect(() => {
    async function fetchData() {
        try {
            const [productsRes, customersRes, couponsRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/customers'),
                fetch('/api/coupons'),
            ]);
            
            const productsData = await productsRes.json();
            const customersData = await customersRes.json();
            const couponsData = await couponsRes.json();

            setProducts(productsData);
            setCustomers(customersData);
            setCoupons(couponsData);

            // Load saved customer from local storage and set initial customer
            const savedCustomer = window.localStorage.getItem('currentCustomer');
            let initialCustomer: Customer | null = null;
            if (savedCustomer) {
                const customer = JSON.parse(savedCustomer);
                const existingCustomer = customersData.find((c: Customer) => c.id === customer.id);
                if (existingCustomer) {
                    initialCustomer = existingCustomer;
                }
            }
            // If no saved customer, or saved customer doesn't exist, set to the first one
            if (!initialCustomer && customersData.length > 0) {
                initialCustomer = customersData[0];
            }
            setCurrentCustomer(initialCustomer);

        } catch (error) {
            console.error("Failed to fetch initial data", error);
            toast({ title: "Error", description: "Could not load store data.", variant: "destructive" });
        }
    }

    fetchData();
  }, [toast]);

  // Load cart and coupon from local storage
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
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart, coupon, and customer to local storage
  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
            window.localStorage.setItem('appliedCoupon', appliedCoupon);
            if (currentCustomer) {
              window.localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
            }
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }
  }, [cart, appliedCoupon, currentCustomer, isLoaded]);

  const bill: Bill | null = useMemo(() => {
    if (!isLoaded || !currentCustomer) return null;
    return calculateBill({
      cart,
      customer: currentCustomer,
      allProducts: products,
      couponCode: appliedCoupon,
      allCoupons: coupons,
    });
  }, [cart, currentCustomer, appliedCoupon, isLoaded, products, coupons]);

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
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
    const customer = customers.find(c => c.id === customerId);
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
    products,
    customers,
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
