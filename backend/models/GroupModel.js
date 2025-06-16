const db = require("../database");

const GroupModel = {
  // ✅ Créer un groupe
  create: (nom, list_id, callback) => {
    const sql = "INSERT INTO groups (nom, list_id, date_creation) VALUES (?, ?, NOW())";
    db.query(sql, [nom, list_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, nom, list_id });
    });
  },

  // 🔍 Obtenir tous les groupes d'une liste
  getByListId: (list_id, callback) => {
    const sql = "SELECT * FROM groups WHERE list_id = ?";
    db.query(sql, [list_id], callback);
  },

  // 🔍 Obtenir les personnes d’un groupe
  getPeopleInGroup: (group_id, callback) => {
    const sql = `
      SELECT p.*
      FROM people p
      JOIN group_people gp ON p.id = gp.person_id
      WHERE gp.group_id = ?
    `;
    db.query(sql, [group_id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // ➕ Ajouter une personne dans un groupe
  addPerson: (group_id, person_id, callback) => {
    const sql = "INSERT INTO group_people (group_id, person_id) VALUES (?, ?)";
    db.query(sql, [group_id, person_id], callback);
  },

  // ❌ Supprimer une personne d’un groupe
  removePerson: (group_id, person_id, callback) => {
    const sql = "DELETE FROM group_people WHERE group_id = ? AND person_id = ?";
    db.query(sql, [group_id, person_id], callback);
  },

  // 🗑 Supprimer un groupe
  delete: (group_id, callback) => {
    const sql = "DELETE FROM groups WHERE id = ?";
    db.query(sql, [group_id], callback);
  },

  // ✏️ Modifier le nom d’un groupe
  update: (group_id, newName, callback) => {
    const sql = "UPDATE groups SET nom = ? WHERE id = ?";
    db.query(sql, [newName, group_id], callback);
  }
};

module.exports = GroupModel;
