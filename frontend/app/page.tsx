"use client";

import { useState, useRef } from "react";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DrinksMenu } from "@/components/DrinksMenu";
import { DrinkDetailModal } from "@/components/DrinkDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { LoginScreen } from "@/components/LoginScreen";
import { useCart } from "@/lib/cart-context";

function AppContent() {
  const { guest } = useAuth(); 

  if (!guest) {
    return <LoginScreen />;
  }

  return <MainApp />;
}

function MainApp() {
  // Remplacement du type Drink par any pour éviter l'erreur d'import manquant
  const [selectedDrink, setSelectedDrink] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const { clearCart } = useCart();

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConfirmOrder = () => {
    setIsCartOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
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
        onClose={handleCloseConfirmation}
      />

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif text-2xl text-foreground mb-2">
            Barceló Sevilla Renacimiento
          </p>
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-6">
            Five Star Luxury
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-3 h-3 text-copper"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Pool Bar Service · Available 10:00 - 20:00
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}