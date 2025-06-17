const express = require('express');
const router = express.Router();
const PromoPersonController = require('../controllers/PromoPersonController');

// Récupérer les personnes d’une promo
router.get('/:promoId/persons', PromoPersonController.getPersonsByPromo);

// Ajouter une personne à une promo
router.post('/:promoId/persons', PromoPersonController.addPersonToPromo);

// Retirer une personne d’une promo
router.delete('/:promoId/persons/:personId', PromoPersonController.removePersonFromPromo);

module.exports = router;
