const { getBucket } = require("../loaders/mongoose");

const convertObjectToMap = require("./convertObjectToMap");

const uploadFigmaJsonToGridFS = (uploadStream, figmaJsonData) => {
  return new Promise((resolve, reject) => {
    uploadStream.write(JSON.stringify(figmaJsonData));

    uploadStream.on("error", (err) => {
      console.error("GridFS upload failed:", err);

      reject(err);
    });

    uploadStream.on("finish", () => {
      resolve();
    });

    uploadStream.end();
  });
};

const downloadStreamToBuffer = (downloadStream) => {
  return new Promise((resolve, reject) => {
    const gridFSFileChunks = [];

    const timeout = setTimeout(() => {
      downloadStream.destroy();

      reject(new Error("GridFS retrieve timeout."));
    }, 60000);

    downloadStream.on("data", (chunk) => {
      gridFSFileChunks.push(chunk);
    });

    downloadStream.on("end", () => {
      const gridFSFileBuffer = Buffer.concat(gridFSFileChunks);

      clearTimeout(timeout);
      resolve(gridFSFileBuffer);
    });

    downloadStream.on("error", (err) => {
      console.error("Error retrieving document from GridFS:", err);

      clearTimeout(timeout);
      reject(err);
    });
  });
};

const getDocumentFromGridFS = async (projectKey, versionId) => {
  const bucket = getBucket();
  const fileName = `${projectKey}_${versionId}.json`;

  const gridFSFiles = await bucket.find({ filename: fileName }).toArray();

  if (gridFSFiles.length === 0) {
    return null;
  }

  try {
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    const gridFSFileBuffer = await downloadStreamToBuffer(downloadStream);

    if (gridFSFileBuffer) {
      const gridFSFileContent = gridFSFileBuffer.toString();
      const gridFSDocument = JSON.parse(gridFSFileContent);
      const convertedDocument = convertObjectToMap(gridFSDocument);

      return convertedDocument;
    }
  } catch (error) {
    console.error("Error retrieving document from GridFS:", error);

    throw error;
  }
  return null;
};

const saveDocumentToGridFS = async (
  flattenFigmaJson,
  projectKey,
  versionId,
) => {
  const bucket = getBucket();
  const fileName = `${projectKey}_${versionId}.json`;

  try {
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: "application/json",
    });

    await uploadFigmaJsonToGridFS(uploadStream, flattenFigmaJson);

    const convertedDocument = convertObjectToMap(flattenFigmaJson);

    return convertedDocument;
  } catch (error) {
    console.error("Error saving document to GridFS:", error);

    throw error;
  }
};

module.exports = { getDocumentFromGridFS, saveDocumentToGridFS };
