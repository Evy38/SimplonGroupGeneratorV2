const db = require("../database");

const ListModel = {
  getAll: (callback) => {
    const sql = "SELECT * FROM lists";
    db.query(sql, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  create: (nom, userId, callback) => {
    const sql = "INSERT INTO lists (nom, user_id) VALUES (?, ?)";
    db.query(sql, [nom, userId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, nom, user_id: userId });
    });
  }
};

module.exports = ListModel;
