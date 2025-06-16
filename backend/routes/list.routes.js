const express = require("express");
const router = express.Router();
const ListController = require("../controllers/ListController");
const { verifyToken } = require("../middlewares/auth");

// 🧾 Toutes les routes nécessitent une connexion
router.use(verifyToken);

// 👤 Récupère les listes de l’utilisateur connecté
router.get("/me", ListController.getUserLists);

// 📂 Récupère les listes partagées avec l’utilisateur connecté
router.get("/shared", ListController.getSharedLists);

// ✅ Créer une liste
router.post("/", ListController.createList);

// ✏️ Modifier une liste
router.put("/:id", ListController.updateList);

// ❌ Supprimer une liste
router.delete("/:id", ListController.deleteList);

// 📊 Détail d’une liste
router.get("/details/:id", ListController.getListDetails);

// 🛠 Admin uniquement : récupérer toutes les listes (optionnel)
router.get("/", ListController.getAllLists);

// 🔄 Route pour partager une liste
const ListSharingController = require("../controllers/ListSharingController");
router.post("/share", ListSharingController.share);



module.exports = router;
