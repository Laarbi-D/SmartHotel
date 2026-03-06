"use client";

import { motion } from "framer-motion";
import { ShoppingBag, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems } = useCart();
  const { guest, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logobarcelo.png"
            alt="Barceló Sevilla Renacimiento"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="hidden sm:block">
            <p className="text-navy-deep font-serif text-lg tracking-wide">Barceló Sevilla</p>
            <p className="text-navy/70 text-xs tracking-[0.2em] uppercase">Renacimiento</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Guest Info */}
          {guest && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
              <User className="w-3.5 h-3.5 text-teal" />
              <span className="text-navy-deep text-sm font-medium">{guest.name}</span>
              <span className="text-navy/60 text-xs">Room {guest.roomNumber}</span>
            </div>
          )}

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="p-2.5 rounded-full bg-muted hover:bg-secondary transition-colors border border-border"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 text-navy/60" />
          </motion.button>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartClick}
            className="relative p-3 rounded-full bg-teal hover:bg-teal-light transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-copper text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
