const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // <-- Importation de bcrypt pour les mots de passe

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'rootpassword',
    database: process.env.DB_NAME || 'smart_hotel_bdd'
});

// 1. ROUTE LOGIN CLIENTS
app.post("/api/login", async (req, res) => {
    try {
        const { nom, chambre } = req.body;
        if (!nom || !chambre) return res.status(400).json({ status: "error", message: "Données manquantes" });

        const input = nom.trim().toLowerCase();
        const sql = `
            SELECT * FROM client 
            WHERE (LOWER(NOM_CLIENT) = ? OR LOWER(PRENOM_CLIENT) = ? OR LOWER(CONCAT(PRENOM_CLIENT, ' ', NOM_CLIENT)) = ? OR LOWER(CONCAT(NOM_CLIENT, ' ', PRENOM_CLIENT)) = ?)
            AND ID_CHAMBRE = ?
        `;
        const [rows] = await db.query(sql, [input, input, input, input, chambre.trim()]);

        if (rows.length > 0) res.json({ status: "success", user: rows[0] });
        else res.status(401).json({ status: "error", message: "Client introuvable" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 2. ROUTE LOGIN PERSONNEL (Email + Mot de passe sécurisé)
app.post("/api/login-staff", async (req, res) => {
    try {
        // On récupère le mail et le mot de passe depuis le frontend
        const { mail_employe, mdp_employe } = req.body;
        if (!mail_employe || !mdp_employe) return res.status(400).json({ status: "error", message: "Données manquantes" });

        // 1. On cherche d'abord l'employé avec son adresse e-mail
        const sql = "SELECT * FROM employe WHERE LOWER(MAIL_EMPLOYE) = ?";
        const [rows] = await db.query(sql, [mail_employe.trim().toLowerCase()]);

        if (rows.length > 0) {
            const employe = rows[0];
            
            // 2. On compare le mot de passe fourni avec le hash stocké en BDD
            const match = await bcrypt.compare(mdp_employe, employe.MOT_DE_PASSE_EMPLOYE);
            
            if (match) {
                // Le mot de passe correspond !
                res.json({ status: "success", user: employe });
            } else {
                // Le mot de passe est faux
                res.status(401).json({ status: "error", message: "Mot de passe incorrect" });
            }
        } else {
            // L'adresse e-mail n'existe pas
            res.status(401).json({ status: "error", message: "Employé introuvable" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 3. ROUTE BOISSONS
app.get(["/api/produits", "/api/tables/produit", "/api/produit", "/backend/api.php"], async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM produit");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ROUTE COMMANDES (Heure de Paris)
app.post("/api/commandes", async (req, res) => {
    try {
        const { ID_CLIENT, ID_EMPLOYE, id_tables_transat, DETAIL_COMMANDE, MONTANT_TOTAL } = req.body;
        
        const dateFr = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Paris" });

        const sql = `
            INSERT INTO commande 
            (ID_CLIENT, ID_EMPLOYE, id_tables_transat, DETAIL_COMMANDE, MONTANT_TOTAL, STATUT_COMMANDE, DATE_COMMANDE) 
            VALUES (?, ?, ?, ?, ?, 'en attente', ?)
        `;
        
        const [result] = await db.query(sql, [
            ID_CLIENT || 1, 
            ID_EMPLOYE || 1, 
            id_tables_transat || 0, 
            DETAIL_COMMANDE, 
            MONTANT_TOTAL,
            dateFr
        ]);

        res.json({ status: "success", id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.listen(80, () => {
    console.log("✅ API Finale avec support Portail Captif Personnel sécurisé !");
});