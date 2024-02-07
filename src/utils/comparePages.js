const comparePages = (beforePages, afterPages) => {
  const beforePageIdList = Array.from(beforePages.keys());
  const afterPageIdList = Array.from(afterPages.keys());

  return beforePageIdList.map((beforePageId) => {
    if (afterPageIdList.includes(beforePageId)) {
      return {
        pageId: beforePageId,
        pageName: beforePages.get(beforePageId).name,
      };
    }
  });
};

module.exports = comparePages;
