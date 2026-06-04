"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context"; 
import { useSearchParams } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: () => void;
}

export function CartDrawer({ isOpen, onClose, onConfirmOrder }: CartDrawerProps) {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useLanguage(); 

  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");
  // Conversion propre en entier, par défaut 0 si non présent
  const tableId = tableParam ? parseInt(tableParam, 10) : 0;

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!items || items.length === 0) return;

    // DETAIL_COMMANDE contient uniquement la liste textuelle des articles
    const detailText = items
      .map((item) => `${item?.quantity ?? 1}x ${item?.drink?.LIBELLE_PRODUIT || "Boisson"}`)
      .join(", ");

    const orderData = {
      ID_CLIENT: 1, 
      ID_EMPLOYE: 1, 
      id_tables_transat: tableId, // L'ID du transat est envoyé séparément, propre
      DETAIL_COMMANDE: detailText,
      MONTANT_TOTAL: totalPrice ?? 0,
    };

    try {
      const response = await fetch("/api/commandes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data?.status === "success") {
        clearCart(); 
        onConfirmOrder(); 
      } else {
        alert("Erreur système : " + (data?.message || "Impossible d'enregistrer la commande."));
      }
    } catch (error) {
      console.error("Échec de la communication avec l'API :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl text-navy-deep">
                {t?.cart?.title || "Mon Panier"} {tableId > 0 ? `(Transat ${tableId})` : ""}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-navy-deep" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {(!items || items.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <p>{t?.cart?.empty || "Votre panier est vide"}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    if (!item?.drink) return null;
                    const id = item.drink.ID_PRODUIT;
                    const name = item.drink.LIBELLE_PRODUIT || "Boisson";
                    const price = parseFloat(item.drink.PRIX_PRODUIT) || 0;
                    const image = item.drink.IMAGE_PRODUIT || "/placeholder.svg";
                    const lineTotal = price * item.quantity;

                    return (
                      <motion.div key={id} layout className="flex gap-4 p-4 bg-muted rounded-2xl border border-border">
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
                              <button type="button" onClick={() => updateQuantity(id, item.quantity - 1)} className="p-1">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(id, item.quantity + 1)} className="p-1">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button type="button" onClick={() => removeItem(id)} className="ml-auto text-red-400">
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

            {items && items.length > 0 && (
              <div className="p-6 border-t border-border bg-white">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-navy/60 font-medium">{t?.common?.total || "Total"}</span>
                  <span className="text-3xl font-serif text-navy-deep">€{(totalPrice ?? 0).toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-4 bg-teal text-white font-semibold rounded-2xl shadow-lg hover:bg-teal-light"
                >
                  {t?.cart?.confirm || "Confirmer la commande"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}