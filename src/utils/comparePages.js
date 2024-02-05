function comparePages(beforePages, afterPages) {
  const matchedPages = [];

  beforePages.forEach((beforePage) => {
    const matchedPage = afterPages.find(
      (afterPage) => afterPage.pageId === beforePage.pageId,
    );

    if (matchedPage) {
      matchedPages.push(matchedPage);
    }
  });

  return matchedPages;
}

module.exports = comparePages;
