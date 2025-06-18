const express = require("express");
const router = express.Router();
const BriefController = require("../controllers/BriefController");
const { verifyToken } = require("../middlewares/auth");

// 📄 Créer un brief
router.post("/", verifyToken, BriefController.createBrief);

// 📚 Voir tous les briefs créés par le formateur connecté
router.get("/promo/:id", verifyToken, BriefController.getBriefsByPromo);

// 🔗 Assigner un groupe à un brief
router.post("/assign", verifyToken, BriefController.assignBriefToGroup);

// 👥 Voir tous les groupes assignés à un brief
router.get("/:id/groups", verifyToken, BriefController.getGroupsForBrief);

module.exports = router;
