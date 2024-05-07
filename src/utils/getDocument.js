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

  try {
    const documentFromGridFS = await getDocumentFromGridFS(
      projectKey,
      versionId,
    );

    return documentFromGridFS;
  } catch (err) {
    console.error(err.message);

    throw new Error(err);
  }
};

module.exports = getDocument;
