// --- IMPORTATION DES MODULES ---
const express = require('express');         // Framework principal pour créer le serveur web et l'API REST
const mysql = require('mysql2/promise');    // Pilote MySQL permettant d'utiliser "await" (promesses) pour les requêtes asynchrones
const cors = require('cors');               // Middleware pour autoriser les requêtes cross-origin (depuis un autre domaine/port)
const bcrypt = require('bcryptjs');         // Bibliothèque pour hacher et vérifier les mots de passe de manière sécurisée (recommandation ANSSI)

// --- INITIALISATION DE L'APPLICATION ---
const app = express();
app.use(express.json());                    // Middleware pour que l'API puisse lire les corps de requêtes au format JSON
app.use(express.urlencoded({ extended: true })); // ⚠️ IMPORTANT : permet de lire les données envoyées depuis des formulaires (ex: temp=20&hum=50 en POST)
app.use(cors());                            // Active le CORS pour éviter les blocages réseau entre le frontend et le backend

// --- CONFIGURATION DE LA BASE DE DONNÉES ---
// Création d'un pool de connexions (plus performant qu'une connexion unique, gère plusieurs requêtes en même temps)
const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',   // Adresse du serveur BDD (récupérée des variables d'environnement Docker, ou 'mysql' par défaut)
    user: process.env.DB_USER || 'root',    // Nom d'utilisateur de la base de données
    password: process.env.DB_PASS || 'rootpassword', // Mot de passe de la base de données
    database: process.env.DB_NAME || 'smart_hotel_bdd' // Nom de la base de données à utiliser
});

// --- 1. ROUTE LOGIN CLIENTS ---
app.post("/api/login", async (req, res) => {
    try {
        const { nom, chambre } = req.body;  // Extraction du nom et du numéro de chambre envoyés par le frontend
        if (!nom || !chambre) return res.status(400).json({ status: "error", message: "Données manquantes" }); // Vérification de la présence des champs

        const input = nom.trim().toLowerCase(); // Nettoyage de la saisie (retrait des espaces et passage en minuscules pour éviter la casse)
        
        // Requête SQL pour trouver le client selon son nom/prénom (ou les deux) ET son numéro de chambre
        const sql = `
            SELECT * FROM client 
            WHERE (LOWER(NOM_CLIENT) = ? OR LOWER(PRENOM_CLIENT) = ? OR LOWER(CONCAT(PRENOM_CLIENT, ' ', NOM_CLIENT)) = ? OR LOWER(CONCAT(NOM_CLIENT, ' ', PRENOM_CLIENT)) = ?)
            AND ID_CHAMBRE = ?
        `;
        const [rows] = await db.query(sql, [input, input, input, input, chambre.trim()]); // Exécution de la requête avec les paramètres sécurisés

        if (rows.length > 0) res.json({ status: "success", user: rows[0] }); // Si un client correspond, on renvoie ses données
        else res.status(401).json({ status: "error", message: "Client introuvable" }); // Sinon, erreur 401 (Non autorisé)
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message }); // En cas de crash du code ou de la BDD, on renvoie une erreur 500
    }
});

