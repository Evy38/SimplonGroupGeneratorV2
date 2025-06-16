const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root", 
  password: "",
   database: "simplon_groups"  
});

module.exports = db;
