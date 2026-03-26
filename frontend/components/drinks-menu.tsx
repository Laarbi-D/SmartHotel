"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/drinks-data"; 
import { DrinkCard } from "./drink-card";
import { WaveDecoration } from "./wave-decoration";

interface DrinksMenuProps {
  onSelectDrink: (drink: any) => void;
}

export const DrinksMenu = forwardRef<HTMLElement, DrinksMenuProps>(
  function DrinksMenu({ onSelectDrink }, ref) {
    const [activeCategory, setActiveCategory] = useState<string>("cocktails");
    const [dbDrinks, setDbDrinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      setLoading(true);
      setError(null);

      // --- CONNEXION À TON IP FIXE ---
      fetch('http://192.168.112.158:8080/api.php?table=PRODUIT', {
        method: 'GET',
        mode: 'cors', // Crucial pour que le navigateur accepte la réponse du PHP
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Serveur injoignable (Statut ${res.status})`);
          return res.json();
        })
        .then((data) => {
          // Si l'API renvoie un tableau (même vide), c'est bon
          if (Array.isArray(data)) {
            setDbDrinks(data);
          } else {
            throw new Error("Format de données invalide");
          }
        })
        .catch((err) => {
          console.error("ERREUR RÉSEAU :", err);
          // C'est ce message qui s'affiche si le fetch échoue
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, []);

    // --- FILTRAGE STRICT ---
    const displayDrinks = dbDrinks.filter((drink) => {
      const bddCat = (drink.CATEGORIE || drink.categorie || "").toString().trim();
      return bddCat === activeCategory;
    });

    return (
      <section ref={ref} className="relative py-20 px-4 bg-background">
        <WaveDecoration className="absolute top-0 left-0 right-0 -translate-y-full rotate-180" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-navy-deep mb-4">Our Selection</h2>
            <p className="text-navy/60 text-lg">Directly from the bar to you</p>
          </div>

          {/* ONGLETS */}
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
                {cat.label}
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
                    key={drink.ID_PRODUIT || index}
                    drink={drink}
                    onSelect={onSelectDrink}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-border rounded-3xl">
                  {loading ? (
                    <p className="animate-pulse text-teal">Connecting to 192.168.112.158...</p>
                  ) : error ? (
                    <div className="text-red-500">
                      <p className="font-bold">Server Error</p>
                      <p className="text-xs opacity-70">Check console (F12) for details</p>
                    </div>
                  ) : (
                    <p className="text-navy/40 italic">No drinks found in "{activeCategory}"</p>
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