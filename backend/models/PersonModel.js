const db = require("../database");

const PersonModel = {
  // 🔍 Toutes les personnes d’une liste
  getByListId: (listId, callback) => {
    const sql = "SELECT * FROM people WHERE list_id = ?";
    db.query(sql, [listId], callback);
  },

  // ✅ Créer une personne
  create: (person, callback) => {
    const sql = `
      INSERT INTO people (nom, genre, aisance_fr, ancien_dwwm, niveau_technique, profil, age, list_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      person.nom,
      person.genre,
      person.aisance_fr,
      person.ancien_dwwm,
      person.niveau_technique,
      person.profil,
      person.age,
      person.list_id
    ];
    db.query(sql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...person });
    });
  },

  // ✏️ Modifier une personne
  update: (id, updates, callback) => {
    const fields = [];
    const values = [];

    for (let key in updates) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    values.push(id);
    const sql = `UPDATE people SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, values, callback);
  },

  // ❌ Supprimer une personne
  delete: (id, callback) => {
    const sql = "DELETE FROM people WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

module.exports = PersonModel;
