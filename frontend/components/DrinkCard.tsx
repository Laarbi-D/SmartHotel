// Déclaration obligatoire pour le routeur Next.js indiquant une exécution côté client
// Requis pour la gestion des événements utilisateurs (onClick) et les animations (framer-motion)
"use client";

// Importation du module d'animation pour gérer les transitions et les effets de survol
import { motion } from "framer-motion";
// Importation du composant natif de Next.js pour l'optimisation du chargement des images
import Image from "next/image";
// Importation de l'icône d'ajout (+) depuis la bibliothèque vectorielle Lucide React
import { Plus } from "lucide-react";
// Importation du hook personnalisé permettant l'accès au contexte linguistique
import { useLanguage } from "@/lib/language-context"; 

// ==========================================
// INTERFACE TYPESCRIPT : PROPRIÉTÉS DU COMPOSANT
// ==========================================
// Définition du contrat des propriétés (props) attendues par la carte
interface DrinkCardProps {
  drink: any;                     // Objet contenant toutes les données brutes de la boisson issues de la BDD
  onSelect: (drink: any) => void; // Fonction de rappel exécutée lorsque l'utilisateur clique sur le bouton d'ajout
  index: number;                  // Position de la carte dans la liste (utilisé pour décaler l'animation d'apparition)
}

// ==========================================
// COMPOSANT PRINCIPAL : CARTE DE BOISSON
// ==========================================
export function DrinkCard({ drink, onSelect, index }: DrinkCardProps) {
  // Extraction de la fonction de traduction 't' et du code de la langue active 'lang' (fr, en, es)
  const { t, lang } = useLanguage();

  // ==========================================
  // LOGIQUE MÉTIER : TRADUCTION DYNAMIQUE
  // ==========================================
  // Construction du suffixe pour cibler la bonne colonne dans la base de données.
  // Si la langue est le français (langue source), aucun suffixe n'est ajouté.
  // Sinon, conversion du code langue en majuscules avec un tiret bas (ex: "_EN" ou "_ES").
  const suffix = lang === "fr" ? "" : `_${lang.toUpperCase()}`;
  
  // Récupération dynamique du nom du produit :
  // Tente de lire la propriété avec le suffixe (ex: LIBELLE_PRODUIT_EN),
  // et bascule sur la propriété par défaut (LIBELLE_PRODUIT) si la traduction est vide ou inexistante.
  const displayName = drink[`LIBELLE_PRODUIT${suffix}`] || drink.LIBELLE_PRODUIT;
  
  // Récupération dynamique de la description selon la même logique de repli (fallback)
  const displayBio = drink[`BIO${suffix}`] || drink.BIO;

  // Sécurisation et formatage du prix :
  // Conversion en nombre décimal (parseFloat) et formatage à deux chiffres après la virgule (toFixed).
  // Si la valeur est nulle ou invalide, la valeur par défaut "0.00" est appliquée.
  const displayPrice = drink.PRIX_PRODUIT 
    ? parseFloat(drink.PRIX_PRODUIT).toFixed(2) 
    : "0.00";

  return (
    // Conteneur principal animé (motion.div) représentant la structure de la carte
    <motion.div
      // Animation d'entrée : La carte démarre transparente et légèrement plus bas (y: 20)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Transition dynamique : La durée est de 0.5s, mais le démarrage est retardé selon l'index.
      // Cela crée un effet de cascade fluide (stagger effect) lors de l'affichage de la grille.
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // Effet au survol : Élévation visuelle de la carte vers le haut (-4px)
      whileHover={{ y: -4 }}
      // Classes CSS Tailwind :
      // - group : Permet de déclencher des effets sur les éléments enfants (comme le zoom de l'image) lors du survol de la carte
      // - bg-card, rounded-2xl, border : Définition de l'apparence physique (fond, bords arrondis, bordure)
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-teal/40 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* ========================================== */}
      {/* SECTION SUPÉRIEURE : IMAGE DU PRODUIT */}
      {/* ========================================== */}
      {/* Conteneur de l'image avec un ratio contraint (4/3) et masquage des débordements */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          // Injection de l'URL de l'image depuis la BDD, avec une image de remplacement en cas d'absence
          src={drink.IMAGE_PRODUIT || "/placeholder.svg"} 
          alt={displayName || "SmartHotel Drink"}
          fill // Instruction Next.js pour occuper tout le conteneur parent
          // Le survol du parent (.group) déclenche un léger zoom (scale-105) sur l'image
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Calque de superposition en dégradé (bas vers le haut) pour donner de la profondeur visuelle */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </div>

      {/* ========================================== */}
      {/* SECTION INFÉRIEURE : INFORMATIONS ET ACTION */}
      {/* ========================================== */}
      <div className="p-5">
        
        {/* Ligne d'en-tête : Nom du produit et Prix */}
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Titre restreint à une seule ligne (line-clamp-1), le reste sera tronqué avec des points de suspension */}
          <h3 className="font-serif text-xl text-navy-deep line-clamp-1">
            {displayName}
          </h3>
          {/* Prix formaté avec blocage des retours à la ligne (whitespace-nowrap) pour éviter une rupture visuelle */}
          <span className="text-teal font-semibold text-lg whitespace-nowrap">
            €{displayPrice}
          </span>
        </div>
        
        {/* Paragraphe de description : Hauteur minimale définie et restriction à deux lignes maximum (line-clamp-2) */}
        <p className="text-navy/60 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {displayBio}
        </p>

        {/* Bouton d'action (Appel à la sélection) */}
        <motion.button
          // Effets de retour haptique visuel (micro-interactions) via Framer Motion
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          // Déclenchement de la fonction de sélection en lui passant l'objet complet
          onClick={() => onSelect(drink)}
          // Styles du bouton combinant un fond atténué (bg-muted) basculant vers la couleur principale (teal) au survol
          className="w-full py-3 bg-muted hover:bg-teal text-navy hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
        >
          {/* Intégration de l'icône "+" et du texte traduit ("Ajouter", "Add", etc.) */}
          <Plus className="w-4 h-4" />
          {t.cart.addOrder}
        </motion.button>
      </div>
    </motion.div>
  );
}