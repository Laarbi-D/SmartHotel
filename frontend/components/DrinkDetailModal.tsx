// Déclaration spécifique à Next.js indiquant une exécution côté client
// Requis pour la gestion d'états (useState) et l'animation d'apparition/disparition du DOM (Framer Motion)
"use client";

// Importation des utilitaires React pour la gestion d'état local
import { useState } from "react";
// Importation des composants d'animation de Framer Motion
// 'AnimatePresence' est crucial pour animer la fermeture d'un composant modal
import { motion, AnimatePresence } from "framer-motion";
// Importation du composant d'image optimisé Next.js
import Image from "next/image";
// Importation d'icônes vectorielles standardisées (Lucide React)
import { X, Minus, Plus } from "lucide-react";
// Importation des hooks de contexte pour l'interaction avec le panier et les traductions
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context"; 

// ==========================================
// INTERFACE TYPESCRIPT : PROPRIÉTÉS DU MODAL
// ==========================================
// Typage des données attendues par le composant
interface DrinkDetailModalProps {
  drink: any | null;      // Objet contenant les données de la boisson (ou null si fermé)
  isOpen: boolean;        // Booléen contrôlant la visibilité du composant
  onClose: () => void;    // Fonction de rappel pour déclencher la fermeture depuis le parent
}

