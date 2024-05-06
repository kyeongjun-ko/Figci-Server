const ERROR_PATTERNS = {
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
  },
  SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
  SIZE_ERROR: {
    status: 500,
    message: "Can't access Figma info; file too large.🥲",
  },
  GRIDFS_ERROR: {
    status: 500,
    message: "GridFS error",
  },
  GRIDFS_UPLOAD_ERROR: {
    status: 500,
    message: "GridFS File upload failed",
  },
  DOCUMENT_NOT_FOUND: {
    status: 404,
    message: "Document not found",
  },
};

module.exports = ERROR_PATTERNS;
