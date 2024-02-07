const Document = require("../models/Document");

const getDocument = async (projectKey, versionId) => {
  const document = await Document.findOne({
    projectKey,
    versionId,
  });

  return document;
};

module.exports = getDocument;
