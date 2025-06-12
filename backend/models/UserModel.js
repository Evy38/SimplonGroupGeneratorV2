const db = require("../database");

const UserModel = {
  getAll: (callback) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }
};

module.exports = UserModel;
