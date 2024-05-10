const convertObjectToMap = (gridFSObject) => {
  if (gridFSObject && typeof gridFSObject === "object") {
    if (Array.isArray(gridFSObject)) {
      return gridFSObject.map(convertObjectToMap);
    }
    const convertedObject = {};

    for (const key in gridFSObject) {
      if (key === "pages" || key === "frames" || key === "nodes") {
        const convertedMap = new Map();

        for (const [pageId, pageNodes] of Object.entries(gridFSObject[key])) {
          convertedMap.set(pageId, convertObjectToMap(pageNodes));
          convertedMap[pageId] = convertObjectToMap(pageNodes);
        }

        convertedObject[key] = convertedMap;
      } else {
        convertedObject[key] = convertObjectToMap(gridFSObject[key]);
      }
    }
    return convertedObject;
  }
  return gridFSObject;
};

module.exports = convertObjectToMap;
