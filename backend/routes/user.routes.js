const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const { verifyToken } = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Authentification publique
router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/confirm", UserController.confirmEmail);

// Routes protégées
router.get("/", verifyToken, isAdmin, UserController.getAllUsers);
router.put("/:id", verifyToken, UserController.updateUser);
router.delete("/:id", verifyToken, UserController.deleteUser);
router.use(verifyToken);

// ✅ Voir tous les utilisateurs (admin uniquement)
router.get("/", isAdmin, UserController.getAllUsers);
// ❌ Supprimer un utilisateur (admin uniquement)
router.delete("/:id", isAdmin, UserController.deleteUser);

module.exports = router;
