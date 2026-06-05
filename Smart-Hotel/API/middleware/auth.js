

const jwt = require("jsonwebtoken");

// Middleware d'authentification pour vérifier le token JWT //
function authenticate(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Token manquant." });

  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
}


//middlware d'autorisation pour les rôles (Admin, Serveur..) //


function authorize(...types) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Non authentifié." });
    if (!types.map(Number).includes(Number(req.user.type)))
      return res.status(403).json({ error: "Accès refusé." });
    next();
  };
}

module.exports = { authenticate, authorize };

