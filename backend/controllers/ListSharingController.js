const SharedListModel = require("../models/SharedListModel");
const db = require("../config/db"); // Connexion à la BDD

const ListSharingController = {
  // 🤝 Partage d’une liste
  share: async (req, res) => {
    const { list_id, email, access_type } = req.body;

    if (!list_id || !email) {
      return res.status(400).json({ error: "Champs requis : list_id et email" });
    }

    try {
      // 🔍 Récupérer l'id de l'utilisateur via son email
      const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const shared_with_user_id = rows[0].id;

      // 🔁 Vérifie si cette liste est déjà partagée avec cet utilisateur
      const exists = await SharedListModel.isAlreadyShared(list_id, shared_with_user_id);
      if (exists.length > 0) {
        return res.status(409).json({ error: "Cette liste est déjà partagée avec cet utilisateur." });
      }

      // ➕ Ajout du partage
      await SharedListModel.share(list_id, shared_with_user_id, access_type || "read");
      res.status(201).json({ message: "Liste partagée avec succès !" });

    } catch (e) {
      console.error("Erreur dans ListSharingController.share :", e);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
};

module.exports = ListSharingController;
