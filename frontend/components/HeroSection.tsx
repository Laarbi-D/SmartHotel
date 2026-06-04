// Déclaration directive pour Next.js (App Router) : exécution du composant côté client requise
// Obligatoire car l'interface utilise des animations complexes (Framer Motion) et des événements utilisateurs (onClick)
"use client";

// Importation du module 'motion' pour créer des composants HTML animés
import { motion } from "framer-motion";
// Importation du composant Image de Next.js pour l'optimisation automatique des ressources graphiques
import Image from "next/image";
// Importation du composant SVG décoratif créé précédemment
import { WaveIcon } from "./WaveDecoration";
// Importation du hook personnalisé pour la gestion du multilinguisme (i18n)
import { useLanguage } from "@/lib/language-context"; 

// ==========================================
// INTERFACE TYPESCRIPT : PROPRIÉTÉS DU COMPOSANT
// ==========================================
// Définition stricte des fonctions attendues en paramètre par le composant HeroSection
interface HeroSectionProps {
  onOrderClick: () => void; // Fonction déclenchée au clic sur "Commander"
  onMenuClick: () => void;  // Fonction déclenchée au clic sur "Voir le menu"
}

// ==========================================
// COMPOSANT PRINCIPAL : SECTION HERO
// ==========================================
// Déclaration du composant avec déstructuration des propriétés typées via l'interface
export function HeroSection({ onOrderClick, onMenuClick }: HeroSectionProps) {
  // Extraction du dictionnaire de traduction 't' depuis le contexte de langue
  const { t } = useLanguage(); 

  return (
    // Conteneur principal (section) :
    // - relative : Permet de positionner les éléments enfants absolus (image de fond)
    // - min-h-screen : Force la section à prendre au minimum 100% de la hauteur de l'écran (viewport)
    // - overflow-hidden : Empêche le débordement des éléments animés en dehors de la zone
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* ========================================== */}
      {/* ARRIÈRE-PLAN : IMAGE ET DÉGRADÉ */}
      {/* ========================================== */}
      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury poolside at sunset"
          // Propriété 'fill' : L'image s'adapte automatiquement à la taille du conteneur parent absolu
          fill
          // 'object-cover' : Recadre l'image sans la déformer pour couvrir tout l'espace
          className="object-cover"
          // 'priority' : Indique à Next.js de précharger cette image immédiatement (optimisation du LCP - Largest Contentful Paint)
          priority
        />
        {/* Calque de superposition (Overlay) : Dégradé sombre pour garantir la lisibilité du texte blanc par-dessus l'image */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-background" />
      </div>

      {/* ========================================== */}
      {/* CONTENU AU PREMIER PLAN (TEXTES ET BOUTONS) */}
      {/* ========================================== */}
      {/* Conteneur principal du texte : z-10 pour le placer au-dessus du fond, centré avec une largeur maximale */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto pt-20">
        
        {/* ANIMATION 1 : Apparition de l'icône de vague */}
        <motion.div
          // État initial : invisible et légèrement décalé vers le bas (y: 30px)
          initial={{ opacity: 0, y: 30 }}
          // État final : visible et à sa position d'origine (y: 0)
          animate={{ opacity: 1, y: 0 }}
          // Transition : durée de 0.8s, avec un léger délai (0.2s) pour amorcer l'effet cascade
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <WaveIcon />
        </motion.div>

        {/* ANIMATION 2 : Apparition du titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          // Délai supérieur (0.4s) pour apparaître juste après l'icône
          transition={{ duration: 0.8, delay: 0.4 }}
          // Typographie : Police Serif, grande taille adaptative (text-5xl à 8xl), texte blanc avec ombre portée (drop-shadow-lg)
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight text-balance mb-6 drop-shadow-lg"
        >
          {/* Injection de la première partie du titre traduit */}
          {t.hero.titlePart1}
          <br />
          {/* Mise en évidence de la seconde partie du titre avec une couleur d'accentuation (aqua-light) */}
          <span className="text-aqua-light">{t.hero.titlePart2}</span>
        </motion.h1>

        {/* ANIMATION 3 : Apparition du sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Délai supérieur (0.6s) pour continuer l'effet cascade
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/80 text-lg md:text-xl font-light mb-12 leading-relaxed"
        >
          {/* Injection du sous-titre traduit */}
          {t.hero.subtitle}
        </motion.p>

        {/* ANIMATION 4 : Apparition du groupe de boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Délai supérieur (0.8s)
          transition={{ duration: 0.8, delay: 0.8 }}
          // Flexbox : Disposition en colonne sur mobile, et en ligne (côte à côte) sur les écrans plus larges (sm:flex-row)
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* BOUTON 1 : Commander (Bouton d'appel à l'action principal - CTA) */}
          <motion.button
            // Effet au survol : Agrandissement de 2% et léger soulèvement (-2px)
            whileHover={{ scale: 1.02, y: -2 }}
            // Effet au clic : Réduction de taille pour simuler un enfoncement physique
            whileTap={{ scale: 0.98 }}
            // Liaison de l'événement de clic à la fonction transmise en propriété
            onClick={onOrderClick}
            className="px-10 py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg shadow-teal/30 hover:bg-teal-light transition-all duration-300"
          >
            {t.hero.orderButton}
          </motion.button>

          {/* BOUTON 2 : Voir le menu (Bouton secondaire avec effet "Glassmorphism") */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMenuClick}
            // Style de verre dépoli : Fond blanc très transparent (bg-white/10), flou d'arrière-plan (backdrop-blur-sm) et bordure subtile
            className="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/40 text-white font-medium rounded-full text-lg hover:bg-white/20 transition-all duration-300"
          >
            {t.hero.menuButton}
          </motion.button>
        </motion.div>

        {/* ANIMATION 5 : Apparition des étoiles de notation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // Apparition beaucoup plus lente (1s) et très retardée (1.2s) pour clore la séquence d'animation
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-1"
        >
          {/* Génération de 5 étoiles via la méthode map() sur un tableau fixe */}
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star} // Clé unique obligatoire en React lors d'un rendu de liste
              className="w-4 h-4 text-copper" // Couleur cuivre pour les étoiles
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {/* Tracé vectoriel d'une étoile standard */}
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          {/* Libellé accompagnant les étoiles */}
          <span className="ml-2 text-white/70 text-sm">
            {t.hero.stars}
          </span>
        </motion.div>
      </div>
    </section>
  );
}