// --- 2. ROUTE LOGIN PERSONNEL ---
app.post("/api/login-staff", async (req, res) => {
    try {
        const { mail_employe, mdp_employe } = req.body; // Récupération de l'email et du mot de passe en clair
        if (!mail_employe || !mdp_employe) return res.status(400).json({ status: "error", message: "Données manquantes" });

        const sql = "SELECT * FROM employe WHERE LOWER(MAIL_EMPLOYE) = ?"; // Recherche de l'employé par son adresse email
        const [rows] = await db.query(sql, [mail_employe.trim().toLowerCase()]);

        if (rows.length > 0) {
            const employe = rows[0]; // Stockage des données de l'employé trouvé
            // Comparaison sécurisée entre le mot de passe tapé et le hash Bcrypt stocké en base
            const match = await bcrypt.compare(mdp_employe, employe.MOT_DE_PASSE_EMPLOYE);
            
            if (match) res.json({ status: "success", user: employe }); // Si ça correspond, la connexion est acceptée
            else res.status(401).json({ status: "error", message: "Mot de passe incorrect" });
        } else {
            res.status(401).json({ status: "error", message: "Employé introuvable" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// --- 3. ROUTE BOISSONS / PRODUITS ---
// Cette route répond à 4 chemins différents (pour assurer la compatibilité avec l'ancien code PHP et le nouveau Next.js)
app.get(["/api/produits", "/api/tables/produit", "/api/produit", "/backend/api.php"], async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM produit"); // Récupère tous les produits du catalogue
        res.json(rows); // Renvoie les données au format JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. ROUTE COMMANDES ---
app.post("/api/commandes", async (req, res) => {
    try {
        const { ID_CLIENT, ID_EMPLOYE, id_tables_transat, DETAIL_COMMANDE, MONTANT_TOTAL } = req.body; // Récupération du panier
        
        // Génération de la date et heure locale française au format compatible MySQL (YYYY-MM-DD HH:mm:ss)
        const dateFr = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Paris" }); 

        const sql = `
            INSERT INTO commande 
            (ID_CLIENT, ID_EMPLOYE, id_tables_transat, DETAIL_COMMANDE, MONTANT_TOTAL, STATUT_COMMANDE, DATE_COMMANDE) 
            VALUES (?, ?, ?, ?, ?, 'en attente', ?)
        `;
        // Exécution de l'insertion. Si ID_CLIENT ou ID_EMPLOYE manquent, on met "1" par défaut, idem pour le transat (0)
        const [result] = await db.query(sql, [
            ID_CLIENT || 1,
            ID_EMPLOYE || 1,
            id_tables_transat || 0,
            DETAIL_COMMANDE,
            MONTANT_TOTAL,
            dateFr
        ]);

        res.json({ status: "success", id: result.insertId }); // Retourne l'ID de la nouvelle commande insérée
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// --- 5. ROUTE CAPTEUR AHT20 (IoT) ✅ ---
// Accepte les requêtes sur les anciennes URL PHP pour que les capteurs physiques n'aient pas besoin d'être reprogrammés
app.post(["/insert_mesure.php", "/backend/insert_mesure.php"], async (req, res) => {
    try {
        // Tente de récupérer les valeurs dans le corps (POST) ou l'URL (GET/Query), puis les convertit en nombres décimaux
        const temp = parseFloat(req.body.temp ?? req.query.temp);
        const hum  = parseFloat(req.body.hum  ?? req.query.hum);

        // Si la conversion échoue (valeur manquante ou texte au lieu de chiffres), on rejette la requête
        if (isNaN(temp) || isNaN(hum)) {
            return res.status(400).json({ status: "error", message: "temp et hum requis" });
        }

        // Insertion de la température ('T') en base de données avec la fonction SQL NOW() pour l'heure
        await db.query(
            "INSERT INTO capteur (TYPE_CAPTEUR, MESURE, DATE_MESURE) VALUES (?, ?, NOW())",
            ['T', temp]
        );
        // Insertion de l'humidité ('H') en base de données
        await db.query(
            "INSERT INTO capteur (TYPE_CAPTEUR, MESURE, DATE_MESURE) VALUES (?, ?, NOW())",
            ['H', hum]
        );

        // --- GESTION DES ALERTES ---
        const MAX_TEMP = 21.0, MIN_HUM = 30.0, MAX_HUM = 70.0; // Définition des seuils critiques
        const alertTemp = temp > MAX_TEMP; // Booléen : vrai si la température est trop haute
        const alertHum  = hum < MIN_HUM || hum > MAX_HUM; // Booléen : vrai si l'humidité est hors limite

        let telegram = 'non déclenché'; // Statut par défaut de l'envoi du message Telegram

        // Si une des limites est franchie, on déclenche l'envoi Telegram
        if (alertTemp || alertHum) {
            const token  = process.env.TELEGRAM_BOT_TOKEN || ''; // Clé API du bot
            const chatId = process.env.TELEGRAM_CHAT_ID  || '';  // ID du groupe/chat de destination

            if (token && chatId) {
                let message = "🚨 IoT SmartHotel:\n";
                
                // Formatage dynamique du message pour la température
                message += alertTemp
                    ? `🔥 T°=${temp.toFixed(1)}°C >${MAX_TEMP}°C ⚠️\n`
                    : `🌡 T°=${temp.toFixed(1)}°C\n`;

                // Formatage dynamique du message pour l'humidité
                if      (hum < MIN_HUM) message += `💧 HR=${hum.toFixed(1)}% <${MIN_HUM}% ⚠️\n`;
                else if (hum > MAX_HUM) message += `💧 HR=${hum.toFixed(1)}% >${MAX_HUM}% ⚠️\n`;
                else                    message += `💧 HR=${hum.toFixed(1)}%\n`;

                // Ajout de l'horodatage français à la fin du message
                message += `🕒 ${new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })}`;

                // Préparation des paramètres pour l'API Telegram
                const params = new URLSearchParams({ chat_id: chatId, text: message });
                
                // Appel HTTP vers les serveurs de Telegram
                const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    body: params
                });
                
                // Mise à jour du statut selon la réponse de Telegram
                telegram = r.ok ? 'ok' : 'erreur';
            }
        }

        // On renvoie un récapitulatif détaillé au capteur (ou à l'outil de debug)
        res.json({
            status: 'success',
            message: 'Mesures enregistrées',
            data: { temp, hum, alert_temp: alertTemp, alert_hum: alertHum, telegram }
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// --- DÉMARRAGE DU SERVEUR ---
// L'API écoute le trafic sur le port 80 (qui est ensuite géré et redirigé par Nginx dans ton infrastructure Docker)
app.listen(80, () => {
    console.log("✅ API Finale avec support Portail Captif Personnel sécurisé !");
});