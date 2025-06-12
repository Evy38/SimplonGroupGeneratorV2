const express = require("express");
const router = express.Router();
const ListController = require("../controllers/ListController");
router.post("/", ListController.createList);


router.get("/", ListController.getAllLists);

module.exports = router;
