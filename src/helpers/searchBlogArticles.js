const searchBlogArticles = (blogArticles, searchTerm) => {
  const searchTermRegex = new RegExp(`\\b${searchTerm}`, "i");

  return blogArticles.filter((blogArticle) => {
    const intro =
      blogArticle?.properties?.introduction ?? blogArticle?.Introduction ?? "";
    const name = blogArticle?.name ?? blogArticle?.Name ?? "";
    return searchTermRegex.test(intro) || searchTermRegex.test(name);
  });
};

export default searchBlogArticles;
