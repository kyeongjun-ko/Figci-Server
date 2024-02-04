const express = require("express");

const projectController = require("../controllers/projectController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send({ success: true });
});

router.get("/:projectId/versions", projectController.getAllVersions);
router.get("/:projectId/pages", projectController.getCommonPages);

module.exports = router;
