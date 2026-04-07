"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context"; // 1. Import du context de langue

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: () => void;
}

export function CartDrawer({ isOpen, onClose, onConfirmOrder }: CartDrawerProps) {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const { t } = useLanguage(); // 2. On récupère les traductions

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fond sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-sm"
          />

          {/* Panneau latéral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-border flex flex-col"
          >
            {/* Header - TRADUIT */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl text-navy-deep">{t.cart.title}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-navy-deep" />
              </button>
            </div>

            {/* Liste des produits */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  {/* Message vide - TRADUIT */}
                  <p>{t.cart.empty}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const id = item.drink.ID_PRODUIT;
                    const name = item.drink.LIBELLE_PRODUITS || "Drink";
                    const price = parseFloat(item.drink.PRIX_PRODUITS) || 0;
                    const image = item.drink.LIEN_IMAGE_PRODUIT || "/placeholder.svg";
                    const lineTotal = price * item.quantity;

                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 p-4 bg-muted rounded-2xl border border-border"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={image} alt={name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-lg text-navy-deep truncate">{name}</h3>
                            <p className="text-teal font-bold">€{lineTotal.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-border px-1">
                              <button 
                                type="button"
                                onClick={() => updateQuantity(id, item.quantity - 1)}
                                className="p-1"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(id, item.quantity + 1)}
                                className="p-1"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeItem(id)}
                              className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer avec Total - TRADUIT */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-white">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-navy/60 font-medium">{t.common.total}</span>
                  <span className="text-3xl font-serif text-navy-deep">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onConfirmOrder}
                  className="w-full py-4 bg-teal text-white font-semibold rounded-2xl shadow-lg hover:bg-teal-light transition-all"
                >
                  {t.cart.confirm}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}