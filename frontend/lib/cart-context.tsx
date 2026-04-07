"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// On utilise "any" car les données viennent de MySQL avec des noms dynamiques (ID_PRODUIT, etc.)
export interface CartItem {
  drink: any;
  quantity: number;
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (drink: any, quantity: number, notes: string) => void;
  removeItem: (drinkId: string | number) => void;
  updateQuantity: (drinkId: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // --- AJOUTER UN PRODUIT ---
  const addItem = (drink: any, quantity: number, notes: string) => {
    setItems((prev) => {
      // On vérifie si le produit existe via ID_PRODUIT (colonne MySQL)
      const existing = prev.find((item) => item.drink.ID_PRODUIT === drink.ID_PRODUIT);
      if (existing) {
        return prev.map((item) =>
          item.drink.ID_PRODUIT === drink.ID_PRODUIT
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item
        );
      }
      return [...prev, { drink, quantity, notes }];
    });
  };

  // --- SUPPRIMER UN PRODUIT ---
  const removeItem = (drinkId: string | number) => {
    setItems((prev) => prev.filter((item) => item.drink.ID_PRODUIT !== drinkId));
  };

  // --- METTRE À JOUR LA QUANTITÉ ---
  const updateQuantity = (drinkId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(drinkId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.drink.ID_PRODUIT === drinkId ? { ...item, quantity } : item
      )
    );
  };

  // --- VIDER LE PANIER ---
  const clearCart = () => setItems([]);

  // --- CALCULS DU PANIER (Adapté à MySQL) ---
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    // On force le prix MySQL en nombre pour éviter les erreurs "NaN"
    const price = parseFloat(item.drink.PRIX_PRODUITS) || 0;
    return sum + (price * item.quantity);
  }, 0);

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