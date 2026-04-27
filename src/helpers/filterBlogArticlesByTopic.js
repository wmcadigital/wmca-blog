const filterBlogArticlesByTopic = (blogArticles, categoryFilter) =>
  blogArticles.filter((article) => {
    // support both CMS-shaped article.properties.tags (array) and
    // legacy test fixtures like ArticleCategory (string)
    const tags =
      article?.properties?.tags ??
      (article?.ArticleCategory ? [article.ArticleCategory] : undefined);

    const articleCategory = (tags || ["None"]).map((t) => {
      return typeof t === "string" ? t.trim().toLowerCase() : t;
    });

    // Case-insensitive matching
    return categoryFilter.some((cat) => 
      articleCategory.includes(cat.trim().toLowerCase())
    );
  });

export default filterBlogArticlesByTopic;
