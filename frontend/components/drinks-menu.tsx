"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/drinks-data"; 
import { DrinkCard } from "./drink-card";
import { WaveDecoration } from "./wave-decoration";
import { useLanguage } from "@/lib/language-context"; 

interface DrinksMenuProps {
  onSelectDrink: (drink: any) => void;
}

export const DrinksMenu = forwardRef<HTMLElement, DrinksMenuProps>(
  function DrinksMenu({ onSelectDrink }, ref) {
    const [activeCategory, setActiveCategory] = useState<string>("cocktails");
    const [dbDrinks, setDbDrinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { t } = useLanguage(); 

    useEffect(() => {
      setLoading(true);
      setError(null);

      // On utilise /backend/ pour Nginx et POST pour la sécurité
      fetch('/backend/api.php?table=produit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Serveur injoignable (Statut ${res.status})`);
          return res.json();
        })
        .then((data) => {
          // L'API PHP renvoie parfois des objets d'erreur {"error": "..."}
          if (data && data.error) {
            throw new Error(data.error);
          }
          if (Array.isArray(data)) {
            setDbDrinks(data);
          } else {
            throw new Error("Format de données invalide");
          }
        })
        .catch((err) => {
          console.error("ERREUR RÉSEAU :", err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, []);

    const displayDrinks = dbDrinks.filter((drink) => {
      // On s'assure de matcher avec les majuscules/minuscules de la nouvelle BDD
      const bddCat = (drink.CATEGORIE || drink.categorie || "").toString().trim().toLowerCase();
      return bddCat === activeCategory.toLowerCase();
    });

    return (
      <section ref={ref} className="relative py-20 px-4 bg-background">
        <WaveDecoration className="absolute top-0 left-0 right-0 -translate-y-full rotate-180" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-navy-deep mb-4">
              {t.menu.title}
            </h2>
            <p className="text-navy/60 text-lg">
              {t.menu.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-teal text-white shadow-lg"
                    : "bg-white text-navy border border-border hover:bg-muted"
                }`}
              >
                {(t as any).categories?.[cat.id] || cat.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayDrinks.length > 0 ? (
                displayDrinks.map((drink, index) => (
                  <DrinkCard
                    key={drink.ID_PRODUIT || drink.id_produit || index}
                    drink={drink}
                    onSelect={onSelectDrink}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-border rounded-3xl">
                  {loading ? (
                    <p className="animate-pulse text-teal">{t.menu.loading}</p>
                  ) : error ? (
                    <div className="text-red-500">
                      <p className="font-bold">{t.menu.error}</p>
                      <p className="text-xs opacity-70">{error}</p>
                    </div>
                  ) : (
                    <p className="text-navy/40 italic">
                      {t.menu.noDrinks} "{(t as any).categories?.[activeCategory] || activeCategory}"
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }
);