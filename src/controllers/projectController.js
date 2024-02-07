const createHttpError = require("http-errors");
const Document = require("../models/Document");
const Result = require("../models/Result");

const comparePages = require("../utils/comparePages");
const saveFigmaDataAsNestedStructure = require("../utils/saveFigmaDataAsNestedStructure");
const getDiffing = require("../utils/getDiffing");
const CONSTANT = require("../constants/constants");
const ERROR = require("../constants/error");

const getAllVersions = async (req, res, next) => {
  const { projectId } = req.params;
  const accessToken = req.headers.authorization;

  try {
    const getVersions = await fetch(
      `https://api.figma.com/v1/files/${projectId}/versions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const responseJson = await getVersions.json();
    const { versions } = responseJson;

    if (versions.length < CONSTANT.NO_PREVIOUS_VERSIONS) {
      return res.json({
        result: "error",
        status: 502,
        message: "해당 파일은 비교할 수 있는 버전이 없어요.",
      });
    }

    res.status(200).json(responseJson);
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

const getCommonPages = async (req, res, next) => {
  const { projectId } = req.params;
  const accessToken = req.headers.authorization;
  const beforeVersion = req.query["before-version"];
  const afterVersion = req.query["after-version"];

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

  const getDocument = async (projectKey, versionId) => {
    const document = await Document.findOne({
      projectKey,
      versionId,
    });

    return document;
  };

  const createDocument = async (projectKey, versionId) => {
    const figmaData = await fetchFigmaData(projectKey, versionId);

    const document = await saveFigmaDataAsNestedStructure(
      figmaData.document,
      null,
      0,
    );

    document.projectKey = projectKey;
    document.versionId = versionId;

    const flattenedDocument = await Document.create(document);

    return flattenedDocument;
  };

  try {
    const beforeDocument =
      (await getDocument(projectId, beforeVersion)) ||
      (await createDocument(projectId, beforeVersion));

    const afterDocument =
      (await getDocument(projectId, afterVersion)) ||
      (await createDocument(projectId, afterVersion));

    const matchedPages = comparePages(
      beforeDocument.pages,
      afterDocument.pages,
    );

    res.status(200).json(matchedPages);
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

const getStoredDiffingResult = async (
  projectKey,
  beforeVersionId,
  afterVersionId,
  pageId,
) => {
  const storedDiffingResult = await Result.findOne({
    projectKey,
    beforeVersionId,
    afterVersionId,
    pageId,
  });

  return storedDiffingResult;
};

const createDiffingResult = async (
  projectKey,
  beforeVersionId,
  afterVersionId,
  pageId,
) => {
  const getDocument = async (projectKey, versionId) => {
    const document = await Document.findOne({
      projectKey,
      versionId,
    });

    return document;
  };

  const beforeDocument = await getDocument(projectKey, beforeVersionId);
  const afterDocument = await getDocument(projectKey, afterVersionId);

  const beforeFrameList = beforeDocument.pages.get(pageId).frames;
  const afterFrameList = afterDocument.pages.get(pageId).frames;

  const diffingResult = {
    projectKey,
    beforeVersionId,
    afterVersionId,
    pageId,
    frames: new Set(),
    differences: {},
  };

  await getDiffing(beforeFrameList, afterFrameList, diffingResult);

  const diffingInstance = await Result.create(diffingResult);

  return diffingInstance;
};

const getModifiedFrame = async (projectKey, versionId, pageId, frameId) => {
  const modifiedDocument = await Document.findOne({
    projectKey,
    versionId,
  });

  const modifiedPage = modifiedDocument.pages.get(pageId);
  const modifiedFrame = modifiedPage.frames.get(frameId);

  return modifiedFrame;
};

const getDiffingResult = async (req, res, next) => {
  const { projectId: projectKey, pageId } = req.params;
  const beforeVersionId = req.query["before-version"];
  const afterVersionId = req.query["after-version"];

  try {
    const diffingResult =
      (await getStoredDiffingResult(
        projectKey,
        beforeVersionId,
        afterVersionId,
        pageId,
      )) ||
      (await createDiffingResult(
        projectKey,
        beforeVersionId,
        afterVersionId,
        pageId,
      ));

    const modifiedFrameIdList = diffingResult.frames;
    diffingResult.frames = [];

    for (const modifiedFrameId of modifiedFrameIdList) {
      const modifiedFrame = await getModifiedFrame(
        projectKey,
        afterVersionId,
        pageId,
        modifiedFrameId,
      );

      diffingResult.frames.push(modifiedFrame);
    }

    res.status(200).json(diffingResult);
  } catch (err) {
    const customError = createHttpError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
};

module.exports = { getAllVersions, getCommonPages, getDiffingResult };
