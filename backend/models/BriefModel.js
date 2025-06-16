const db = require("../config/db");

const BriefModel = {
  // ➕ Créer un brief
  create: async (titre, description, formateur_id) => {
    const sql = `
      INSERT INTO briefs (titre, description, formateur_id)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [titre, description, formateur_id]);
    return result.insertId;
  },

  // 📋 Récupérer tous les briefs d’un formateur
  getByFormateur: async (formateur_id) => {
    const sql = `
      SELECT * FROM briefs
      WHERE formateur_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [formateur_id]);
    return rows;
  },

  // 🔄 Assigner un brief à un groupe
  assignToGroup: async (brief_id, group_id) => {
    const sql = `
      INSERT INTO brief_groups (brief_id, group_id)
      VALUES (?, ?)
    `;
    await db.query(sql, [brief_id, group_id]);
  },

  // 📂 Récupérer les groupes assignés à un brief
  getAssignedGroups: async (brief_id) => {
    const sql = `
      SELECT g.* FROM groups g
      JOIN brief_groups bg ON g.id = bg.group_id
      WHERE bg.brief_id = ?
    `;
    const [rows] = await db.query(sql, [brief_id]);
    return rows;
  }
};

module.exports = BriefModel;
