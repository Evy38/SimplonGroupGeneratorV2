const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "simplon_groups",
  // port: 3307
});

module.exports = db;
