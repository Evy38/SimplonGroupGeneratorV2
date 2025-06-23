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
const promoRoutes = require("./promo.routes");
const promoPersonRoutes = require("./promo-person.routes");

// Montage des routes
router.use("/users", userRoutes);                  // /api/users
router.use("/lists", listRoutes);                  // /api/lists
router.use("/people", personRoutes);               // /api/people
router.use("/groups", groupRoutes);                // /api/groups
router.use("/group-people", groupPeopleRoutes);    // /api/group-people
router.use("/generate-groups", generateGroupsRoutes); // /api/generate-groups
router.use("/briefs", briefRoutes);                // /api/briefs
router.use("/promos", promoRoutes);                // /api/promos
router.use("/promo-persons", promoPersonRoutes);   // /api/promo-persons

module.exports = router;
