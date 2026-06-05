const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis." });

    const [rows] = await db.query(
      `SELECT e.*, te.LIBELLE_TYPE_EMPLOYE AS type_label
       FROM employe e
       LEFT JOIN type_employe te ON te.ID_TYPE_EMPLOYE = e.ID_TYPE_EMPLOYE
       WHERE e.MAIL_EMPLOYE = ? LIMIT 1`,
      [email]
    );

    if (!rows.length)
      return res.status(401).json({ error: "Identifiants incorrects." });

    const employe = rows[0];

    let valid = false;
    const isHashed = employe.MOT_DE_PASSE_EMPLOYE.startsWith("$2");
    if (isHashed) {
      valid = await bcrypt.compare(password, employe.MOT_DE_PASSE_EMPLOYE);
    } else {
      valid = password === employe.MOT_DE_PASSE_EMPLOYE;
      if (valid) {
        const hash = await bcrypt.hash(password, 12);
        await db.query(
          "UPDATE employe SET MOT_DE_PASSE_EMPLOYE = ? WHERE ID_EMPLOYE = ?",
          [hash, employe.ID_EMPLOYE]
        );
      }
    }

    if (!valid)
      return res.status(401).json({ error: "Identifiants incorrects." });

    const token = jwt.sign(
      {
        id:     employe.ID_EMPLOYE,
        type:   employe.ID_TYPE_EMPLOYE,
        nom:    employe.NOM_EMPLOYE,
        prenom: employe.PRENOM_EMPLOYE,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      token,
      nom:    employe.NOM_EMPLOYE,
      prenom: employe.PRENOM_EMPLOYE,
      role:   employe.ID_TYPE_EMPLOYE === 1 ? "admin" : "serveur",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;