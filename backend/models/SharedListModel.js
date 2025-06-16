const db = require("../config/db"); // 🔁 vérifie bien le bon chemin ici

const SharedListModel = {
  // ➕ Partager une liste avec un utilisateur
  share: async (list_id, shared_with_user_id, access_type = "read") => {
    const sql = `
      INSERT INTO shared_lists (list_id, shared_with_user_id, access_type)
      VALUES (?, ?, ?)
    `;
    await db.query(sql, [list_id, shared_with_user_id, String(access_type)]);
  },

  // 🔍 Récupérer les listes partagées avec un utilisateur
  getSharedWithUser: async (user_id) => {
    const sql = `
      SELECT sl.*, l.nom AS list_name
      FROM shared_lists sl
      JOIN lists l ON sl.list_id = l.id
      WHERE sl.shared_with_user_id = ?
    `;
    const [rows] = await db.query(sql, [user_id]);
    return rows;
  },

  // 🔍 Vérifie si la liste est déjà partagée avec ce user
  isAlreadyShared: async (list_id, user_id) => {
    const sql = `
      SELECT * FROM shared_lists
      WHERE list_id = ? AND shared_with_user_id = ?
    `;
    const [rows] = await db.query(sql, [list_id, user_id]);
    return rows;
  }
};



module.exports = SharedListModel;
