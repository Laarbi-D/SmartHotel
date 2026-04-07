"use client";

import React from "react"
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context"; // Import du context
import { WaveDecoration } from "./wave-decoration";

export function LoginScreen() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t } = useLanguage(); // Récupération des traductions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation avec messages traduits
    if (!name.trim()) {
      setError(t.auth.errorName);
      return;
    }

    if (!roomNumber.trim()) {
      setError(t.auth.errorRoom);
      return;
    }

    try {
      const response = await fetch(`http://192.168.112.158:8080/api.php?table=UTILISATEUR`);
      const users = await response.json();

      const userFound = users.find(
        (u: any) => 
          u.NOM.toLowerCase() === name.trim().toLowerCase() && 
          u.NUMERO_CHAMBRE.toString() === roomNumber.trim()
      );

      if (userFound) {
        login(name.trim(), roomNumber.trim());
      } else {
        setError(t.auth.errorNotFound);
      }
    } catch (err) {
      console.error("Database connection error:", err);
      setError(t.auth.errorServer);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury poolside"
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
          
          <motion.div className="flex justify-center mb-8">
            <Image
              src="/images/logobarcelo.png"
              alt="Logo"
              width={180}
              height={120}
              className="object-contain"
            />
          </motion.div>

          {/* TEXTES TRADUITS */}
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
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.placeholderName}
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                {t.auth.labelRoom}
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder={t.auth.placeholderRoom}
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg outline-none"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg hover:bg-teal-light transition-all mt-6"
            >
              {t.auth.button}
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