const filterBlogArticlesByTopic = (blogArticles, categoryFilter) =>
  blogArticles.filter((article) => {
    let articleCategory = article.properties.tags;
    if (!article.properties.tags) {
      articleCategory = "None";
    }

    if (
      articleCategory.includes(categoryFilter[0]) ||
      articleCategory.includes(categoryFilter[1]) ||
      articleCategory.includes(categoryFilter[2]) ||
      articleCategory.includes(categoryFilter[3]) ||
      articleCategory.includes(categoryFilter[4]) ||
      articleCategory.includes(categoryFilter[5]) ||
      articleCategory.includes(categoryFilter[6]) ||
      articleCategory.includes(categoryFilter[7]) ||
      articleCategory.includes(categoryFilter[8]) ||
      articleCategory.includes(categoryFilter[9]) ||
      articleCategory.includes(categoryFilter[10])
    ) {
      return true;
    } else {
      return false;
    }
  });

export default filterBlogArticlesByTopic;
