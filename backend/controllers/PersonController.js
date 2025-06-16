const PersonModel = require("../models/PersonModel");

const PersonController = {
  // 🔍 Récupérer toutes les personnes d’une liste donnée
  getAllByListId: (req, res) => {
    const listId = req.params.listId;
    PersonModel.getByListId(listId, (err, people) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.json(people);
    });
  },

  // ✅ Ajouter une personne dans une liste
  createPerson: (req, res) => {
    const person = req.body;
    PersonModel.create(person, (err, newPerson) => {
      if (err) return res.status(500).json({ error: "Erreur à l’insertion" });
      res.status(201).json(newPerson);
    });
  },

  // ✏️ Modifier une personne
  updatePerson: (req, res) => {
    const personId = req.params.id;
    const updates = req.body;
    PersonModel.update(personId, updates, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur mise à jour" });
      res.json({ message: "Personne mise à jour" });
    });
  },

  // ❌ Supprimer une personne
  deletePerson: (req, res) => {
    const personId = req.params.id;
    PersonModel.delete(personId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur suppression" });
      res.json({ message: "Personne supprimée" });
    });
  }
};

module.exports = PersonController;
