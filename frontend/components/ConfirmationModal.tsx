"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useSearchParams } from "next/navigation";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ isOpen, onClose }: ConfirmationModalProps) {
  const { guest } = useAuth();
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const [activeTable, setActiveTable] = useState<number>(0);

  useEffect(() => {
    const tableParam = searchParams.get("table");
    if (tableParam) {
      setActiveTable(parseInt(tableParam, 10));
    } else {
      const savedTable = sessionStorage.getItem("smart_hotel_table");
      if (savedTable) {
        setActiveTable(parseInt(savedTable, 10));
      }
    }
  }, [searchParams, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 25 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl border border-border">
              
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="relative w-24 h-24 mx-auto mb-8">
                <motion.div animate={{ scale: [0.8, 1.5, 2], opacity: [0.5, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-teal/30" />
                <div className="absolute inset-0 rounded-full bg-teal flex items-center justify-center">
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="font-serif text-3xl md:text-4xl text-navy-deep mb-4">
                {t.confirmation?.title || "Commande confirmée"}
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-navy/60 mb-6 leading-relaxed">
                {t.confirmation?.subtitle || "Votre commande a été transmise à notre équipe. Elle sera préparée dans les plus brefs délais."}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border mb-8 text-sm font-medium">
                <MapPin className="w-4 h-4 text-teal" />
                
                {/* 100% TRANSAT : On affiche la traduction selon la langue, avec ou sans le numéro */}
                {activeTable > 0 ? (
                  <span className="text-teal font-bold">
                    {lang === 'en' ? 'Delivery to Sunbed' : lang === 'es' ? 'Entrega en Hamaca' : 'Livraison au Transat'} {activeTable}
                  </span>
                ) : (
                  <span className="text-teal font-bold">
                    {lang === 'en' ? 'Delivery to Sunbed' : lang === 'es' ? 'Entrega en Hamaca' : 'Livraison au Transat'}
                  </span>
                )}
              </motion.div>

              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full px-8 py-4 bg-teal text-white font-medium rounded-2xl hover:bg-teal-light transition-all shadow-md">
                {t.confirmation?.button || "Retourner au menu"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}