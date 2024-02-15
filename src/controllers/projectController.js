const createHttpError = require("http-errors");
const Document = require("../models/Document");

const comparePages = require("../utils/comparePages");
const flattenFigmaSubtree = require("../utils/flattenFigmaSubtree");
const getDiffing = require("../utils/getDiffing");
const getDocument = require("../utils/getDocument");
const CONSTANT = require("../constants/constants");
const ERROR = require("../constants/error");

const getAllVersions = async (req, res, next) => {
  const { projectId: projectKey } = req.params;
  const accessToken = req.headers.authorization;

  try {
    const getVersions = await fetch(
      `https://api.figma.com/v1/files/${projectKey}/versions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const responseJson = await getVersions.json();

    if (responseJson.status === 403) {
      return res.status(200).json({
        result: "error",
        status: 403,
        message: "Invalid Token",
      });
    }

    const { versions } = responseJson;

    if (versions.length < CONSTANT.COMPARABLE_VERSION_NUMBER) {
      return res.status(200).json({
        result: "error",
        status: 204,
        message: "해당 파일은 비교할 수 있는 버전이 없어요.",
      });
    }

    res.status(200).json({
      result: "success",
      status: 200,
      content: versions,
    });
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

const getCommonPages = async (req, res, next) => {
  const { projectId: projectKey } = req.params;
  const accessToken = req.headers.authorization;
  const beforeVersionId = req.query["before-version"];
  const afterVersionId = req.query["after-version"];

  const fetchFigmaData = async (projectKey, versionId) => {
    const figmaUrl = `https://api.figma.com/v1/files/${projectKey}?version=${versionId}`;

    const responseJson = await fetch(figmaUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const projectVersionSubtree = await responseJson.json();

    return projectVersionSubtree;
  };

  const createDocument = async (projectKey, versionId) => {
    const figmaData = await fetchFigmaData(projectKey, versionId);

    const document = flattenFigmaSubtree(figmaData.document);

    document.projectKey = projectKey;
    document.versionId = versionId;

    const flattenedDocument = await Document.create(document);

    return flattenedDocument;
  };

  try {
    const beforeDocument =
      (await getDocument(projectKey, beforeVersionId)) ||
      (await createDocument(projectKey, beforeVersionId));

    const afterDocument =
      (await getDocument(projectKey, afterVersionId)) ||
      (await createDocument(projectKey, afterVersionId));

    const matchedPages = comparePages(
      beforeDocument.pages,
      afterDocument.pages,
    );

    res.status(200).json({
      result: "success",
      status: 200,
      content: matchedPages,
    });
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

const createDiffingResult = async (
  projectKey,
  beforeVersionId,
  afterVersionId,
  pageId,
) => {
  const beforeDocument = await getDocument(projectKey, beforeVersionId);
  const afterDocument = await getDocument(projectKey, afterVersionId);

  const beforeFrameList = beforeDocument.pages.get(pageId).frames;
  const afterFrameList = afterDocument.pages.get(pageId).frames;

  const diffingResult = {
    projectKey,
    beforeVersionId,
    afterVersionId,
    pageId,
    frames: {},
    differences: {},
  };

  await getDiffing(beforeFrameList, afterFrameList, diffingResult);

  return diffingResult;
};

const getDiffingResult = async (req, res, next) => {
  const { projectId: projectKey, pageId } = req.params;
  const beforeVersionId = req.query["before-version"];
  const afterVersionId = req.query["after-version"];

  try {
    const diffingResult = await createDiffingResult(
      projectKey,
      beforeVersionId,
      afterVersionId,
      pageId,
    );

    const frameIdList = Object.keys(diffingResult.frames);

    if (!frameIdList.length) {
      return res.status(200).json({
        result: "error",
        status: 204,
        message: "해당 페이지는 차이점이 없어요.",
      });
    }

    res.status(200).json({
      result: "success",
      status: 200,
      content: diffingResult,
    });
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

module.exports = { getAllVersions, getCommonPages, getDiffingResult };
