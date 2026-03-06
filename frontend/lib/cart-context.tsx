"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Drink } from "./drinks-data";

export interface CartItem {
  drink: Drink;
  quantity: number;
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (drink: Drink, quantity: number, notes: string) => void;
  removeItem: (drinkId: string) => void;
  updateQuantity: (drinkId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (drink: Drink, quantity: number, notes: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.drink.id === drink.id);
      if (existing) {
        return prev.map((item) =>
          item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item
        );
      }
      return [...prev, { drink, quantity, notes }];
    });
  };

  const removeItem = (drinkId: string) => {
    setItems((prev) => prev.filter((item) => item.drink.id !== drinkId));
  };

  const updateQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(drinkId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.drink.id === drinkId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.drink.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
