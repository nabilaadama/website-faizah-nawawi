"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/firebase-config';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  variantDetails?: string;
  variant?: {
    color?: string;
    size?: string;
  };
}

interface CartContextType {
  cart: CartItem[]; 
  cartItems: CartItem[]; 
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>; 
  cartTotal: number;
  itemCount: number;
  user: User | null;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadCart(user.uid);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadCart = async (userId: string) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        setCartItems(cartData.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToFirestore = async (items: CartItem[]) => {
    if (!user) return;
    
    try {
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items }, { merge: true });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id' | 'quantity'>) => {
    if (!user) {
      throw new Error('You must be logged in to add items to cart');
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        i => i.productId === item.productId && 
             i.variantId === item.variantId &&
             JSON.stringify(i.variant) === JSON.stringify(item.variant)
      );

      let newItems;
      if (existingItem) {
        newItems = prevItems.map(i =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [
          ...prevItems,
          {
            ...item,
            id: Math.random().toString(36).substring(2, 9),
            quantity: 1,
          },
        ];
      }

      saveCartToFirestore(newItems);
      return newItems;
    });
  };

  const removeFromCart = async (id: string) => {
    if (!user) {
      throw new Error('You must be logged in to modify your cart');
    }

    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      saveCartToFirestore(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) {
      throw new Error('You must be logged in to modify your cart');
    }

    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartToFirestore(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error('You must be logged in to clear your cart');
    }

    setCartItems([]);
    await saveCartToFirestore([]);
  };

  const cartTotal = cartItems.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count: number, item: CartItem) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        user,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}