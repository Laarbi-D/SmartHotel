const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Middlewares obligatoires pour Next.js
app.use(cors());
app.use(express.json()); // Permet de lire les body en JSON

// Configuration de la base de données (utilise ton conteneur MySQL)
const db = mysql.createPool({
  host: "mysql", // Nom de ton conteneur BDD dans docker-compose
  user: "root",
  password: "rootpassword",
  database: "smart_hotel_bdd",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==========================================
// 1. RÉCUPÉRER TOUTES LES COMMANDES
// ==========================================
app.get("/api/commandes", async (req, res) => {
  try {
    const { statut } = req.query;
    let sql = `
      SELECT
        c.ID_COMMANDE    AS id,
        c.DATE_COMMANDE  AS created_at,
        c.STATUT_COMMANDE AS statut,
        c.MONTANT_TOTAL  AS total,
        c.id_tables_transat AS table_id,
        cl.NOM_CLIENT    AS nom,
        cl.PRENOM_CLIENT AS prenom,
        cl.ID_CHAMBRE    AS chambre,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'produit',  p.LIBELLE_PRODUIT,
            'quantite', lc.QUANTITE_PRODUIT,
            'prix',     lc.PRIX_UNITAIRE
          )
        ) AS lignes
      FROM commande c
      JOIN client cl        ON cl.ID_CLIENT    = c.ID_CLIENT
      JOIN ligne_commande lc ON lc.ID_COMMANDE  = c.ID_COMMANDE
      JOIN produit p        ON p.ID_PRODUIT    = lc.ID_PRODUIT
    `;
    
    const params = [];
    if (statut) {
      sql += " WHERE c.STATUT_COMMANDE = ?";
      params.push(statut);
    }
    sql += " GROUP BY c.ID_COMMANDE ORDER BY c.DATE_COMMANDE DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// ==========================================
// 2. METTRE À JOUR LE STATUT
// ==========================================
app.patch("/api/commandes/:id/statut", async (req, res) => {
  try {
    const { statut } = req.body;
    const valides = ["en attente", "en preparation", "livree", "annulee"];
    
    if (!valides.includes(statut)) {
      return res.status(400).json({ status: "error", error: "Statut invalide." });
    }

    await db.query(
      "UPDATE commande SET STATUT_COMMANDE = ? WHERE ID_COMMANDE = ?",
      [statut, req.params.id]
    );
    res.json({ status: "success", message: "Statut mis à jour." });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// ==========================================
// 3. CRÉER UNE COMMANDE (POST)
// ==========================================
app.post("/api/commandes", async (req, res) => {
  try {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ status: "error", message: "JSON invalide ou vide" });
    }

    const sql = `
      INSERT INTO commande (
        ID_CLIENT, ID_EMPLOYE, id_tables_transat, 
        DATE_COMMANDE, STATUT_COMMANDE, DETAIL_COMMANDE, MONTANT_TOTAL
      ) VALUES (?, ?, ?, NOW(), 'en attente', ?, ?)
    `;
    
    const params = [
      data.ID_CLIENT || 1,
      data.ID_EMPLOYE || 1,
      data.id_tables_transat || 0,
      data.DETAIL_COMMANDE || 'Aucun détail',
      data.MONTANT_TOTAL || 0.00
    ];

    const [result] = await db.query(sql, params);
    res.json({ status: "success", message: "Commande enregistrée", insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ==========================================
// 4. CONNEXION CLIENT (LOGIN)
// ==========================================
app.post("/api/login", async (req, res) => {
  try {
    const { nom, chambre } = req.body;
    
    if (!nom || !chambre) {
      return res.status(400).json({ status: "error", message: "Données manquantes" });
    }

    const input = nom.trim().toLowerCase();
    const room = chambre.trim();

    const sql = `
      SELECT * FROM client 
      WHERE (
          LOWER(NOM_CLIENT) = ? 
          OR LOWER(PRENOM_CLIENT) = ?
          OR LOWER(CONCAT(PRENOM_CLIENT, ' ', NOM_CLIENT)) = ?
          OR LOWER(CONCAT(NOM_CLIENT, ' ', PRENOM_CLIENT)) = ?
      )
      AND ID_CHAMBRE = ?
    `;

    const [rows] = await db.query(sql, [input, input, input, input, room]);

    if (rows.length > 0) {
      res.json({ status: "success", user: rows[0] });
    } else {
      res.status(401).json({ status: "error", message: "Client introuvable" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ==========================================
// 5. RÉCUPÉRER UNE TABLE SPÉCIFIQUE
// ==========================================
app.get("/api/tables/:tableName", async (req, res) => {
  try {
    const table = req.params.tableName.toLowerCase();
    const allowedTables = [
      'capteur', 'chambre', 'client', 'commande', 'employe', 
      'espace', 'gerer', 'gerer_stock', 'ligne_commande', 
      'produit', 'tables_transat', 'type_capteur', 
      'type_employe', 'type_espace'
    ];

    if (!allowedTables.includes(table)) {
      return res.status(403).json({ status: "error", message: "Table inexistante" });
    }

    const [rows] = await db.query(`SELECT * FROM ${table}`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Lancement du serveur sur le port 80 (ou 3001 si tu préfères)
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`✅ API Node.js/Express lancée sur le port ${PORT}`);
});