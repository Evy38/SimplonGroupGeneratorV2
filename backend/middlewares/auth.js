const jwt = require("jsonwebtoken");

// 🛡 Middleware qui vérifie que l’utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next(); // Continue si c'est un admin
};

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

module.exports = { verifyToken, isAdmin };
