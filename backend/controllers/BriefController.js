const BriefModel = require("../models/BriefModel");

const BriefController = {
  // ➕ Créer un brief
  createBrief: async (req, res) => {
    const { title, description, imageUrl, promo_id } = req.body;

    try {
      const briefId = await BriefModel.create(title, description, imageUrl, promo_id);
      res.status(201).json({ message: "Brief créé avec succès", id: briefId });
    } catch (err) {
      console.error("Erreur lors de la création du brief :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // 📚 Obtenir tous les briefs d’une promo
  getBriefsByPromo: async (req, res) => {
    const promo_id = req.params.id;

    try {
      const briefs = await BriefModel.getByPromo(promo_id);
      res.status(200).json(briefs);
    } catch (err) {
      console.error("Erreur lors de la récupération des briefs :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // 🔄 Assigner un brief à un groupe
  assignBriefToGroup: async (req, res) => {
    const { brief_id, group_id } = req.body;

    try {
      await BriefModel.assignToGroup(brief_id, group_id);
      res.status(200).json({ message: "Brief assigné au groupe" });
    } catch (err) {
      console.error("Erreur lors de l’assignation du brief :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // 👥 Voir tous les groupes assignés à un brief
  getGroupsForBrief: async (req, res) => {
    const brief_id = req.params.id;

    try {
      const groups = await BriefModel.getAssignedGroups(brief_id);
      res.status(200).json(groups);
    } catch (err) {
      console.error("Erreur lors de la récupération des groupes :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = BriefController;
