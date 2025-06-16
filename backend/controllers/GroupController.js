const GroupModel = require("../models/GroupModel");

const GroupController = {
  // ✅ Créer un nouveau groupe lié à une liste
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

  // 🔍 Récupérer tous les groupes d’une liste
  getGroupsByListId: (req, res) => {
    const listId = req.params.listId;

    GroupModel.getByListId(listId, (err, groups) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(200).json(groups);
    });
  },

  // 🔍 Récupérer les membres d’un groupe
  getGroupMembers: (req, res) => {
    const group_id = req.params.id;

    GroupModel.getPeopleInGroup(group_id, (err, people) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(200).json(people);
    });
  },

  // ✅ Ajouter une personne à un groupe
  addPersonToGroup: (req, res) => {
    const { group_id, person_id } = req.body;

    if (!group_id || !person_id) {
      return res.status(400).json({ error: "group_id et person_id requis" });
    }

    GroupModel.addPerson(group_id, person_id, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l’ajout" });
      res.status(200).json({ message: "Personne ajoutée au groupe" });
    });
  },

  // ❌ Retirer une personne d’un groupe
  removePersonFromGroup: (req, res) => {
    const { group_id, person_id } = req.body;

    if (!group_id || !person_id) {
      return res.status(400).json({ error: "group_id et person_id requis" });
    }

    GroupModel.removePerson(group_id, person_id, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la suppression" });
      res.status(200).json({ message: "Personne retirée du groupe" });
    });
  },

  // 🗑 Supprimer un groupe
  deleteGroup: (req, res) => {
    const groupId = req.params.id;

    GroupModel.delete(groupId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur suppression groupe" });
      res.status(200).json({ message: "Groupe supprimé" });
    });
  },

  // ✏️ Modifier le nom d’un groupe
  updateGroup: (req, res) => {
    const groupId = req.params.id;
    const { nom } = req.body;

    if (!nom) return res.status(400).json({ error: "Nouveau nom requis" });

    GroupModel.update(groupId, nom, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur mise à jour" });
      res.status(200).json({ message: "Groupe mis à jour" });
    });
  }
};

module.exports = GroupController;
