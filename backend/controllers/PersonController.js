const PersonModel = require("../models/PersonModel");

const PersonController = {
  createPerson: (req, res) => {
    const personne = req.body;

    // Vérification simple
    if (!personne.nom || !personne.list_id) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    PersonModel.create(personne, (err, created) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(201).json(created);
    });
  }
};

module.exports = PersonController;
