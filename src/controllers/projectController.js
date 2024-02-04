const Document = require("../models/Document");

const comparePages = require("../utils/comparePages");
const saveFigmaDataAsNestedStructure = require("../utils/saveFigmaDataAsNestedStructure");

exports.getAllVersions = async function (req, res) {
  const { projectId } = req.params;
  const accessToken = req.headers.authorization;

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
          message: "인증되지 않은 사용자입니다.",
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
  } catch (err) {
    return res.status(500).send({
      result: "error",
      error: {
        message: "피그마 API로부터 응답이 없습니다.",
      },
    });
  }
};

exports.getCommonPages = async function (req, res) {
  const { projectId } = req.params;
  const accessToken = req.headers.authorization;
  const beforeVersion = req.query["before-version"];
  const afterVersion = req.query["after-version"];

  async function fetchFigmaData(projectKey, versionId) {
    const figmaUrl = `https://api.figma.com/v1/files/${projectKey}?version=${versionId}`;

    const responseJson = await fetch(figmaUrl, {
      method: "GET",
      headers: {
        "X-FIGMA-TOKEN": accessToken,
      },
    });
    const data = await responseJson.json();

    return data;
  }

  async function getDocument(projectKey, versionId) {
    const document = await Document.findOne({
      projectKey,
      versionId,
    });

    return document;
  }

  async function createDocument(projectKey, versionId) {
    const figmaData = await fetchFigmaData(projectKey, versionId);
    let document = await saveFigmaDataAsNestedStructure(
      figmaData.document,
      null,
      0,
    );

    document.projectKey = projectKey;
    document.versionId = versionId;

    document = await Document.create(document);

    return document;
  }

  try {
    let beforeDocument = await getDocument(projectId, beforeVersion);
    let afterDocument = await getDocument(projectId, afterVersion);

    if (!beforeDocument) {
      beforeDocument = await createDocument(projectId, beforeVersion);
    }

    if (!afterDocument) {
      afterDocument = await createDocument(projectId, afterVersion);
    }

    const matchedPages = comparePages(
      beforeDocument.pages,
      afterDocument.pages,
    );

    return res.status(200).json(matchedPages);
  } catch (err) {
    return res.status(500).send({
      result: "error",
      error: {
        message: "피그마 API로부터 응답이 없습니다.",
      },
    });
  }
};
