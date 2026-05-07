"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/language-context"; 

interface DrinkCardProps {
  drink: any; 
  onSelect: (drink: any) => void;
  index: number;
}

export function DrinkCard({ drink, onSelect, index }: DrinkCardProps) {
  const { t, lang } = useLanguage(); // On récupère 'lang' (fr, en ou es)

  // LOGIQUE DE TRADUCTION DYNAMIQUE :
  // Si lang est "en", on cherche "LIBELLE_PRODUIT_EN"
  // Si lang est "fr", on reste sur "LIBELLE_PRODUIT" (français par défaut)
  const suffix = lang === "fr" ? "" : `_${lang.toUpperCase()}`;
  
  const displayName = drink[`LIBELLE_PRODUIT${suffix}`] || drink.LIBELLE_PRODUIT;
  const displayBio = drink[`BIO${suffix}`] || drink.BIO;

  const displayPrice = drink.PRIX_PRODUIT 
    ? parseFloat(drink.PRIX_PRODUIT).toFixed(2) 
    : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-teal/40 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* SECTION IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={drink.IMAGE_PRODUIT || "/placeholder.svg"} 
          alt={displayName || "SmartHotel Drink"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </div>

      <div className="p-5">
        {/* EN-TÊTE : Libellé traduit et Prix */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif text-xl text-navy-deep line-clamp-1">
            {displayName}
          </h3>
          <span className="text-teal font-semibold text-lg whitespace-nowrap">
            €{displayPrice}
          </span>
        </div>
        
        {/* DESCRIPTION TRADUITE */}
        <p className="text-navy/60 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {displayBio}
        </p>

        {/* BOUTON D'ACTION */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(drink)}
          className="w-full py-3 bg-muted hover:bg-teal text-navy hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          {t.cart.addOrder}
        </motion.button>
      </div>
    </motion.div>
  );
}