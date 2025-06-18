const db = require("../config/db");

const BriefModel = {
  // ➕ Créer un brief
  create: async (title, description, imageUrl, promo_id) => {
    const sql = `
      INSERT INTO briefs (title, description, imageUrl, promo_id, creationDate)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [title, description, imageUrl, promo_id]);
    return result.insertId;
  },

  // 📋 Récupérer tous les briefs d’une promo
  getByPromo: async (promo_id) => {
    const sql = `
      SELECT * FROM briefs
      WHERE promo_id = ?
      ORDER BY creationDate DESC
    `;
    const [rows] = await db.query(sql, [promo_id]);
    return rows;
  },

  // 🔄 Assigner un brief à un groupe (optionnel si tu fais ce lien ailleurs)
  assignToGroup: async (brief_id, group_id) => {
    const sql = `
      UPDATE groups
      SET brief_id = ?
      WHERE id = ?
    `;
    await db.query(sql, [brief_id, group_id]);
  },

  // 📂 Récupérer les groupes associés à un brief
  getAssignedGroups: async (brief_id) => {
    const sql = `
      SELECT * FROM groups
      WHERE brief_id = ?
    `;
    const [rows] = await db.query(sql, [brief_id]);
    return rows;
  }
};

module.exports = BriefModel;
