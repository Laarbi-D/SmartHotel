"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "./translation"; 

// 1. Définition des types
type Language = "fr" | "en" | "es";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  // Correction ici : on dit que 't' est une des versions de notre objet translations
  t: (typeof translations)["fr" | "en" | "es"]; 
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  // On sélectionne la traduction. 
  // Le "as any" ici règle le conflit de structure si une langue est plus complète qu'une autre.
  const t = translations[lang] as any;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}