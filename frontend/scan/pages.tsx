"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Globe, Compass } from "lucide-react";

export default function ScanRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Récupération du numéro de transat depuis l'URL (?transat=X)
  const transatId = searchParams.get("transat") || "0";

  // Action 1 : Redirection vers le site web en transmettant le numéro du transat
  const handleGoToWebsite = () => {
    // On redirige vers la page d'accueil avec le paramètre ?table=X attendu par ton CartDrawer
    router.push(`/?table=${transatId}`);
  };

  // Action 2 : Téléchargement de l'APK (Placeholder pour ton projet)
  const handleDownloadAPK = () => {
    alert(`📥 Lancement du téléchargement de l'application SmartHotel (Transat ${transatId})\n\n[Fichier : smarthotel_v1.apk]`);
    // Plus tard, tu pourras faire : window.location.href = "/downloads/app.apk";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-deep to-navy flex flex-col items-center justify-center p-6 text-white font-sans">
      
      {/* Conteneur Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center"
      >
        {/* Logo / Icône de l'Hôtel */}
        <div className="w-20 h-20 bg-teal rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6">
          <Compass className="w-10 h-10 text-white animate-pulse" />
        </div>

        <h1 className="font-serif text-3xl font-bold mb-2">Smart Hotel</h1>
        <p className="text-white/70 text-sm mb-6">
          Bienvenue au Transat <span className="text-teal font-bold text-lg">#{transatId}</span>
        </p>

        <p className="text-white/80 text-sm mb-8">
          Choisissez votre mode de commande pour vos boissons et services de plage.
        </p>

        {/* Espace Boutons */}
        <div className="space-y-4">
          
          {/* OPTION 1 : APPLICATION MOBILE */}
          <button
            onClick={handleDownloadAPK}
            className="w-full flex items-center gap-4 p-4 bg-white text-navy-deep font-semibold rounded-2xl shadow-md hover:bg-white/90 active:scale-95 transition-all text-left border border-transparent"
          >
            <div className="p-3 bg-teal/10 rounded-xl text-teal">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold">Application Mobile</div>
              <div className="text-xs text-navy/60 font-normal">Télécharger l'APK Android</div>
            </div>
          </button>

          {/* OPTION 2 : SITE INTERNET (WEB APP) */}
          <button
            onClick={handleGoToWebsite}
            className="w-full flex items-center gap-4 p-4 bg-teal text-white font-semibold rounded-2xl shadow-md hover:bg-teal-light active:scale-95 transition-all text-left"
          >
            <div className="p-3 bg-white/20 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold">Commander en ligne</div>
              <div className="text-xs text-white/80 font-normal">Continuer directement sur le site</div>
            </div>
          </button>

        </div>
      </motion.div>

      {/* Footer Sécurisé de l'établissement */}
      <p className="text-white/40 text-xs mt-8 font-light">
        Réseau sécurisé SmartHotel • Transat localisé via QR Code
      </p>
    </div>
  );
}