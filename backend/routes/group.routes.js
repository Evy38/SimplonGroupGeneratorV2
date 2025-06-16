const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");
const { verifyToken } = require("../middlewares/auth");

// ✅ Protéger toutes les routes avec un token
router.use(verifyToken);

// ✅ Créer un nouveau groupe
router.post("/", GroupController.createGroup);

// 🔍 Obtenir tous les groupes d'une liste
router.get("/list/:listId", GroupController.getGroupsByListId);

// 🔍 Obtenir les membres d’un groupe
router.get("/:id/members", GroupController.getGroupMembers);

// ➕ Ajouter une personne dans un groupe
router.post("/add-person", GroupController.addPersonToGroup);

// ❌ Retirer une personne d’un groupe
router.post("/remove-person", GroupController.removePersonFromGroup);

// 🗑 Supprimer un groupe
router.delete("/:id", GroupController.deleteGroup);

// ✏️ Modifier le nom d’un groupe
router.put("/:id", GroupController.updateGroup);

module.exports = router;
