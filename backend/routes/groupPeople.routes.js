const express = require("express");
const router = express.Router();
const GroupPeopleController = require("../controllers/GroupPeopleController");

router.post("/", GroupPeopleController.assign);

module.exports = router;
