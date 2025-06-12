const express = require("express");
const router = express.Router();
const GenerateGroupsController = require("../controllers/GenerateGroupsController");

router.post("/", GenerateGroupsController.generate);

module.exports = router;
