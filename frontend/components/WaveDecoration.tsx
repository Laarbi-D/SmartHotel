// Indication stricte pour Next.js : ce fichier doit être exécuté côté client
// C'est obligatoire car les animations (framer-motion) nécessitent le navigateur (DOM)
"use client";

// Importation de l'objet 'motion' depuis la bibliothèque framer-motion
// Permet de transformer des balises HTML/SVG classiques en éléments animables
import { motion } from "framer-motion";

// ==========================================
// COMPOSANT 1 : DÉCORATION DE VAGUE (FOND)
// ==========================================
// Déclaration du composant fonctionnel WaveDecoration
// Accepte une propriété optionnelle 'className' pour injecter du style CSS personnalisé
export function WaveDecoration({ className = "" }: { className?: string }) {
  return (
    // Conteneur principal : 
    // - overflow-hidden : Coupe tout ce qui dépasse du conteneur
    // - pointer-events-none : Désactive les interactions souris pour que la vague ne bloque pas les clics sur les éléments en dessous
    <div className={`overflow-hidden pointer-events-none ${className}`}>
      
      <svg
        // viewBox : Définit les coordonnées internes du dessin (largeur 1200, hauteur 120)
        viewBox="0 0 1200 120"
        // preserveAspectRatio="none" : Permet d'étirer le SVG pour qu'il prenne toute la largeur de l'écran sans conserver ses proportions d'origine
        preserveAspectRatio="none"
        className="w-full h-16 md:h-24"
      >
        <motion.path
          // Attribut 'd' (Data) : Contient les coordonnées mathématiques de la courbe de Bézier initiale
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-teal/10" // Application d'une opacité très faible (10%)
          
          // État initial de l'animation (avant le chargement)
          initial={{ d: "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" }}
          
          // État animé : Tableau de plusieurs courbes pour créer un mouvement fluide (morphing)
          animate={{
            d: [
              "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z",
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
              "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z",
            ],
          }}
          
          // Configuration de la transition
          transition={{
            duration: 8, // L'animation complète dure 8 secondes
            repeat: Number.POSITIVE_INFINITY, // Répétition en boucle infinie
            ease: "easeInOut", // Accélération et décélération douces aux extrémités du mouvement
          }}
        />

        <motion.path
          // La forme initiale est légèrement différente de la première vague pour créer un effet de profondeur (parallaxe)
          d="M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-teal/5" // Opacité encore plus faible (5%)
          
          initial={{ d: "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
              "M0,60 C200,100 400,20 600,80 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
              "M0,80 C200,40 400,100 600,40 C800,100 1000,20 1200,80 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 10, // Durée différente (10s) pour que les deux vagues ne soient jamais parfaitement synchronisées
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}


// ==========================================
// COMPOSANT 2 : ICÔNE DE VAGUE (PETIT FORMAT)
// ==========================================
// Déclaration du composant WaveIcon, utilisé pour des éléments d'interface plus petits
export function WaveIcon({ className = "" }: { className?: string }) {
  return (
    // Utilisation directe de <motion.svg> pour animer l'apparition globale de l'icône (fade-in)
    <motion.svg
      viewBox="0 0 100 40"
      className={`w-24 h-10 ${className}`}
      // Apparition en fondu : passe d'une opacité 0 à 1 en 0.5 seconde
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      <motion.path
        // Dessin d'une courbe quadratique simple (Q/T) au lieu d'une courbe de Bézier complexe
        d="M0,20 Q25,5 50,20 T100,20"
        fill="none" // Aucun remplissage, on ne veut que la ligne de contour
        stroke="currentColor" // La couleur du trait s'adapte à la classe texte parente
        strokeWidth="2" // Épaisseur du trait
        className="text-teal"
        
        // Animation technique "Draw SVG" : on anime la propriété 'pathLength'
        // Le trait commence invisible (longueur 0) et se dessine jusqu'à sa taille réelle (longueur 1)
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      <motion.path
        d="M0,28 Q25,13 50,28 T100,28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-navy/40"
        
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        // L'ajout d'un délai (delay: 0.3) permet au deuxième trait de commencer à se dessiner juste après le premier
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}