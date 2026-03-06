"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import type { Drink } from "@/lib/drinks-data";
import { useCart } from "@/lib/cart-context";

interface DrinkDetailModalProps {
  drink: Drink | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DrinkDetailModal({ drink, isOpen, onClose }: DrinkDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { addItem } = useCart();

  const handleAddToOrder = () => {
    if (drink) {
      addItem(drink, quantity, notes);
      setQuantity(1);
      setNotes("");
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setNotes("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && drink && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
              >
                <X className="w-5 h-5 text-navy-deep" />
              </button>

              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={drink.image || "/placeholder.svg"}
                  alt={drink.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 -mt-8 relative bg-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="font-serif text-3xl text-navy-deep">{drink.name}</h2>
                  <span className="text-teal font-semibold text-2xl">€{drink.price}</span>
                </div>

                <p className="text-navy/60 leading-relaxed mb-6">
                  {drink.description}
                </p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm text-navy/60 mb-3 font-medium">Quantity</label>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-secondary transition-colors border border-border"
                    >
                      <Minus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                    <span className="text-2xl font-semibold text-navy-deep w-12 text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-secondary transition-colors border border-border"
                    >
                      <Plus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                  </div>
                </div>

                {/* Notes Field */}
                <div className="mb-8">
                  <label className="block text-sm text-navy/60 mb-3 font-medium">
                    Special requests
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Less ice, extra lemon, no garnish..."
                    className="w-full px-4 py-3 bg-muted rounded-xl text-navy-deep placeholder:text-navy/40 resize-none border border-border focus:border-teal focus:ring-1 focus:ring-teal/50 outline-none transition-all"
                    rows={2}
                  />
                </div>

                {/* Add to Order Button */}
                <motion.button
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToOrder}
                  className="w-full py-4 bg-teal text-white font-semibold rounded-2xl text-lg shadow-lg shadow-teal/20 hover:bg-teal-light transition-all duration-300"
                >
                  Add to order · €{(drink.price * quantity).toFixed(2)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
