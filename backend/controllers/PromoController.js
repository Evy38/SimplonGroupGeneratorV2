const PromoModel = require("../models/PromoModel");

const PromoController = {
  // 📋 Récupérer toutes les promos avec le formateur (enrichi)
  getAllPromos: async (req, res) => {
    try {
      const rows = await PromoModel.getAll(); // nouvelle méthode

      const promos = rows.map(row => ({
        id: row.promo_id,
        name: row.name,
        imageUrl: row.imageUrl,
        formateur: {
          id: row.user_id,
          firstname: row.firstname,
          lastname: row.lastname,
          email: row.email
        }
      }));

      res.status(200).json(promos);
    } catch (err) {
      console.error("Erreur récupération promos enrichies :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // ➕ Créer une promo
  createPromo: async (req, res) => {
    const { name, imageUrl, user_id } = req.body;
    try {
      const id = await PromoModel.create(name, imageUrl, user_id);
      res.status(201).json({ message: "Promo créée", id });
    } catch (err) {
      console.error("Erreur création promo :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },


  // 📝 Modifier une promo
  updatePromo: async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl, user_id } = req.body;
    try {
      await PromoModel.update(id, name, imageUrl, user_id);
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
  },

  getPromoById: async (req, res) => {
  const { id } = req.params;
  try {
    const promo = await PromoModel.getById(id);
    res.status(200).json(promo);
  } catch (err) {
    console.error("Erreur récupération promo par ID :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
},

getPeopleForPromo: async (req, res) => {
  const { id } = req.params;
  try {
    const people = await PromoModel.getPeopleForPromo(id);
    res.status(200).json(people);
  } catch (err) {
    console.error("Erreur récupération personnes promo :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}


};

module.exports = PromoController;
