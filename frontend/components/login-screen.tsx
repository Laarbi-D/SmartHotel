"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { WaveDecoration } from "./wave-decoration";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !roomNumber.trim()) {
      setError(t.auth.errorName || "Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      /**
       * CORRECTION MAJEURE : 
       * On utilise notre fichier centralisé /backend/api.php avec ?action=login
       */
      const response = await fetch('/backend/api.php?action=login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: name.trim(),
          chambre: roomNumber.trim(),
        }),
      });

      // Gestion d'erreur renforcée (évite le crash "Unexpected token '<'")
      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("Réponse du serveur :", textResponse);
        throw new Error("Erreur de connexion (Réponse invalide du serveur)");
      }

      if (response.ok && result.status === "success") {
        await login(name.trim(), roomNumber.trim());
      } else {
        setError(result.message || t.auth.errorNotFound);
      }
    } catch (err: any) {
      console.error("Erreur technique :", err);
      setError(err.message || t.auth.errorServer || "Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
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
              {t.auth.welcome}
            </h1>
            <p className="text-navy/60 text-sm">
              {t.auth.instruction}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                {t.auth.labelName}
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
                {t.auth.labelRoom}
              </label>
              <input
                type="text"
                value={roomNumber}
                disabled={isLoading}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder={t.auth.placeholderRoom}
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
              {isLoading ? "Vérification..." : t.auth.button}
            </motion.button>
          </form>

          <p className="text-center text-navy/50 text-xs mt-6">
            {t.auth.assistance}
          </p>
        </div>
      </motion.div>
    </div>
  );
}