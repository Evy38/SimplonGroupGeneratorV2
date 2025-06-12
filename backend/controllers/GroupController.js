const GroupModel = require("../models/GroupModel");

const GroupController = {
  createGroup: (req, res) => {
    const { nom, list_id } = req.body;
    if (!nom || !list_id) {
      return res.status(400).json({ error: "nom et list_id requis" });
    }

    GroupModel.create(nom, list_id, (err, group) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(201).json(group);
    });
  },

  getGroupMembers: (req, res) => {
    const group_id = req.params.id;

    if (!group_id) {
      return res.status(400).json({ error: "group_id manquant" });
    }

    GroupModel.getPeopleInGroup(group_id, (err, people) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(200).json(people);
    });
  }
};

module.exports = GroupController;
