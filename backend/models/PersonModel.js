const db = require("../database");

const PersonModel = {
  create: (personne, callback) => {
    const {
      nom, genre, aisance_fr, ancien_dwwm,
      niveau_technique, profil, age, list_id
    } = personne;

    const sql = `
      INSERT INTO people (nom, genre, aisance_fr, ancien_dwwm, niveau_technique, profil, age, list_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [nom, genre, aisance_fr, ancien_dwwm, niveau_technique, profil, age, list_id];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, ...personne });
    });
  }
};

module.exports = PersonModel;
