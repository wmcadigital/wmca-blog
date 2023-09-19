const sortBlogArticles = (blogArticles, ascending) => {
  if (ascending) {
    return blogArticles.sort((blogArticleA, blogArticleB) => {
      if (blogArticleA.properties.date < blogArticleB.properties.date) {
        return -1;
      }
      if (blogArticleA.properties.date > blogArticleB.properties.date) {
        return 1;
      }
      return 0;
    });
  }
  if (name) {
    return blogArticles.sort();
  }
  return blogArticles.sort((blogArticleA, blogArticleB) => {
    if (blogArticleA.properties.date > blogArticleB.properties.date) {
      return -1;
    }
    if (blogArticleA.properties.date < blogArticleB.properties.date) {
      return 1;
    }
    return 0;
  });
};

export default sortBlogArticles;
