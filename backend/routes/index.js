const express = require("express");
const router = express.Router();

// Routes principales
const userRoutes = require("./user.routes");
const listRoutes = require("./list.routes");
const personRoutes = require("./person.routes"); 
const groupRoutes = require("./group.routes");
const generateGroupsRoutes = require("./generateGroups.routes");

router.use("/generate-groups", generateGroupsRoutes);
router.use("/groups", groupRoutes);
router.use("/users", userRoutes);
router.use("/lists", listRoutes);
router.use("/people", personRoutes); 
router.use("/lists", listRoutes);


module.exports = router;
