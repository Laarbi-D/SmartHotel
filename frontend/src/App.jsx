"use client";

import { useState } from 'react';
import './App.css';
// Import des composants qu'on a préparés
import { DrinksMenu } from "./components/drinks-menu";
import { DrinkDetailModal } from "./components/drink-detail-modal";
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";

function App() {
  // --- ÉTATS POUR LA LOGIQUE DU SITE ---
  
  // Stocke la boisson sélectionnée quand on clique sur "Add to order"
  const [selectedDrink, setSelectedDrink] = useState(null);
  
  // Gère l'affichage de la fenêtre surgissante (Modale)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ACTIONS ---

  // Cette fonction est envoyée au DrinksMenu. 
  // Quand on clique sur une carte, elle reçoit l'objet de la BDD.
  const handleSelectDrink = (drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDrink(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. La barre de navigation avec le logo et l'icône panier */}
      <Navbar />

      {/* 2. La bannière de bienvenue (Luxe / Barcelo) */}
      <Hero />

      {/* 3. LE MENU DYNAMIQUE (Connecté à ta table PRODUIT) */}
      {/* On lui passe la fonction pour qu'il sache quoi faire au clic */}
      <DrinksMenu onSelectDrink={handleSelectDrink} />

      {/* 4. LA MODALE DE DÉTAIL */}
      {/* Elle s'affiche par-dessus si isModalOpen est vrai */}
      <DrinkDetailModal 
        drink={selectedDrink} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />

      {/* 5. Pied de page discret */}
      <footer className="py-8 text-center text-navy/30 text-xs">
        © 2026 Barceló Sevilla Renacimiento · Service Room & Pool
      </footer>
    </div>
  );
}

export default App;