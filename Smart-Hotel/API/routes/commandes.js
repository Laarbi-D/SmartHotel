const router = require("express").Router();
const db = require("../db");
const { authenticate } = require("../middleware/auth"); // ✅ seul import nécessaire

// GET /api/commandes – toutes les commandes avec les détails
router.get("/", authenticate, async (req, res) => {
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
      JOIN client cl         ON cl.ID_CLIENT    = c.ID_CLIENT
      JOIN ligne_commande lc ON lc.ID_COMMANDE  = c.ID_COMMANDE
      JOIN produit p         ON p.ID_PRODUIT    = lc.ID_PRODUIT
    `;
    const params = [];
    if (statut) { sql += " WHERE c.STATUT_COMMANDE = ?"; params.push(statut); }
    sql += " GROUP BY c.ID_COMMANDE ORDER BY c.DATE_COMMANDE DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/commandes/:id/statut
router.patch("/:id/statut", authenticate, async (req, res) => {
  try {
    const { statut } = req.body;
    const valides = ["en attente", "en preparation", "livree", "annulee"];
    if (!valides.includes(statut))
      return res.status(400).json({ error: "Statut invalide." });

    await db.query(
      "UPDATE commande SET STATUT_COMMANDE = ? WHERE ID_COMMANDE = ?",
      [statut, req.params.id]
    );
    res.json({ message: "Statut mis à jour." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;