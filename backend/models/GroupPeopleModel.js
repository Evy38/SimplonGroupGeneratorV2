const db = require("../database");

const GroupPeopleModel = {
  assignPersonToGroup: (group_id, person_id, callback) => {
    const sql = "INSERT INTO group_people (group_id, person_id) VALUES (?, ?)";
    db.query(sql, [group_id, person_id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, group_id, person_id });
    });
  }
};

module.exports = GroupPeopleModel;
