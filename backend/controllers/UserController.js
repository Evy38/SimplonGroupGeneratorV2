// 🔌 Importation du modèle UserModel qui interagit avec la base de données
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt"); // Pour chiffrer les mots de passe
const jwt = require("jsonwebtoken"); // Pour générer des tokens d'auth
const nodemailer = require("nodemailer"); // Pour l'envoi d'email





// 📌 Configuration pour les emails (exemple avec Gmail, à adapter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,     // Email d'envoi
    pass: process.env.MAIL_PASSWORD  // Mot de passe d'application
  }
});

const UserController = {
  // 📍 Récupération de tous les utilisateurs (admin uniquement)
 getAllUsers: (req, res) => {
  db.query("SELECT id, nom, email, role FROM users", (err, results) => {
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

    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 Chiffrement du mot de passe

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

      // ✉️ Envoi du mail de confirmation
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
  },

  // 🔓 Connexion d’un utilisateur
 login: (req, res) => {
  const { email, password } = req.body;

  UserModel.findByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Email invalide" });
    }

    // ✅ compare en clair temporairement
    const match = password === user.mot_de_passe;

    if (!match) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    if (!user.actif) {
      return res.status(403).json({ error: "Compte non activé" });
    }

    // 🎟️ Génération d’un token JWT
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ message: "Connexion réussie", token });
  });
},


  // ✅ Confirmation du compte par lien
  confirmEmail: (req, res) => {
    const { email } = req.query;

    UserModel.activate(email, (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur activation" });
      res.json({ message: "Email confirmé, compte activé" });
    });
  },

  // 🔁 Modification des infos utilisateur
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
