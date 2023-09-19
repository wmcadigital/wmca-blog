const getAuthors = (blogArticles) => {
  const categorySet = new Set();
  blogArticles.forEach((article) => {
    // console.log(article);
    // console.log(article.properties.author[0].name);
    if (article.properties.author) {
      // console.log('test yes');
        categorySet.add(article.properties.author[0].name);
    } else {
      // console.log('test no');
      categorySet.add("None");
    }
  });
  const sortedBlogAuthors = Array.from(categorySet).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });

  return sortedBlogAuthors;
};

export default getAuthors;
