const searchBlogArticles = (blogArticles, searchTerm) => {
  const searchTermRegex = new RegExp(`\\b${searchTerm}\\b`, "i");
  console.log(blogArticles);
  console.log(searchTerm);

  return blogArticles.filter((blogArticle) =>
    searchTermRegex.test(blogArticle.properties.introduction)
  );
};

export default searchBlogArticles;