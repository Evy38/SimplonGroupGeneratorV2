const GroupPeopleModel = require("../models/GroupPeopleModel");

const GroupPeopleController = {
  assign: (req, res) => {
    const { group_id, person_id } = req.body;
    if (!group_id || !person_id) {
      return res.status(400).json({ error: "group_id et person_id requis" });
    }

    GroupPeopleModel.assignPersonToGroup(group_id, person_id, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(201).json(result);
    });
  }
};

module.exports = GroupPeopleController;
