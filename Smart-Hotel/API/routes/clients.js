const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

// POST /api/clients/login  – login par chambre + nom de famille
router.post("/login", async (req, res) => {
  try {
    const { chambre, password } = req.body;
        console.log("LOGIN REÇU — chambre:", chambre, "| password:", password); // ← ajoute ici
    if (!chambre || !password)
      return res.status(400).json({ error: "Chambre et mot de passe requis." });

    const [rows] = await db.query(
      `SELECT * FROM client WHERE ID_CHAMBRE = ? LIMIT 1`,
      [chambre]
    );
        console.log("ROWS TROUVÉS:", rows.length, JSON.stringify(rows)); //
    if (!rows.length)
      return res.status(401).json({ error: "Identifiants incorrects." });

    const client = rows[0];

    const nomValide = client.NOM_CLIENT.toLowerCase() === password.toLowerCase();
    if (!nomValide)
      return res.status(401).json({ error: "Identifiants incorrects." });

    const token = jwt.sign(
      {
        id:      client.ID_CLIENT,
        chambre: client.ID_CHAMBRE,
        nom:     client.NOM_CLIENT,
        prenom:  client.PRENOM_CLIENT,
        role:    "client",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      id:      client.ID_CLIENT,
      nom:     client.NOM_CLIENT,
      prenom:  client.PRENOM_CLIENT,
      chambre: client.ID_CHAMBRE,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clients/menu  – public
router.get("/menu", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ID_PRODUIT AS id, LIBELLE_PRODUIT AS nom,
              PRIX_PRODUIT AS prix, IMAGE_PRODUIT AS image,
              BIO AS bio, BIO_EN AS bio_en, BIO_ES AS bio_es,
              STOCK AS stock, CATEGORIE AS categorie
       FROM produit
       WHERE DISPONIBLE = 1
       ORDER BY CATEGORIE, LIBELLE_PRODUIT`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients/order  – passer une commande (sans token)
router.post("/order", async (req, res) => {
  try {
    const { id_client, id_tables_transat, articles } = req.body;

    if (!id_client || !id_tables_transat || !articles || !articles.length)
      return res.status(400).json({ error: "id_client, id_tables_transat et articles requis." });

    // ✅ ids défini avant d'être utilisé
    const ids = articles.map(a => a.id);
    const placeholders = ids.map(() => "?").join(", ");
    const [produits] = await db.query(
      `SELECT ID_PRODUIT AS id, PRIX_PRODUIT AS prix, LIBELLE_PRODUIT AS nom
       FROM produit WHERE ID_PRODUIT IN (${placeholders})`,
      ids
    );

    const prixMap = {};
    produits.forEach(p => prixMap[p.id] = parseFloat(p.prix));

    let montant_total = 0;
    for (const article of articles) {
      if (!prixMap[article.id])
        return res.status(400).json({ error: `Produit id ${article.id} introuvable.` });
      montant_total += prixMap[article.id] * article.quantite;
    }

    const detail = articles
      .map(a => `${a.quantite}x ${produits.find(p => p.id === a.id).nom}`)
      .join(", ");

    const [result] = await db.query(
      `INSERT INTO commande (ID_CLIENT, ID_EMPLOYE, id_tables_transat, DATE_COMMANDE, STATUT_COMMANDE, MONTANT_TOTAL, DETAIL_COMMANDE)
       VALUES (?, 1, ?, NOW(), 'en attente', ?, ?)`,
      [id_client, id_tables_transat, montant_total.toFixed(2), detail]
    );

    const id_commande = result.insertId;

    for (const article of articles) {
      await db.query(
        `INSERT INTO ligne_commande (ID_PRODUIT, ID_COMMANDE, QUANTITE_PRODUIT, PRIX_UNITAIRE)
         VALUES (?, ?, ?, ?)`,
        [article.id, id_commande, article.quantite, prixMap[article.id]]
      );
    }

    res.status(201).json({
      id_commande,
      montant_total: parseFloat(montant_total.toFixed(2)),
      detail,
      statut: "en attente"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clients — liste tous les clients (admin + employé)
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT ID_CLIENT, NOM_CLIENT, PRENOM_CLIENT, ID_CHAMBRE, DATE_ARRIVEE, DATE_DEPART FROM CLIENT ORDER BY ID_CLIENT DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients — créer un client (admin uniquement)
router.post("/", authenticate, authorize(1), async (req, res) => {
  const { nom, prenom, chambre, date_arrivee, date_depart } = req.body;
  if (!nom || !prenom || !chambre) return res.status(400).json({ error: "Champs manquants." });
  try {
    const [result] = await db.query(
      "INSERT INTO CLIENT (NOM_CLIENT, PRENOM_CLIENT, ID_CHAMBRE, DATE_ARRIVEE, DATE_DEPART) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, chambre, date_arrivee || null, date_depart || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE /api/clients/:id — supprimer un client (admin uniquement)
router.delete("/:id", authenticate, authorize(1), async (req, res) => {
  try {
    await db.query("DELETE FROM CLIENT WHERE ID_CLIENT = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;