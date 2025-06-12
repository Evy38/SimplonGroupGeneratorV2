const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");

router.post("/", GroupController.createGroup);
router.get("/:id/people", GroupController.getGroupMembers);


module.exports = router;

