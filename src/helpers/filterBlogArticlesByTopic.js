const filterBlogArticlesByTopic = (blogArticles, categoryFilter) =>
  blogArticles.filter((article) => {
    // support both CMS-shaped article.properties.tags (array) and
    // legacy test fixtures like ArticleCategory (string)
    const tags =
      article?.properties?.tags ??
      (article?.ArticleCategory ? [article.ArticleCategory] : undefined);

    const articleCategory = tags || ["None"];

    return categoryFilter.some((cat) => articleCategory.includes(cat));
  });

export default filterBlogArticlesByTopic;
