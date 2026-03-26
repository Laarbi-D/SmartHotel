"use client";

import React from "react"
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { WaveDecoration } from "./wave-decoration";

export function LoginScreen() {
  // --- ÉTATS POUR LE FORMULAIRE ---
  const [name, setName] = useState(""); // Stocke le nom saisi
  const [roomNumber, setRoomNumber] = useState(""); // Stocke le numéro de chambre saisi
  const [error, setError] = useState(""); // Gère l'affichage des messages d'erreur
  const { login } = useAuth(); // Récupère la fonction de connexion du contexte Auth

  // --- LOGIQUE DE CONNEXION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise l'erreur

    // Validation simple des champs vides
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomNumber.trim()) {
      setError("Please enter your room number");
      return;
    }

    try {
      /**
       * CONNEXION À LA BDD VIA L'API PHP
       * On envoie le nom et la chambre à notre script PHP pour vérification.
       */
      const response = await fetch(`http://192.168.112.158:8080/api.php?table=UTILISATEUR`);
      const users = await response.json();

      // On cherche dans la liste si un utilisateur correspond aux saisies
      const userFound = users.find(
        (u: any) => 
          u.NOM.toLowerCase() === name.trim().toLowerCase() && 
          u.NUMERO_CHAMBRE.toString() === roomNumber.trim()
      );

      if (userFound) {
        // Si trouvé, on connecte l'utilisateur
        login(name.trim(), roomNumber.trim());
      } else {
        // Sinon, on affiche une erreur
        setError("Guest not found. Please check your details.");
      }
    } catch (err) {
      console.error("Database connection error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* IMAGE DE FOND (LUXE HOTEL) */}
      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury poolside at sunset"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay dégradé pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/50 to-navy-deep/70" />
      </div>

      {/* DÉCORATION VAGUES ANIMÉES */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <WaveDecoration />
      </div>

      {/* CARTE DE CONNEXION AVEC ANIMATION D'ENTRÉE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          
          {/* LOGO BARCELO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/images/logobarcelo.png"
              alt="Barceló Sevilla Renacimiento"
              width={180}
              height={120}
              className="object-contain"
            />
          </motion.div>

          {/* TITRE ET TEXTE D'ACCUEIL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl text-navy-deep mb-2">Welcome</h1>
            <p className="text-navy/60 text-sm">Sign in to order drinks from your sunbed</p>
          </motion.div>

          {/* FORMULAIRE DE SAISIE */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* CHAMP NOM DU CLIENT */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                Guest Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg"
                autoComplete="name"
              />
            </div>

            {/* CHAMP NUMÉRO DE CHAMBRE (Connecté à NUMERO_CHAMBRE BDD) */}
            <div className="space-y-2">
              <label htmlFor="room" className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                Room Number
              </label>
              <input
                id="room"
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 301"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg"
                autoComplete="off"
              />
            </div>

            {/* MESSAGE D'ERREUR DYNAMIQUE */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
                {error}
              </motion.p>
            )}

            {/* BOUTON DE VALIDATION */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg hover:bg-teal-light transition-all mt-6"
            >
              Continue
            </motion.button>
          </motion.form>

          {/* LIEN D'ASSISTANCE */}
          <motion.p className="text-center text-navy/50 text-xs mt-6">
            Need assistance? Contact the front desk
          </motion.p>
        </div>

        {/* ÉTOILES DE STANDING (5 STARS) */}
        <motion.div className="flex items-center justify-center gap-1 mt-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-3 h-3 text-copper" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}