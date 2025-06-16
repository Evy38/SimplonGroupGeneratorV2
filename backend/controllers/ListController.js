const ListModel = require("../models/ListModel");

const ListController = {
  // 🔍 Récupère toutes les listes (admin)
  getAllLists: (req, res) => {
    ListModel.getAll((err, lists) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.json(lists);
    });
  },

  // 🔍 Récupère les listes d’un utilisateur spécifique
  getUserLists: (req, res) => {
    const userId = req.user.id;
    ListModel.getByUserId(userId, (err, lists) => {
      if (err) return res.status(500).json({ error: "Erreur récupération listes" });
      res.json(lists);
    });
  },

  // ✅ Crée une nouvelle liste
  createList: (req, res) => {
    const { nom } = req.body;
    const userId = req.user.id;

    if (!nom) return res.status(400).json({ error: "Nom requis" });

    ListModel.create(nom, userId, (err, newList) => {
      if (err) return res.status(500).json({ error: "Erreur création" });
      res.status(201).json(newList);
    });
  },

  // ✏️ Modifie le nom d’une liste
  updateList: (req, res) => {
    const listId = req.params.id;
    const { nom } = req.body;

    if (!nom) return res.status(400).json({ error: "Nouveau nom requis" });

    ListModel.update(listId, nom, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur mise à jour" });
      res.json({ message: "Liste mise à jour" });
    });
  },

  // ❌ Supprime une liste
  deleteList: (req, res) => {
    const listId = req.params.id;

    ListModel.delete(listId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur suppression" });
      res.json({ message: "Liste supprimée" });
    });
  },

  // 📊 Donne les détails d’une liste
  getListDetails: (req, res) => {
    const listId = req.params.id;

    ListModel.getDetails(listId, (err, data) => {
      if (err) return res.status(500).json({ error: "Erreur récupération détails" });
      res.json(data);
    });
  },

  // 🤝 Partage une liste avec un autre utilisateur
  shareList: (req, res) => {
    const { listId, targetUserId } = req.body;
    const userId = req.user.id;

    if (!listId || !targetUserId) {
      return res.status(400).json({ error: "Champs requis" });
    }

    ListModel.shareWithUser(listId, targetUserId, userId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur de partage" });
      res.json({ message: "Liste partagée" });
    });
  },

};

module.exports = ListController;
