const comparePages = (beforePages, afterPages) => {
  const afterPageIdList = Array.from(afterPages.keys());

  const commonPageList = [];

  for (const afterPageId of afterPageIdList) {
    if (beforePages.get(afterPageId)) {
      commonPageList.push({
        pageId: afterPageId,
        pageName: afterPages.get(afterPageId).name,
      });
    }
  }

  return commonPageList;
};

module.exports = comparePages;
