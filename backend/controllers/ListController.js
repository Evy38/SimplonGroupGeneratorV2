const ListModel = require("../models/ListModel");

const ListController = {
  getAllLists: (req, res) => {
    ListModel.getAll((err, lists) => {
      if (err) {
        res.status(500).json({ error: "Erreur serveur" });
        return;
      }
      res.json(lists);
    });
  },

  createList: (req, res) => {
    const { nom, user_id } = req.body;
    if (!nom || !user_id) {
      return res.status(400).json({ error: "Nom et user_id requis" });
    }

    ListModel.create(nom, user_id, (err, newList) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de l'insertion" });
      }
      res.status(201).json(newList);
    });
  }
};

module.exports = ListController;

