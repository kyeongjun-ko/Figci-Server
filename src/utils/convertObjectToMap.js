const convertObjectToMap = (obj) => {
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map(convertObjectToMap);
    }
    const convertedObj = {};

    for (const key in obj) {
      if (key === "pages" || key === "frames") {
        convertedObj[key] = new Map(
          Object.entries(obj[key]).map(([pageId, pageValue]) => [
            pageId,
            convertObjectToMap(pageValue),
          ]),
        );
      } else if (key === "nodes") {
        convertedObj[key] = new Map(
          Object.entries(obj[key]).map(([nodeId, nodeValue]) => {
            const { frameId, ...rest } = nodeValue;

            return [nodeId, convertObjectToMap(rest)];
          }),
        );
      } else {
        convertedObj[key] = convertObjectToMap(obj[key]);
      }
    }
    return convertedObj;
  }
  return obj;
};

module.exports = convertObjectToMap;
