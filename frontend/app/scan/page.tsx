"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Globe } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context"; 

// --- Dictionnaire des traductions de la page Scan ---
const translations = {
  fr: {
    welcome: "Bienvenue au Transat",
    desc: "Choisissez votre mode de commande pour vos boissons et services de plage.",
    appTitle: "Application Mobile",
    appDesc: "Télécharger l'APK Android",
    webTitle: "Commander en ligne",
    webDesc: "Continuer directement sur le site",
    alertDL: "📥 Lancement du téléchargement de l'application SmartHotel (Transat {id})\n\n[Fichier : smarthotel_v1.apk]"
  },
  en: {
    welcome: "Welcome to Sunbed",
    desc: "Choose how you want to order your drinks and beach services.",
    appTitle: "Mobile App",
    appDesc: "Download the Android APK",
    webTitle: "Order Online",
    webDesc: "Continue directly on the website",
    alertDL: "📥 Starting SmartHotel app download (Sunbed {id})\n\n[File: smarthotel_v1.apk]"
  },
  es: {
    welcome: "Bienvenido a la Hamaca",
    desc: "Elija cómo desea pedir sus bebidas y servicios de playa.",
    appTitle: "Aplicación Móvil",
    appDesc: "Descargar el APK de Android",
    webTitle: "Pedir en línea",
    webDesc: "Continuar directamente en el sitio web",
    alertDL: "📥 Iniciando la descarga de la aplicación SmartHotel (Hamaca {id})\n\n[Archivo: smarthotel_v1.apk]"
  }
};

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Récupération de la langue actuelle et de la fonction pour la changer
  const { lang, setLang } = useLanguage(); 
  
  // Sécurisation : si la langue n'est pas reconnue, on force en français
  const currentLang = (lang === "en" || lang === "es") ? lang : "fr";
  const t = translations[currentLang];

  const transatId = searchParams.get("transat") || "0";

  const handleGoToWebsite = () => {
    router.push(`/?table=${transatId}`);
  };

  const handleDownloadAPK = () => {
    alert(t.alertDL.replace("{id}", transatId));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center relative"
    >
      {/* --- Sélecteur de langues --- */}
      <div className="absolute top-4 right-6 flex gap-2">
        <button onClick={() => setLang("fr")} className={`text-lg transition-transform ${currentLang === 'fr' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇫🇷</button>
        <button onClick={() => setLang("en")} className={`text-lg transition-transform ${currentLang === 'en' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇬🇧</button>
        <button onClick={() => setLang("es")} className={`text-lg transition-transform ${currentLang === 'es' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇪🇸</button>
      </div>

      {/* Logo */}
      <div className="w-24 h-24 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 p-2 mt-4">
        <Image 
          src="/images/logobarcelo.png" 
          alt="Logo Barceló Sevilla Renacimiento" 
          width={80} 
          height={80} 
          className="object-contain"
        />
      </div>

      <h1 className="font-serif text-3xl font-bold mb-2">Smart Hotel</h1>
      <p className="text-white/70 text-sm mb-6">
        {t.welcome} <span className="text-teal font-bold text-lg">#{transatId}</span>
      </p>

      <p className="text-white/80 text-sm mb-8">
        {t.desc}
      </p>

      <div className="space-y-4">
        {/* Bouton Application Mobile */}
        <button
          onClick={handleDownloadAPK}
          className="w-full flex items-center gap-4 p-4 bg-white text-navy-deep font-semibold rounded-2xl shadow-md hover:bg-white/90 active:scale-95 transition-all text-left border border-transparent"
        >
          <div className="p-3 bg-teal/10 rounded-xl text-teal">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold">{t.appTitle}</div>
            <div className="text-xs text-navy/60 font-normal">{t.appDesc}</div>
          </div>
        </button>

        {/* Bouton Site Web */}
        <button
          onClick={handleGoToWebsite}
          className="w-full flex items-center gap-4 p-4 bg-teal text-white font-semibold rounded-2xl shadow-md hover:bg-teal-light active:scale-95 transition-all text-left"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold">{t.webTitle}</div>
            <div className="text-xs text-white/80 font-normal">{t.webDesc}</div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// 2. Composant principal
export default function ScanRedirectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-deep to-navy flex flex-col items-center justify-center p-6 text-white font-sans">
      <Suspense fallback={<div className="text-white/70 animate-pulse">Chargement / Loading / Cargando...</div>}>
        <ScanContent />
      </Suspense>

      {/* Footer statique bilingue/trilingue implicite */}
      <p className="text-white/40 text-xs mt-8 font-light text-center">
        Réseau sécurisé SmartHotel • Secure Network<br/>
        Transat localisé via QR Code
      </p>
    </div>
  );
}