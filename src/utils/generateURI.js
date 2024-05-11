const isOwnProperty = require("./isOwnProperty");

const generateApiUri = (baseUri, endpoint, queryParams) => {
  const apiUri = new URL(endpoint, baseUri);

  if (queryParams) {
    for (const key in queryParams) {
      if (isOwnProperty(queryParams, key)) {
        apiUri.searchParams.append(key, queryParams[key]);
      }
    }
  }

  return apiUri.toString();
};

module.exports = generateApiUri;
