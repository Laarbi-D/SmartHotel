"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { WaveDecoration } from "./WaveDecoration";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  
  const { login } = useAuth(); 
  const { t, lang, setLang } = useLanguage(); 

  // ASTUCE ANTICRASH : On force le typage "any" sur la partie authentification 
  // pour empêcher TypeScript de bloquer si un mot manque dans le dictionnaire
  const authT: any = t.auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !roomNumber.trim()) {
      setError(authT?.errorName || "Veuillez remplir tous les champs");
      setIsLoading(false);
      return; 
    }

    try {
      // CORRECTION ICI : On pointe vers la nouvelle route Node.js
      const response = await fetch('/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: name.trim(),
          chambre: roomNumber.trim(),
        }),
      });

      const textResponse = await response.text();
      let result;
      
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("Réponse du serveur non conforme :", textResponse);
        throw new Error(authT?.errorServer || "Erreur de connexion (Réponse invalide du serveur)");
      }

      if (response.ok && result.status === "success") {
        await login(name.trim(), roomNumber.trim());
      } else {
        setError(result.message || authT?.errorNotFound || "Identifiants incorrects");
      }
    } catch (err: any) {
      console.error("Erreur technique interceptée :", err);
      setError(err.message || authT?.errorServer || "Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      
      {/* Sélecteur de langues flottant */}
      <div className="absolute top-6 right-6 z-50 flex gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
        <button onClick={() => setLang("fr")} className={`text-xl transition-transform ${lang === 'fr' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇫🇷</button>
        <button onClick={() => setLang("en")} className={`text-xl transition-transform ${lang === 'en' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇬🇧</button>
        <button onClick={() => setLang("es")} className={`text-xl transition-transform ${lang === 'es' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇪🇸</button>
      </div>

      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury hotel"
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/50 to-navy-deep/70" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <WaveDecoration />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logobarcelo.png"
              alt="Barcelo"
              width={180}
              height={120}
              className="object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-navy-deep mb-2">
              {authT?.welcome || "Connexion"}
            </h1>
            <p className="text-navy/60 text-sm">
              {authT?.instruction || "Veuillez saisir vos informations"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                {authT?.labelName || "Nom"}
              </label>
              <input
                type="text"
                value={name}
                disabled={isLoading}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg outline-none disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                {authT?.labelRoom || "Numéro de chambre"}
              </label>
              <input
                type="text"
                value={roomNumber}
                disabled={isLoading}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder={authT?.placeholderRoom || "Ex: 102"}
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg outline-none disabled:opacity-50"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading} 
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg hover:bg-teal-light transition-all mt-6 disabled:bg-gray-400"
            >
              {isLoading ? (lang === 'en' ? 'Verifying...' : lang === 'es' ? 'Verificando...' : 'Vérification...') : (authT?.button || "Se connecter")}
            </motion.button>
          </form>

          <p className="text-center text-navy/50 text-xs mt-6">
            {authT?.assistance || "Besoin d'aide ? Contactez la réception."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}