const { getBucket } = require("../loaders/mongoose");

const convertObjectToMap = require("./convertObjectToMap");
const logMemoryUsage = require("./logMemoryUsage");

const uploadStreamToGridFS = (uploadStream, figmaJsonData) => {
  return new Promise((resolve) => {
    uploadStream.write(JSON.stringify(figmaJsonData));

    uploadStream.on("finish", () => {
      resolve(figmaJsonData);
    });

    uploadStream.end();

    uploadStream.on("error", (err) => {
      console.error("GridFS upload failed:", err);

      resolve(null);
    });
  });
};

const downloadStreamToBuffer = (downloadStream) => {
  return new Promise((resolve) => {
    const gridFSFileChunks = [];

    downloadStream.on("data", (chunk) => {
      gridFSFileChunks.push(chunk);
    });

    downloadStream.on("end", () => {
      const gridFSFileBuffer = Buffer.concat(gridFSFileChunks);

      resolve(gridFSFileBuffer);
    });

    downloadStream.on("error", (err) => {
      console.error("Error retrieving document from GridFS:", err.message);

      resolve(null);
    });
  });
};

const getDocumentFromGridFS = async (projectKey, versionId) => {
  logMemoryUsage("Get GridFS File - Start");

  const bucket = getBucket();
  const fileName = `${projectKey}_${versionId}.json`;

  const downloadStream = bucket.openDownloadStreamByName(fileName);

  const gridFSFileBuffer = await downloadStreamToBuffer(downloadStream);

  if (!gridFSFileBuffer) {
    return null;
  }

  const gridFSFileContent = gridFSFileBuffer.toString();
  const gridFSDocument = JSON.parse(gridFSFileContent);
  const convertedDocument = convertObjectToMap(gridFSDocument);

  logMemoryUsage("Get GridFS File - End");

  return convertedDocument;
};

const saveDocumentToGridFS = async (flattenFigmaJson) => {
  logMemoryUsage("Save GridFS File - Start");

  const bucket = getBucket();

  const fileName = `${flattenFigmaJson.projectKey}_${flattenFigmaJson.versionId}.json`;

  const uploadStream = bucket.openUploadStream(fileName, {
    contentType: "application/json",
  });

  const savedGridFSObject = await uploadStreamToGridFS(
    uploadStream,
    flattenFigmaJson,
  );

  if (!savedGridFSObject) {
    return null;
  }

  const convertedDocument = convertObjectToMap(savedGridFSObject);

  logMemoryUsage("Save GridFS File - End");

  return convertedDocument;
};

module.exports = { getDocumentFromGridFS, saveDocumentToGridFS };
