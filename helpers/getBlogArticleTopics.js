const getBlogArticleTopics = (blogArticles) => {
  const categorySet = new Set();
  blogArticles.forEach((article) => {
    if (article.properties.tags) {
      article.properties.tags.forEach((tag) => {
        categorySet.add(tag);
      });
    } else {
      categorySet.add("None");
    }
  });
  const sortedBlogTopics = Array.from(categorySet).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });

  return sortedBlogTopics;
};

export default getBlogArticleTopics;
