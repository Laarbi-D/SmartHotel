"use client";

import { useState, useRef } from "react";
import { CartProvider, useCart } from "@/lib/cart-context"; // Import groupé
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { DrinksMenu } from "@/components/drinks-menu";
import { DrinkDetailModal } from "@/components/drink-detail-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { LoginScreen } from "@/components/login-screen";

// --- CONTENU PRINCIPAL ---
function MainApp() {
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart(); // Maintenant utilisable car dans le Provider
  
  const [selectedDrink, setSelectedDrink] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // Sécurité : Si pas connecté, on bloque sur le Login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConfirmOrder = () => {
    setIsCartOpen(false);
    setIsConfirmationOpen(true);
    clearCart(); // Vide le panier après confirmation
  };

  return (
    <main className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <HeroSection 
        onOrderClick={scrollToMenu} 
        onMenuClick={scrollToMenu} 
      />
      
      <DrinksMenu 
        ref={menuRef}
        onSelectDrink={(drink) => setSelectedDrink(drink)} 
      />

      <DrinkDetailModal
        drink={selectedDrink}
        isOpen={selectedDrink !== null}
        onClose={() => setSelectedDrink(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      />

      {/* Footer Luxe */}
      <footer className="py-12 px-4 bg-card border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif text-2xl text-foreground mb-2">Barceló Sevilla Renacimiento</p>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Five Star Luxury · Pool Bar Service</p>
        </div>
      </footer>
    </main>
  );
}

// --- EXPORT PAR DÉFAUT (POINT D'ENTRÉE) ---
export default function Home() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}