// ==========================================
// COMPOSANT PRINCIPAL : MODAL DE DÉTAIL
// ==========================================
export function DrinkDetailModal({ drink, isOpen, onClose }: DrinkDetailModalProps) {
  // Déclaration de l'état local pour la gestion du compteur d'articles (défaut: 1)
  const [quantity, setQuantity] = useState(1);
  
  // Extraction de la méthode d'ajout depuis le contexte global du panier
  const { addItem } = useCart();
  
  // Extraction du dictionnaire (t) et de la langue active (lang) depuis le contexte i18n
  const { t, lang } = useLanguage(); 

  // ==========================================
  // LOGIQUE MÉTIER : TRADUCTION DYNAMIQUE
  // ==========================================
  // Construction dynamique du suffixe de langue basé sur la base de données.
  // En français (langue par défaut de la BDD), aucun suffixe. Sinon, ajout de _EN ou _ES.
  const suffix = lang === "fr" ? "" : `_${lang.toUpperCase()}`;
  
  // Extraction du nom de la boisson : Tentative d'accès à la colonne traduite (ex: LIBELLE_PRODUIT_EN),
  // avec basculement automatique sur la colonne par défaut (LIBELLE_PRODUIT) si la traduction est absente.
  const displayName = drink ? (drink[`LIBELLE_PRODUIT${suffix}`] || drink.LIBELLE_PRODUIT) : "";
  
  // Extraction de la description (BIO) en appliquant la même logique de repli (fallback)
  const displayBio = drink ? (drink[`BIO${suffix}`] || drink.BIO) : "";
  
  // Sécurisation et conversion du prix au format numérique (décimal)
  const price = drink ? parseFloat(drink.PRIX_PRODUIT) : 0;

  // ==========================================
  // GESTIONNAIRES D'ÉVÉNEMENTS (HANDLERS)
  // ==========================================
  
  // Traitement de l'ajout au panier
  const handleAddToOrder = () => {
    if (drink) {
      // Construction d'un nouvel objet écrasant le LIBELLE_PRODUIT original par le nom traduit.
      // Cela garantit que le panier affichera toujours l'article dans la langue choisie au moment de l'ajout.
      addItem({ ...drink, LIBELLE_PRODUIT: displayName }, quantity, ""); 
      // Réinitialisation du compteur pour la prochaine ouverture
      setQuantity(1);
      // Déclenchement de la fermeture du modal
      onClose();
    }
  };

  // Traitement de la fermeture manuelle ou clics extérieurs
  const handleClose = () => {
    // Réinitialisation préventive de la quantité pour éviter la conservation de l'état entre deux ouvertures
    setQuantity(1);
    onClose();
  };

  return (
    // AnimatePresence permet d'exécuter les animations 'exit' de Framer Motion avant de retirer le composant de l'arbre DOM
    <AnimatePresence>
      {/* Affichage conditionnel : Le composant ne s'affiche que si isOpen est vrai ET qu'un objet drink est fourni */}
      {isOpen && drink && (
        <>
          {/* 1. CALQUE D'ARRIÈRE-PLAN OBSCURI (OVERLAY) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose} // La fermeture est déclenchée au clic sur l'arrière-plan
            className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-sm"
          />

          {/* 2. CONTENEUR PRINCIPAL DU MODAL */}
          <motion.div
            // Animation d'entrée : Glissement vers le haut (y: 100) avec un léger effet d'échelle
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            // Configuration d'une transition physique (ressort / spring) pour un effet de rebond léger
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // Positionnement responsive : En bas sur mobile, centré au milieu de l'écran sur desktop (md:)
            className="fixed inset-x-4 bottom-4 top-auto z-50 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
          >
            {/* Boîte de contenu avec bords arrondis, ombre portée et défilement vertical si le contenu est trop long */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              
              {/* BOUTON DE FERMETURE (Croix en haut à droite) */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
              >
                <X className="w-5 h-5 text-navy-deep" />
              </button>

              {/* SECTION VISUELLE : Image d'illustration de la boisson */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={drink.IMAGE_PRODUIT || "/placeholder.svg"} // Image de secours si absence de données
                  alt={displayName}
                  fill
                  className="object-cover"
                  priority // Priorité de chargement haute car c'est l'élément central du modal
                />
                {/* Dégradé css superposé pour assurer une transition fluide entre l'image et le texte inférieur */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* SECTION TEXTUELLE ET INTERACTIVE */}
              {/* Remontée du bloc sur l'image via marge négative (-mt-8) pour un effet de superposition */}
              <div className="p-6 -mt-8 relative bg-white">
                
                {/* Ligne : Titre et Prix */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="font-serif text-3xl text-navy-deep">
                    {/* Injection du titre traduit */}
                    {displayName} 
                  </h2>
                  {/* Affichage du prix unitaire formaté avec 2 décimales */}
                  <span className="text-teal font-semibold text-2xl">
                    €{price.toFixed(2)}
                  </span>
                </div>

                {/* Paragraphe : Description du produit */}
                <p className="text-navy/60 leading-relaxed mb-6">
                  {/* Injection de la description (bio) traduite */}
                  {displayBio}
                </p>

                {/* SÉLECTEUR DE QUANTITÉ */}
                <div className="mb-8">
                  <label className="block text-sm text-navy/60 mb-3 font-medium uppercase tracking-wider">
                    {/* Label traduit ("Quantité") */}
                    {t.common.quantity}
                  </label>
                  
                  <div className="flex items-center gap-4">
                    {/* Bouton de soustraction */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      // Utilisation de Math.max pour bloquer la quantité à un minimum de 1
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border hover:bg-border transition-colors"
                    >
                      <Minus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                    
                    {/* Affichage de la quantité courante */}
                    <span className="text-2xl font-semibold text-navy-deep w-12 text-center">
                      {quantity}
                    </span>

                    {/* Bouton d'addition */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border hover:bg-border transition-colors"
                    >
                      <Plus className="w-5 h-5 text-navy-deep" />
                    </motion.button>
                  </div>
                </div>

                {/* BOUTON D'AJOUT AU PANIER (CTA) */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToOrder}
                  className="w-full py-4 bg-teal text-white font-semibold rounded-2xl text-lg shadow-lg hover:bg-teal-light transition-all flex justify-center items-center gap-2"
                >
                  {/* Concaténation du texte traduit et du prix total calculé (Prix unitaire * Quantité) */}
                  {t.cart.addOrder} · €{(price * quantity).toFixed(2)}
                </motion.button>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}