const db = require("../database");

const UserModel = {
  // 🔍 Récupère tous les utilisateurs
  getAll: (callback) => {
    const sql = "SELECT * FROM users";
    db.query(sql, callback);
  },

  // ✅ Crée un nouvel utilisateur
  create: (user, callback) => {
    const sql = `
      INSERT INTO users (firstname, lastname, email, password, role, is_active, created_at, cgu_accepted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user.nom,
      user.prenom,
      user.email,
      user.mot_de_passe,
      user.role || "user",
      user.actif || false,
      user.date_creation,
      user.date_acceptation_cgu
    ];
    db.query(sql, params, callback);
  },

  // 📧 Recherche un utilisateur par son email
findByEmail: (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) return callback(err || new Error("Utilisateur non trouvé"), null);
    callback(null, results[0]);
  });
},


  // ✅ Active un compte après confirmation par mail
  activate: (email, callback) => {
    const sql = "UPDATE users SET is_active = true WHERE email = ?";
    db.query(sql, [email], callback);
  },

  // ✏️ Met à jour les informations utilisateur
  update: (id, userData, callback) => {
    const fields = [];
    const values = [];

    // Construction dynamique de la requête selon les champs fournis
    for (let key in userData) {
      fields.push(`${key} = ?`);
      values.push(userData[key]);
    }
    values.push(id); // Ajout de l'ID pour la clause WHERE

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, values, callback);
  },

  // ❌ Supprime un utilisateur
  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

module.exports = UserModel;
