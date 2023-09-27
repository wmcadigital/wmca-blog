const searchBlogArticles = (blogArticles, searchTerm) => {

  const searchTermRegex = new RegExp(`\\b${searchTerm}`, "i");

  return blogArticles.filter((blogArticle) =>
    searchTermRegex.test(blogArticle.properties.introduction) || searchTermRegex.test(blogArticle.name)
  );
};

export default searchBlogArticles;