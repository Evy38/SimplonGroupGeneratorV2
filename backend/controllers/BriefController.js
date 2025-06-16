const BriefModel = require("../models/BriefModel");

const BriefController = {
  createBrief: async (req, res) => {
    const { titre, description } = req.body;
    const formateur_id = req.user.id;

    try {
      const briefId = await BriefModel.create(titre, description, formateur_id);
      res.status(201).json({ message: "Brief créé", id: briefId });
    } catch (err) {
      console.error("Erreur création brief :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  getBriefsByMe: async (req, res) => {
    try {
      const briefs = await BriefModel.getByFormateur(req.user.id);
      res.json(briefs);
    } catch (err) {
      console.error("Erreur récupération briefs :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  assignBriefToGroup: async (req, res) => {
    const { brief_id, group_id } = req.body;

    try {
      await BriefModel.assignToGroup(brief_id, group_id);
      res.status(200).json({ message: "Brief assigné au groupe" });
    } catch (err) {
      console.error("Erreur assignation :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  getGroupsForBrief: async (req, res) => {
    const { id } = req.params;
    try {
      const groups = await BriefModel.getAssignedGroups(id);
      res.json(groups);
    } catch (err) {
      console.error("Erreur groupes assignés :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = BriefController;
