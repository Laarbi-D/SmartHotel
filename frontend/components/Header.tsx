"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useSearchParams } from "next/navigation";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems } = useCart();
  const { guest, logout } = useAuth();
  const { lang, setLang } = useLanguage(); 

  const searchParams = useSearchParams();
  const [activeTable, setActiveTable] = useState<number>(0);

  useEffect(() => {
    // 1. On regarde d'abord si la table est dans l'URL
    const tableParam = searchParams.get("table");
    if (tableParam) {
      const parsed = parseInt(tableParam, 10);
      setActiveTable(parsed);
      sessionStorage.setItem("smart_hotel_table", parsed.toString());
    } else {
      // 2. Si elle n'est plus dans l'URL, on regarde si on l'avait sauvegardée en mémoire
      const savedTable = sessionStorage.getItem("smart_hotel_table");
      if (savedTable) {
        setActiveTable(parseInt(savedTable, 10));
      }
    }
  }, [searchParams]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <Image src="/images/logobarcelo.png" alt="Logo" width={50} height={50} className="object-contain" />
          <div className="hidden sm:block">
            <p className="text-navy-deep font-serif text-lg tracking-wide">Barceló Sevilla</p>
            <p className="text-navy/70 text-xs tracking-[0.2em] uppercase">Renacimiento</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {guest && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
              <User className="w-3.5 h-3.5 text-teal" />
              <span className="text-navy-deep text-sm font-medium">{guest.name}</span>
              
              <span className="text-navy/60 text-xs font-semibold">
                {/* 100% TRANSAT : On a supprimé la condition de la chambre */}
                <span className="text-teal">
                  📍 {lang === 'en' ? 'Delivery to Sunbed' : lang === 'es' ? 'Entrega en Hamaca' : 'Livraison au Transat'}
                  {activeTable > 0 ? ` ${activeTable}` : ''}
                </span>
              </span>
            </div>
          )}

          <div className="flex items-center bg-muted rounded-full p-1 border border-border">
            {(['fr', 'en', 'es'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                  lang === l ? "bg-teal text-white shadow-sm" : "text-navy/40 hover:text-navy"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <motion.button onClick={logout} className="p-2.5 rounded-full bg-muted hover:bg-secondary border border-border">
            <LogOut className="w-4 h-4 text-navy/60" />
          </motion.button>

          <motion.button onClick={onCartClick} className="relative p-3 rounded-full bg-teal hover:bg-teal-light">
            <ShoppingBag className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-copper text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-card">
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}