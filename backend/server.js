const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./database");
const userRoutes = require("./routes/user.routes");
const listRoutes = require("./routes/list.routes");
const personRoutes = require("./routes/person.routes");
const groupRoutes = require("./routes/group.routes");
const groupPeopleRoutes = require("./routes/groupPeople.routes");
const generateGroupsRoutes = require("./routes/generateGroups.routes");





// Middleware
app.use(express.json());
app.use("/users", userRoutes);
app.use("/lists", listRoutes);
app.use("/people", personRoutes);
app.use("/groups", groupRoutes);
app.use("/group-people", groupPeopleRoutes);
app.use("/generate-groups", generateGroupsRoutes);




// Test de route simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le backend Simplon Group Generator V2 !" });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
