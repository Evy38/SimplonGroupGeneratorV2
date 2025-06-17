const db = require('../models');
const Person = db.Person;
const Group = db.Group;

// Récupérer toutes les personnes d'une promo
exports.getPersonsByPromo = async (req, res) => {
  const promoId = req.params.promoId;
  try {
    const group = await Group.findByPk(promoId, {
      include: [{ model: Person, as: 'members' }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Promo non trouvée' });
    }

    res.status(200).json(group.members);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Ajouter une personne à une promo
exports.addPersonToPromo = async (req, res) => {
  const promoId = req.params.promoId;
  const { personId } = req.body;

  try {
    const group = await Group.findByPk(promoId);
    const person = await Person.findByPk(personId);

    if (!group || !person) {
      return res.status(404).json({ message: 'Promo ou personne introuvable' });
    }

    await group.addMember(person); // relation belongsToMany
    res.status(200).json({ message: 'Personne ajoutée à la promo avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error });
  }
};

// Supprimer une personne d’une promo
exports.removePersonFromPromo = async (req, res) => {
  const promoId = req.params.promoId;
  const personId = req.params.personId;

  try {
    const group = await Group.findByPk(promoId);
    const person = await Person.findByPk(personId);

    if (!group || !person) {
      return res.status(404).json({ message: 'Promo ou personne introuvable' });
    }

    await group.removeMember(person); // relation belongsToMany
    res.status(200).json({ message: 'Personne retirée de la promo avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
};
