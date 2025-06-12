const UserModel = require("../models/UserModel");

const UserController = {
  getAllUsers: (req, res) => {
    UserModel.getAll((err, users) => {
      if (err) {
        res.status(500).json({ error: "Erreur serveur" });
        return;
      }
      res.json(users);
    });
  }
};

module.exports = UserController;
