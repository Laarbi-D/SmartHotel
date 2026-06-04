// Déclaration stricte pour Next.js (App Router) : exécution du composant côté client
// C'est obligatoire car la gestion du thème (sombre/clair) nécessite d'accéder au 'localStorage' et au DOM du navigateur, ce qui est impossible côté serveur.
'use client'

// Importation globale de la bibliothèque React
import * as React from 'react'

// Importation des outils nécessaires depuis la bibliothèque externe 'next-themes'
import {
  // Importation du fournisseur de contexte de thème avec un renommage (alias 'as')
  // Le renommage en 'NextThemesProvider' permet d'éviter un conflit de nom avec notre propre fonction 'ThemeProvider' déclarée plus bas
  ThemeProvider as NextThemesProvider,
  // Importation explicite du type TypeScript associé pour garantir la validité des propriétés (props)
  type ThemeProviderProps,
} from 'next-themes'

// ==========================================
// COMPOSANT : FOURNISSEUR DE THÈME PERSONNALISÉ
// ==========================================
// Déclaration et exportation du composant fonctionnel ThemeProvider
// Utilisation de la déstructuration pour extraire 'children' (les composants enfants)
// Utilisation de l'opérateur de reste (rest operator '...props') pour capturer toutes les autres propriétés éventuelles
// Application du typage strict ': ThemeProviderProps' pour sécuriser le composant
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  
  return (
    // Rendu du fournisseur original de 'next-themes'
    // Utilisation de l'opérateur de décomposition (spread operator '{...props}') pour lui transmettre dynamiquement tous les attributs reçus (ex: attribute="class", defaultTheme="system")
    <NextThemesProvider {...props}>
      {/* Encapsulation des composants enfants : tout ce qui sera placé à l'intérieur de ce Provider 
        aura désormais accès au contexte du thème (mode sombre/clair) 
      */}
      {children}
    </NextThemesProvider>
  )
}