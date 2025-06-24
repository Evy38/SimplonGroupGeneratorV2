const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

// Base de données
const db = require("./database");

// Importation des routes centralisées
const routes = require("./routes");

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Toutes les routes passent par /api
app.use("/api", routes);
app.use("/api/users", userRoutes); 
// Test simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le backend Simplon Group Generator V2 !" });
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
