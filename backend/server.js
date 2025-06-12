const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./database");


// Middleware
app.use(express.json());

// Test de route simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le backend Simplon Group Generator V2 !" });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
