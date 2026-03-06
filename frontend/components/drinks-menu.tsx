"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drinks, categories, type Drink, type DrinkCategory } from "@/lib/drinks-data";
import { DrinkCard } from "./drink-card";
import { WaveDecoration } from "./wave-decoration";

interface DrinksMenuProps {
  onSelectDrink: (drink: Drink) => void;
}

export const DrinksMenu = forwardRef<HTMLElement, DrinksMenuProps>(
  function DrinksMenu({ onSelectDrink }, ref) {
    const [activeCategory, setActiveCategory] = useState<DrinkCategory>("cocktails");

    const filteredDrinks = drinks.filter((drink) => drink.category === activeCategory);

    return (
      <section ref={ref} className="relative py-20 px-4 bg-background">
        <WaveDecoration className="absolute top-0 left-0 right-0 -translate-y-full rotate-180" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-navy-deep mb-4">
              Our Selection
            </h2>
            <p className="text-navy/60 text-lg max-w-md mx-auto">
              Curated drinks crafted with the finest ingredients
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-teal text-white shadow-lg shadow-teal/20"
                    : "bg-white text-navy border border-border hover:border-teal/30 hover:bg-muted"
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Drinks Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDrinks.map((drink, index) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  onSelect={onSelectDrink}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }
);
