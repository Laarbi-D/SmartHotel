"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context"; 

interface DrinkDetailModalProps {
  drink: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DrinkDetailModal({ drink, isOpen, onClose }: DrinkDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { t, lang } = useLanguage(); // On récupère lang ici

  // --- LOGIQUE DE TRADUCTION ---
  const suffix = lang === "fr" ? "" : `_${lang.toUpperCase()}`;
  const displayName = drink ? (drink[`LIBELLE_PRODUIT${suffix}`] || drink.LIBELLE_PRODUIT) : "";
  const displayBio = drink ? (drink[`BIO${suffix}`] || drink.BIO) : "";
  // -----------------------------

  const price = drink ? parseFloat(drink.PRIX_PRODUIT) : 0;

  const handleAddToOrder = () => {
    if (drink) {
      // On envoie le nom traduit à addItem pour que le panier soit cohérent
      addItem({ ...drink, LIBELLE_PRODUIT: displayName }, quantity, ""); 
      setQuantity(1);
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && drink && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
              >
                <X className="w-5 h-5 text-navy-deep" />
              </button>

              <div className="relative aspect-[4/3]">
                <Image
                  src={drink.IMAGE_PRODUIT || "/placeholder.svg"}
                  alt={displayName}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              <div className="p-6 -mt-8 relative bg-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="font-serif text-3xl text-navy-deep">
                    {displayName} {/* TITRE TRADUIT */}
                  </h2>
                  <span className="text-teal font-semibold text-2xl">
                    €{price.toFixed(2)}
                  </span>
                </div>

                <p className="text-navy/60 leading-relaxed mb-6">
                  {displayBio} {/* BIO TRADUITE */}
                </p>

                <div className="mb-8">
                  <label className="block text-sm text-navy/60 mb-3 font-medium uppercase tracking-wider">
                    {t.common.quantity}
                  </label>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border hover:bg-border transition-colors"
                    >
                      <Minus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                    
                    <span className="text-2xl font-semibold text-navy-deep w-12 text-center">
                      {quantity}
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border hover:bg-border transition-colors"
                    >
                      <Plus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToOrder}
                  className="w-full py-4 bg-teal text-white font-semibold rounded-2xl text-lg shadow-lg hover:bg-teal-light transition-all flex justify-center items-center gap-2"
                >
                  {t.cart.addOrder} · €{(price * quantity).toFixed(2)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}