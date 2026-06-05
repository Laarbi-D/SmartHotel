const router = require("express").Router();
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

// GET /api/produits  – public (menu client)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ID_PRODUIT      AS id,
              LIBELLE_PRODUIT AS nom,
              PRIX_PRODUIT    AS prix,
              IMAGE_PRODUIT   AS image,
              BIO             AS bio,
              BIO_EN          AS bio_en,
              BIO_ES          AS bio_es,
              STOCK           AS stock,
              CATEGORIE       AS categorie,
              DISPONIBLE      AS disponible
       FROM produit ORDER BY LIBELLE_PRODUIT`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/produits  – admin (type 1)
router.post("/", authenticate, authorize(1), async (req, res) => {
  try {
    const { nom, bio, bio_en, bio_es, prix, stock, categorie, disponible, image } = req.body;
    if (!nom || prix == null)
      return res.status(400).json({ error: "nom et prix requis." });

    const [result] = await db.query(
      `INSERT INTO produit (LIBELLE_PRODUIT, BIO, BIO_EN, BIO_ES, PRIX_PRODUIT, STOCK, CATEGORIE, DISPONIBLE, IMAGE_PRODUIT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, bio || "", bio_en || "", bio_es || "", prix, stock || 0, categorie || null, disponible ? 1 : 0, image || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/produits/:id  – admin
router.patch("/:id", authenticate, authorize(1), async (req, res) => {
  try {
    const map = {
      nom:        "LIBELLE_PRODUIT",
      bio:        "BIO",
      bio_en:     "BIO_EN",
      bio_es:     "BIO_ES",
      prix:       "PRIX_PRODUIT",
      stock:      "STOCK",
      categorie:  "CATEGORIE",
      disponible: "DISPONIBLE",
      image:      "IMAGE_PRODUIT",
    };
    const updates = [], params = [];
    for (const [key, col] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        updates.push(`${col} = ?`);
        params.push(req.body[key]);
      }
    }
    if (!updates.length)
      return res.status(400).json({ error: "Aucun champ à modifier." });

    params.push(req.params.id);
    await db.query(`UPDATE produit SET ${updates.join(", ")} WHERE ID_PRODUIT = ?`, params);
    res.json({ message: "Produit mis à jour." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/produits/:id  – admin
router.delete("/:id", authenticate, authorize(1), async (req, res) => {
  try {
    await db.query("DELETE FROM produit WHERE ID_PRODUIT = ?", [req.params.id]);
    res.json({ message: "Produit supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;