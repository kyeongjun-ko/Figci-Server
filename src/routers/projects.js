const express = require("express");

const router = express.Router();

router.get("/", function (req, res) {
  res.status(200).send({ sucess: true });
});

router.get("/:projectId/versions", async (req, res) => {
  const { projectId } = req.params;
  const accessToken = req.headers.authorization;

  if (accessToken) {
    try {
      const getVersions = await fetch(
        `https://api.figma.com/v1/files/${projectId}/versions`,
        {
          method: "GET",
          headers: {
            "X-FIGMA-TOKEN": accessToken,
          },
        },
      );

      const responseJson = await getVersions.json();
      const { status, versions } = responseJson;

      if (status === 400) {
        return res.status(400).send({
          result: "error",
          error: {
            message: "잘못된 사용자 요청입니다. Figma Token을 확인해주세요.",
          },
        });
      }

      if (status === 403) {
        return res.status(403).send({
          result: "error",
          error: {
            message: "인증되지 않은 사용자 ",
          },
        });
      }

      if (status === 404) {
        return res.status(404).send({
          result: "error",
          error: {
            message: "존재하지 않는 피그마 파일입니다. 다시 입력해주세요.",
          },
        });
      }

      if (status === 500) {
        return res.status(500).send({
          result: "error",
          error: {
            message: "프로젝트 용량이 너무 커 응답에 실패했습니다.",
          },
        });
      }

      if (versions.length < 2) {
        return res.status(502).send({
          result: "error",
          error: {
            message: "비교할 수 있는 버전이 없어서 서비스 이용이 불가합니다.",
          },
        });
      }

      return res.status(200).json(responseJson);
    } catch (e) {
      return res.status(500).send({
        result: "error",
        error: {
          message: "피그마 API로부터 응답이 없습니다.",
        },
      });
    }
  } else {
    return res.status(403).send({
      result: "error",
      error: {
        message: "인증되지 않은 사용자입니다.",
      },
    });
  }
});

module.exports = router;
