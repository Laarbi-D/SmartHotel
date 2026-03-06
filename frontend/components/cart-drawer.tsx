"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: () => void;
}

export function CartDrawer({ isOpen, onClose, onConfirmOrder }: CartDrawerProps) {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-border"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-serif text-2xl text-navy-deep">Your Order</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-navy-deep" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <svg
                        className="w-10 h-10 text-navy/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <p className="text-navy-deep font-medium">Your order is empty</p>
                    <p className="text-sm text-navy/50 mt-1">
                      Add some drinks to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.drink.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="flex gap-4 p-4 bg-muted rounded-2xl border border-border"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={item.drink.image || "/placeholder.svg"}
                              alt={item.drink.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-lg text-navy-deep truncate">
                              {item.drink.name}
                            </h3>
                            <p className="text-teal font-medium">
                              €{(item.drink.price * item.quantity).toFixed(2)}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-navy/50 mt-1 truncate">
                                {item.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.drink.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-secondary transition-colors border border-border"
                              >
                                <Minus className="w-4 h-4 text-navy-deep" />
                              </button>
                              <span className="w-8 text-center text-navy-deep font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.drink.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-secondary transition-colors border border-border"
                              >
                                <Plus className="w-4 h-4 text-navy-deep" />
                              </button>
                              <button
                                onClick={() => removeItem(item.drink.id)}
                                className="ml-auto p-2 text-navy/40 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-navy/60">Total</span>
                    <span className="text-3xl font-serif text-navy-deep">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onConfirmOrder}
                    className="w-full py-4 bg-teal text-white font-semibold rounded-2xl text-lg shadow-lg shadow-teal/20 hover:bg-teal-light transition-all duration-300"
                  >
                    Confirm Order
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
