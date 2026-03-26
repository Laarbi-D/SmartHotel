"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";

interface DrinkCardProps {
  // 'drink' contient maintenant une ligne complète de la table PRODUIT (MySQL)
  drink: any; 
  onSelect: (drink: any) => void;
  index: number;
}

export function DrinkCard({ drink, onSelect, index }: DrinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-teal/40 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* SECTION IMAGE : Récupération du chemin via la BDD */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={drink.LIEN_IMAGE_PRODUIT || "/placeholder.svg"} 
          alt={drink.LIBELLE_PRODUITS || "Drink image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </div>

      <div className="p-5">
        {/* EN-TÊTE : Libellé et Prix extraits de la BDD */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif text-xl text-navy-deep">
            {drink.LIBELLE_PRODUITS}
          </h3>
          <span className="text-teal font-semibold text-lg">
            €{drink.PRIX_PRODUITS}
          </span>
        </div>
        
        {/* DESCRIPTION : Extraite de la BDD */}
        <p className="text-navy/60 text-sm leading-relaxed mb-4">
          {drink.DESCRIPTION_PRODUIT}
        </p>

        {/* BOUTON D'ACTION : Ouvre la modale de détail */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(drink)}
          className="w-full py-3 bg-muted hover:bg-teal text-navy hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add to order
        </motion.button>
      </div>
    </motion.div>
  );
}