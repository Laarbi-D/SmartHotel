"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "./translation"; // Assure-toi que ce fichier existe !

// 1. Définition des types autorisés
type Language = "fr" | "en" | "es";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en; // Utilise la structure de la version anglaise comme modèle
}

// 2. Création du contexte avec le bon type
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  // 3. Sélection dynamique de la traduction
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 4. Hook personnalisé pour utiliser la langue
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}