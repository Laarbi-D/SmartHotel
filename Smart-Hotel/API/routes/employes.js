const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth"); // je importe  les deux depuis middleware 

// GET /api/employes  – admin
router.get("/", authenticate, authorize(1), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.ID_EMPLOYE AS id, e.NOM_EMPLOYE AS nom, e.PRENOM_EMPLOYE AS prenom,
              e.MAIL_EMPLOYE AS email, e.ID_TYPE_EMPLOYE AS type,
              te.LIBELLE_TYPE_EMPLOYE AS role
       FROM employe e
       LEFT JOIN type_employe te ON te.ID_TYPE_EMPLOYE = e.ID_TYPE_EMPLOYE
       ORDER BY e.ID_EMPLOYE DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/employes  – admin
router.post("/", authenticate, authorize(1), async (req, res) => {
  try {
    const { nom, prenom, email, password, type } = req.body;
    if (!nom || !prenom || !email || !password)
      return res.status(400).json({ error: "Tous les champs sont requis." });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      `INSERT INTO employe (ID_ESPACE, ID_TYPE_EMPLOYE, NOM_EMPLOYE, PRENOM_EMPLOYE, MAIL_EMPLOYE, MOT_DE_PASSE_EMPLOYE)
       VALUES (1, ?, ?, ?, ?, ?)`,
      [type || 2, nom, prenom, email, hash]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/employes/:id  – admin
router.delete("/:id", authenticate, authorize(1), async (req, res) => {
  try {
    await db.query("DELETE FROM employe WHERE ID_EMPLOYE = ?", [req.params.id]);
    res.json({ message: "Employé supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;