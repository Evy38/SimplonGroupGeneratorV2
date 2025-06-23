const db = require("../config/db");

const PromoModel = {
  // 📋 Récupérer toutes les promos
   getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.id AS promo_id, 
        p.name, 
        p.imageUrl,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.email
      FROM promos p
      LEFT JOIN users u ON p.user_id = u.id
    `);
    return rows;
  },

  // ➕ Créer une promo
create: async (name, imageUrl, user_id) => {
  const sql = `
    INSERT INTO promos (name, imageUrl, user_id)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.query(sql, [name, imageUrl, user_id]);
  return result.insertId;
},

  // 📝 Modifier une promo
update: async (id, name, imageUrl, user_id) => {
  const sql = `
    UPDATE promos
    SET name = ?, imageUrl = ?, user_id = ?
    WHERE id = ?
  `;
  await db.query(sql, [name, imageUrl, user_id, id]);
},

  // ❌ Supprimer une promo
  delete: async (id) => {
    const sql = "DELETE FROM promos WHERE id = ?";
    await db.query(sql, [id]);
  },

  //Pour récupérer une promo seule (utile pour un détail de promo)
  getById: async (id) => {
  const [rows] = await db.query(`
    SELECT p.*, u.firstname, u.lastname, u.email
    FROM promos p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [id]);

  return rows[0];
},

//Pour lister les personnes rattachées à une promo
getPeopleForPromo: async (promoId) => {
  const [rows] = await db.query(`
    SELECT * FROM people WHERE promo_id = ?
  `, [promoId]);
  return rows;
}


};

module.exports = PromoModel;
