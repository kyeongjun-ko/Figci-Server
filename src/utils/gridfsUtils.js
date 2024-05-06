const { getBucket } = require("../loaders/mongoose");
const convertObjectToMap = require("./convertObjectToMap");

const ERROR = require("../constants/error");

const getDocumentFromGridFS = async (projectKey, versionId) => {
  const bucket = getBucket();
  const fileName = `${projectKey}_${versionId}.json`;

  const gridFSFiles = await bucket.find({ filename: fileName }).toArray();
  const fileExists = gridFSFiles.length > 0;

  if (!fileExists) {
    return null;
  }

  const downloadStream = bucket.openDownloadStreamByName(fileName);

  const gridFSFileBuffer = await new Promise((resolve) => {
    const gridFSFileChunks = [];

    downloadStream.on("data", (chunk) => {
      gridFSFileChunks.push(chunk);
    });

    downloadStream.once("end", () => {
      resolve(Buffer.concat(gridFSFileChunks));
    });

    downloadStream.once("error", (err) => {
      console.error("Error retrieving document from GridFS:", err);

      resolve(null);
    });
  });

  if (gridFSFileBuffer === null) {
    return null;
  }

  const gridFSFileContent = gridFSFileBuffer.toString();
  const gridFSDocument = JSON.parse(gridFSFileContent);
  const convertedDocument = convertObjectToMap(gridFSDocument);

  return convertedDocument;
};

const saveDocumentToGridFS = async (
  flattenFigmaJson,
  projectKey,
  versionId,
) => {
  const bucket = getBucket();
  const fileName = `${projectKey}_${versionId}.json`;

  const uploadStream = bucket.openUploadStream(fileName, {
    contentType: "application/json",
  });

  uploadStream.write(JSON.stringify(flattenFigmaJson));

  await new Promise((resolve, reject) => {
    uploadStream.once("error", (err) => {
      console.error("Upload failed:", err);
      reject(err);
    });

    uploadStream.once("finish", resolve);
    uploadStream.end();
  });

  const uploadedFiles = await bucket.find({ filename: fileName }).toArray();

  if (uploadedFiles.length > 0) {
    const savedGridFSDocument = await getDocumentFromGridFS(
      projectKey,
      versionId,
    );

    return savedGridFSDocument;
  }
  throw new Error(ERROR.GRIDFS_UPLOAD_ERROR.message);
};

module.exports = { getDocumentFromGridFS, saveDocumentToGridFS };
