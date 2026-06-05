const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ⚠️ IMPORTANT pour lire temp= et hum= en POST
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

// 2. ROUTE LOGIN PERSONNEL
app.post("/api/login-staff", async (req, res) => {
    try {
        const { mail_employe, mdp_employe } = req.body;
        if (!mail_employe || !mdp_employe) return res.status(400).json({ status: "error", message: "Données manquantes" });

        const sql = "SELECT * FROM employe WHERE LOWER(MAIL_EMPLOYE) = ?";
        const [rows] = await db.query(sql, [mail_employe.trim().toLowerCase()]);

        if (rows.length > 0) {
            const employe = rows[0];
            const match = await bcrypt.compare(mdp_employe, employe.MOT_DE_PASSE_EMPLOYE);
            if (match) res.json({ status: "success", user: employe });
            else res.status(401).json({ status: "error", message: "Mot de passe incorrect" });
        } else {
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

// 4. ROUTE COMMANDES
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

// 5. ROUTE CAPTEUR AHT20 ✅
app.post(["/insert_mesure.php", "/backend/insert_mesure.php"], async (req, res) => {
    try {
        const temp = parseFloat(req.body.temp ?? req.query.temp);
        const hum  = parseFloat(req.body.hum  ?? req.query.hum);

        if (isNaN(temp) || isNaN(hum)) {
            return res.status(400).json({ status: "error", message: "temp et hum requis" });
        }

        await db.query(
            "INSERT INTO capteur (TYPE_CAPTEUR, MESURE, DATE_MESURE) VALUES (?, ?, NOW())",
            ['T', temp]
        );
        await db.query(
            "INSERT INTO capteur (TYPE_CAPTEUR, MESURE, DATE_MESURE) VALUES (?, ?, NOW())",
            ['H', hum]
        );

        const MAX_TEMP = 21.0, MIN_HUM = 30.0, MAX_HUM = 70.0;
        const alertTemp = temp > MAX_TEMP;
        const alertHum  = hum < MIN_HUM || hum > MAX_HUM;

        let telegram = 'non déclenché';

        if (alertTemp || alertHum) {
            const token  = process.env.TELEGRAM_BOT_TOKEN || '';
            const chatId = process.env.TELEGRAM_CHAT_ID  || '';

            if (token && chatId) {
                let message = "🚨 IoT SmartHotel:\n";
                message += alertTemp
                    ? `🔥 T°=${temp.toFixed(1)}°C >${MAX_TEMP}°C ⚠️\n`
                    : `🌡 T°=${temp.toFixed(1)}°C\n`;

                if      (hum < MIN_HUM) message += `💧 HR=${hum.toFixed(1)}% <${MIN_HUM}% ⚠️\n`;
                else if (hum > MAX_HUM) message += `💧 HR=${hum.toFixed(1)}% >${MAX_HUM}% ⚠️\n`;
                else                    message += `💧 HR=${hum.toFixed(1)}%\n`;

                message += `🕒 ${new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })}`;

                const params = new URLSearchParams({ chat_id: chatId, text: message });
                const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    body: params
                });
                telegram = r.ok ? 'ok' : 'erreur';
            }
        }

        res.json({
            status: 'success',
            message: 'Mesures enregistrées',
            data: { temp, hum, alert_temp: alertTemp, alert_hum: alertHum, telegram }
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.listen(80, () => {
    console.log("✅ API Finale avec support Portail Captif Personnel sécurisé !");
});