const express = require("express");
const router = express.Router();

// Importation des sous-routes
const userRoutes = require("./user.routes");
const listRoutes = require("./list.routes");
const personRoutes = require("./person.routes");
const groupRoutes = require("./group.routes");
const groupPeopleRoutes = require("./groupPeople.routes");
const generateGroupsRoutes = require("./generateGroups.routes");
const briefRoutes = require("./brief.routes");
const promoPersonRoutes = require("./promo-person.routes");


// Montage des routes sous /api/xxx
router.use("/users", userRoutes);
router.use("/lists", listRoutes);
router.use("/people", personRoutes);
router.use("/groups", groupRoutes);
router.use("/group-people", groupPeopleRoutes);
router.use("/generate-groups", generateGroupsRoutes);
router.use("/briefs", briefRoutes);
router.use("/promos", promoPersonRoutes);

module.exports = router;
