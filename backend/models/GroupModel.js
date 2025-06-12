const db = require("../database");

const GroupModel = {
  create: (nom, list_id, callback) => {
    const sql = "INSERT INTO groups (nom, list_id, date_creation) VALUES (?, ?, NOW())";
    db.query(sql, [nom, list_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, nom, list_id });
    });
  },

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
  }
};

module.exports = GroupModel;
