const express = require("express");
const router = express.Router();
const PromoController = require("../controllers/PromoController");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// 📋 Récupérer toutes les promos
router.get("/", verifyToken, PromoController.getAllPromos);

// ➕ Créer une promo
router.post("/", verifyToken, isAdmin, PromoController.createPromo);

// ✏️ Modifier une promo
router.put("/:id", verifyToken, isAdmin, PromoController.updatePromo);

// ❌ Supprimer une promo
router.delete("/:id", verifyToken, isAdmin, PromoController.deletePromo);

//récuperer une promo seule
router.get('/:id', PromoController.getPromoById);

router.get('/:id/people', PromoController.getPeopleForPromo);



module.exports = router;
