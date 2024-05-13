const Document = require("../models/Document");
const { getDocumentFromGridFS } = require("./gridfsUtils");

const getDocument = async (projectKey, versionId) => {
  const document = await Document.findOne({
    projectKey,
    versionId,
  });

  if (document) {
    return document;
  }

  const documentFromGridFS = await getDocumentFromGridFS(projectKey, versionId);

  return documentFromGridFS;
};

module.exports = getDocument;
