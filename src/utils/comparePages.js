const comparePages = (beforePages, afterPages) => {
  let afterPageIdList = [];

  if (afterPages instanceof Map) {
    afterPageIdList = Array.from(afterPages.keys());
  } else if (typeof afterPages === "object") {
    afterPageIdList = Object.keys(afterPages);
  }

  const commonPageList = [];

  for (const afterPageId of afterPageIdList) {
    if (beforePages instanceof Map && beforePages.has(afterPageId)) {
      commonPageList.push({
        pageId: afterPageId,
        pageName:
          afterPages instanceof Map
            ? afterPages.get(afterPageId).name
            : afterPages[afterPageId].name,
      });
    } else if (typeof beforePages === "object" && beforePages[afterPageId]) {
      commonPageList.push({
        pageId: afterPageId,
        pageName:
          afterPages instanceof Map
            ? afterPages.get(afterPageId).name
            : afterPages[afterPageId].name,
      });
    }
  }

  return commonPageList;
};

module.exports = comparePages;
