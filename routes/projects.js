const express = require("express");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Hello Projects");
});

router.get("/:projectId/versions", async (req, res, next) => {
  // const { projectId } = req.params;

  const devFileKey = process.env.DEV_FIGMA_TEST_FILE_KEY;

  try {
    const getVersions = await fetch(
      `https://api.figma.com/v1/files/${devFileKey}/versions`,
      {
        method: "GET",
        headers: {
          "X-FIGMA-TOKEN": process.env.DEV_FIGMA_SECRET_TOKEN,
        },
      },
    );

    return res.status(200).send(await getVersions.json());
  } catch (e) {
    next(e);

    return null;
  }
});

module.exports = router;
