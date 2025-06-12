const express = require("express");
const router = express.Router();
const PersonController = require("../controllers/PersonController");

router.post("/", PersonController.createPerson);

module.exports = router;
