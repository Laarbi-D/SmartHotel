"use client"; // Indique à Next.js que ce composant s'exécute côté client (navigateur) à cause de l'utilisation des hooks d'état.

// --- 1. IMPORTATION DES BIBLIOTHÈQUES ---
import React, { useState } from "react";
import { motion } from "framer-motion"; // Utilisé pour les animations fluides de l'interface
import Image from "next/image"; // Composant Next.js optimisé pour le rendu des images
import { useAuth } from "@/lib/auth-context"; // Contexte personnalisé gérant la session utilisateur
import { useLanguage } from "@/lib/language-context"; // Contexte personnalisé gérant le multi-langue
import { WaveDecoration } from "./WaveDecoration"; // Composant décoratif (vagues)

// --- 2. DÉCLARATION DU COMPOSANT PRINCIPAL ---
export function LoginScreen() {
  // Initialisation des états locaux pour gérer les données du formulaire et l'UI
  const [name, setName] = useState(""); // Stocke le nom saisi par l'utilisateur
  const [roomNumber, setRoomNumber] = useState(""); // Stocke le numéro de chambre saisi
  const [error, setError] = useState(""); // Gère l'affichage des messages d'erreur
  const [isLoading, setIsLoading] = useState(false); // Permet de bloquer l'UI pendant l'appel à l'API
  
  // Récupération des fonctions et variables depuis les contextes globaux
  const { login } = useAuth(); 
  const { t, lang, setLang } = useLanguage(); 

  // ASTUCE ANTICRASH : On force le typage "any" sur la partie authentification 
  // pour empêcher TypeScript de bloquer la compilation si un mot manque dans le dictionnaire de traduction
  const authT: any = t.auth;

  // --- 3. SOUMISSION DU FORMULAIRE ---
  // Fonction déclenchée lors du clic sur le bouton de connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // On empêche le rechargement classique de la page web
    setError(""); // On réinitialise les erreurs précédentes
    setIsLoading(true); // On active l'état de chargement

    // Vérification de sécurité côté frontend : on s'assure qu'aucun champ n'est vide
    if (!name.trim() || !roomNumber.trim()) {
      setError(authT?.errorName || "Veuillez remplir tous les champs");
      setIsLoading(false);
      return; 
    }

    try {
      // CORRECTION ICI : On pointe directement vers la nouvelle route Node.js du backend
      const response = await fetch('/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // On précise qu'on envoie des données au format JSON
        },
        body: JSON.stringify({
          nom: name.trim(),
          chambre: roomNumber.trim(),
        }),
      });

      // On récupère la réponse brute sous forme de texte d'abord
      const textResponse = await response.text();
      let result;
      
      // Sécurité anticrash : on parse le JSON manuellement. Si le serveur plante et renvoie du HTML,
      // on attrape l'erreur ici au lieu de faire crasher toute l'application React.
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("Réponse du serveur non conforme :", textResponse);
        throw new Error(authT?.errorServer || "Erreur de connexion (Réponse invalide du serveur)");
      }

      // Si l'API renvoie un statut 200 (OK) et que les identifiants sont bons :
      if (response.ok && result.status === "success") {
        await login(name.trim(), roomNumber.trim()); // On valide la session dans le contexte global
      } else {
        // Sinon, on affiche le message d'erreur généré par l'API MySQL/Node
        setError(result.message || authT?.errorNotFound || "Identifiants incorrects");
      }
    } catch (err: any) {
      // Capture des erreurs de réseau (ex: serveur éteint ou inaccessible)
      console.error("Erreur technique interceptée :", err);
      setError(err.message || authT?.errorServer || "Erreur de connexion au serveur.");
    } finally {
      // Quoi qu'il arrive, on désactive l'état de chargement à la fin du processus
      setIsLoading(false);
    }
  };

  // --- 4. RENDU DE L'INTERFACE (JSX) ---
  return (
    // Conteneur principal plein écran avec gestion du fond
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      
      {/* Sélecteur de langues flottant positionné en haut à droite */}
      <div className="absolute top-6 right-6 z-50 flex gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
        {/* On applique un effet de zoom (scale) sur le drapeau de la langue actuellement sélectionnée */}
        <button onClick={() => setLang("fr")} className={`text-xl transition-transform ${lang === 'fr' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇫🇷</button>
        <button onClick={() => setLang("en")} className={`text-xl transition-transform ${lang === 'en' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇬🇧</button>
        <button onClick={() => setLang("es")} className={`text-xl transition-transform ${lang === 'es' ? 'scale-125 opacity-100' : 'opacity-50 hover:opacity-100'}`}>🇪🇸</button>
      </div>

      {/* Affichage de l'image de fond avec un dégradé assombrissant pour la lisibilité */}
      <div className="absolute inset-0">
        <Image
          src="/images/imagehotel.png"
          alt="Luxury hotel"
          fill 
          className="object-cover" 
          priority // Force le chargement prioritaire de cette image pour les performances
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/50 to-navy-deep/70" />
      </div>

      {/* Intégration du composant décoratif SVG en bas de l'écran */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <WaveDecoration />
      </div>

      {/* Conteneur du formulaire animé avec Framer Motion (apparition fluide par le bas) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Boîte centrale avec effet Glassmorphism (flou d'arrière-plan) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          
          {/* Logo de l'établissement */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logobarcelo.png"
              alt="Barcelo"
              width={180}
              height={120}
              className="object-contain"
            />
          </div>

          {/* En-tête textuel traduit dynamiquement */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-navy-deep mb-2">
              {authT?.welcome || "Connexion"}
            </h1>
            <p className="text-navy/60 text-sm">
              {authT?.instruction || "Veuillez saisir vos informations"}
            </p>
          </div>

          {/* Formulaire liant la fonction handleSubmit à la validation */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Champ : Nom */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy/60 uppercase tracking-wider">
                {authT?.labelName || "Nom"}
              </label>
              <input
                type="text"
                value={name} // Liaison à l'état React
                disabled={isLoading} // Verrouillage du champ si une requête est en cours
                onChange={(e) => setName(e.target.value)} // Mise à jour de l'état à chaque frappe
                placeholder="Prénom Nom"
                className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-navy-deep focus:ring-2 focus:ring-teal/50 transition-all text-lg outline-none disabled:opacity-50"
              />
            </div>

            {/* Champ : Numéro de chambre */}
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

            {/* Affichage conditionnel de la bulle d'erreur réseau ou identifiants */}
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100"
              >
                {error}
              </motion.p>
            )}

            {/* Bouton de validation avec effets physiques au clic/survol */}
            <motion.button
              type="submit"
              disabled={isLoading} // Désactivation logicielle et visuelle du bouton pendant l'appel API
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-4 bg-teal text-white font-medium rounded-full text-lg shadow-lg hover:bg-teal-light transition-all mt-6 disabled:bg-gray-400"
            >
              {/* Le texte bascule sur "Vérification..." (selon la langue) si une requête est en cours */}
              {isLoading ? (lang === 'en' ? 'Verifying...' : lang === 'es' ? 'Verificando...' : 'Vérification...') : (authT?.button || "Se connecter")}
            </motion.button>
          </form>

          {/* Pied de page */}
          <p className="text-center text-navy/50 text-xs mt-6">
            {authT?.assistance || "Besoin d'aide ? Contactez la réception."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}