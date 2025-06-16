const express = require("express");
const router = express.Router();
const GenerateGroupsController = require("../controllers/GenerateGroupsController");
const { verifyToken } = require("../middlewares/auth");

// 🔐 Toutes les routes ici nécessitent une authentification
router.use(verifyToken);

// 🎲 Tirage automatique des groupes
router.post("/", GenerateGroupsController.generate);

module.exports = router;
