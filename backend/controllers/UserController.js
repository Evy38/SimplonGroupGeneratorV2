const db = require("../config/db");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// 📧 Configuration d'envoi d'emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const UserController = {
  // 📍 Récupération de tous les utilisateurs
  getAllUsers: (req, res) => {
    db.query("SELECT id, firstname, lastname, email, role FROM users", (err, results) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.json(results);
    });
  },

  // ✅ Inscription d’un nouvel utilisateur
  register: async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: "user",
        is_active: false,
        created_at: new Date(),
        cgu_accepted_at: new Date()
      };

      UserModel.create(newUser, (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur à la création" });

        const confirmUrl = `http://localhost:3000/confirm?email=${email}`;
        const mailOptions = {
          from: process.env.MAIL_USER,
          to: email,
          subject: "Confirme ton inscription",
          html: `<p>Bonjour ${firstname}, clique ici pour confirmer : <a href="${confirmUrl}">Confirmer</a></p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) return res.status(500).json({ error: "Erreur envoi email" });
          res.status(201).json({ message: "Utilisateur créé, email envoyé" });
        });
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // 🔓 Connexion d’un utilisateur avec mot de passe hashé
  login: async (req, res) => {
    const { email, password } = req.body;

    UserModel.findByEmail(email, async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Email invalide" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }

      if (!user.is_active) {
        return res.status(403).json({ error: "Compte non activé" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

     res.json({
  message: "Connexion réussie",
  token,
  user: {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    cgu_accepted_at: user.cgu_accepted_at
  }
});

    });
  },

  // 📩 Confirmation d'email
  confirmEmail: (req, res) => {
    const { email } = req.query;

    UserModel.activate(email, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur activation" });
      res.json({ message: "Email confirmé, compte activé" });
    });
  },

  // ✏️ Mise à jour d'un utilisateur
  updateUser: (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    UserModel.update(userId, updateData, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur modification" });
      res.json({ message: "Utilisateur modifié" });
    });
  },

  // ❌ Suppression d’un utilisateur
  deleteUser: (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur suppression" });
      res.json({ message: "Utilisateur supprimé" });
    });
  }
};

module.exports = UserController;
