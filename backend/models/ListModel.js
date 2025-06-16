const db = require("../database");

const ListModel = {
  // 🔍 Récupère toutes les listes (admin uniquement)
  getAll: (callback) => {
    const sql = "SELECT * FROM lists";
    db.query(sql, callback);
  },

  // 👤 Récupère les listes d’un utilisateur
  getByUserId: (userId, callback) => {
    const sql = "SELECT * FROM lists WHERE user_id = ?";
    db.query(sql, [userId], callback);
  },

  // ✅ Crée une nouvelle liste
  create: (nom, userId, callback) => {
    const sql = "INSERT INTO lists (nom, user_id, est_partagee) VALUES (?, ?, 0)";
    db.query(sql, [nom, userId], (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, nom, user_id: userId });
    });
  },

  // ✏️ Met à jour le nom d’une liste
  update: (id, nom, callback) => {
    const sql = "UPDATE lists SET nom = ? WHERE id = ?";
    db.query(sql, [nom, id], callback);
  },

  // ❌ Supprime une liste
  delete: (id, callback) => {
    const sql = "DELETE FROM lists WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // 📊 Détail d’une liste : nombre de personnes et tirages
  getDetails: (id, callback) => {
    const sql = `
      SELECT 
        l.id, 
        l.nom, 
        COUNT(DISTINCT p.id) AS nb_personnes,
        COUNT(DISTINCT g.id) AS nb_tirages
      FROM lists l
      LEFT JOIN people p ON p.list_id = l.id
      LEFT JOIN groups g ON g.list_id = l.id
      WHERE l.id = ?
      GROUP BY l.id
    `;
    db.query(sql, [id], (err, results) => {
      if (err || results.length === 0) return callback(err || new Error("Introuvable"));
      callback(null, results[0]);
    });
  },

  // 🤝 Partage une liste avec un autre utilisateur
  shareWithUser: (listId, targetUserId, callback) => {
    const sql = "INSERT INTO shares (list_id, user_id_partage_avec) VALUES (?, ?)";
    db.query(sql, [listId, targetUserId], callback);
  },

  // 📂 Récupère les listes partagées avec l’utilisateur connecté
  getSharedWithUser: (userId, callback) => {
    const sql = `
      SELECT l.* FROM lists l
      JOIN shares s ON l.id = s.list_id
      WHERE s.user_id_partage_avec = ?
    `;
    db.query(sql, [userId], callback);
  }
};

module.exports = ListModel;
