const express = require("express");
const router = express.Router();
const PersonController = require("../controllers/PersonController");
const { verifyToken } = require("../middlewares/auth");

// ✅ Protéger toutes les routes par un token
router.use(verifyToken);

// 🔍 Récupérer toutes les personnes d’une liste
router.get("/:listId", PersonController.getAllByListId);

// ✅ Ajouter une personne
router.post("/", PersonController.createPerson);

// ✏️ Modifier une personne
router.put("/:id", PersonController.updatePerson);

// ❌ Supprimer une personne
router.delete("/:id", PersonController.deletePerson);

module.exports = router;
