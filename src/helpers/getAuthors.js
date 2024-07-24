const getAuthors = (blogArticles) => {
  const categorySet = new Set();
  blogArticles.forEach((article) => {
    var nullCheck = article.properties.author !== null;
    var emptyArryCheck = article.properties.author?.length !== 0;

    // if author is not null or empty array add to categorySet
    if (nullCheck && emptyArryCheck) {
      const authors = article.properties.author.map(authors => authors.name); // get all author name
      authors.forEach(item => categorySet.add(item)); // add each author to the categorySet
    } else {
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
