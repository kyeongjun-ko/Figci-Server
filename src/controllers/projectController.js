/* eslint-disable consistent-return */
const Document = require("../models/Document");

const comparePages = require("../utils/comparePages");
const saveFigmaDataAsNestedStructure = require("../utils/saveFigmaDataAsNestedStructure");
const CONSTANT = require("../constants/constants");

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
      return res.status(502).send({
        error: "해당 파일은 비교할 수 있는 버전이 없어요.",
      });
    }

    res.status(200).json(responseJson);
  } catch (err) {
    next(err);
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
    const data = await responseJson.json();

    return data;
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
    next(err);
  }
};

module.exports = { getAllVersions, getCommonPages };
