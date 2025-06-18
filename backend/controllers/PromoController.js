const PromoModel = require("../models/PromoModel");

const PromoController = {
  // 📋 Récupérer toutes les promos
  getAllPromos: async (req, res) => {
    try {
      const promos = await PromoModel.getAll();
      res.status(200).json(promos);
    } catch (err) {
      console.error("Erreur récupération promos :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // ➕ Créer une promo
  createPromo: async (req, res) => {
    const { nom, description, date_debut, date_fin } = req.body;
    try {
      const id = await PromoModel.create(nom, description, date_debut, date_fin);
      res.status(201).json({ message: "Promo créée", id });
    } catch (err) {
      console.error("Erreur création promo :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // 📝 Modifier une promo
  updatePromo: async (req, res) => {
    const { id } = req.params;
    const { nom, description, date_debut, date_fin } = req.body;
    try {
      await PromoModel.update(id, nom, description, date_debut, date_fin);
      res.status(200).json({ message: "Promo mise à jour" });
    } catch (err) {
      console.error("Erreur modification promo :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // ❌ Supprimer une promo
  deletePromo: async (req, res) => {
    const { id } = req.params;
    try {
      await PromoModel.delete(id);
      res.status(200).json({ message: "Promo supprimée" });
    } catch (err) {
      console.error("Erreur suppression promo :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = PromoController;
