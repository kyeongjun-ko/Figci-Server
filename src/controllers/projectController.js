/* eslint-disable consistent-return */
const createHttpError = require("http-errors");
const Document = require("../models/Document");

const comparePages = require("../utils/comparePages");
const saveFigmaDataAsNestedStructure = require("../utils/saveFigmaDataAsNestedStructure");
const CONSTANT = require("../constants/constants");
const ERROR_MESSAGE = require("../constants/error");

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
      ERROR_MESSAGE.SERVER_ERROR.status,
      ERROR_MESSAGE.SERVER_ERROR.message,
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
      ERROR_MESSAGE.SERVER_ERROR.status,
      ERROR_MESSAGE.SERVER_ERROR.message,
    );

    next(customError);
  }
};

module.exports = { getAllVersions, getCommonPages };
