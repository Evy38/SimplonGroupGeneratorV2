const jwt = require("jsonwebtoken");

// 🔐 Middleware qui vérifie la présence d’un token valide
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie si le header Authorization est présent
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Vérifie la validité du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On attache l'utilisateur décodé à la requête
    next(); // Passe au middleware suivant
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ error: "Token invalide" });
  }
};

// 🛡 Middleware qui vérifie que l’utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next(); // Continue si c'est un admin
};

module.exports = { verifyToken, isAdmin };
