const express = require("express");

const oauthController = require("../controllers/oauthController");

const router = express.Router();

router.get("/callback", oauthController.requestToken);
router.get("/accesstoken", oauthController.getToken);

module.exports = router;
