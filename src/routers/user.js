const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getUserInformation);

module.exports = router;
