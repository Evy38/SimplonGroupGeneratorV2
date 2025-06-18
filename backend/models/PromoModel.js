const db = require("../config/db");

const PromoModel = {
  // 📋 Récupérer toutes les promos
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM promos ORDER BY date_debut DESC");
    return rows;
  },

  // ➕ Créer une promo
  create: async (nom, description, date_debut, date_fin) => {
    const sql = `
      INSERT INTO promos (nom, description, date_debut, date_fin)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [nom, description, date_debut, date_fin]);
    return result.insertId;
  },

  // 📝 Modifier une promo
  update: async (id, nom, description, date_debut, date_fin) => {
    const sql = `
      UPDATE promos
      SET nom = ?, description = ?, date_debut = ?, date_fin = ?
      WHERE id = ?
    `;
    await db.query(sql, [nom, description, date_debut, date_fin, id]);
  },

  // ❌ Supprimer une promo
  delete: async (id) => {
    const sql = "DELETE FROM promos WHERE id = ?";
    await db.query(sql, [id]);
  }
};

module.exports = PromoModel;
