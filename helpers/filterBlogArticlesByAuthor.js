const filterBlogArticlesByAuthor = (blogArticles, authorFilter) =>
  blogArticles.filter((article) => {
    let articleAuthor = article.properties.author;
    if (!article.properties.author) {
      articleAuthor = "None";
    }

    let desiredValue = (fruits_quantity, desired_key) => {
      let desiredValue = fruits_quantity.map((element) => element[desired_key]);
      return desiredValue;
    };

    let desired_key = "name";

    let result = desiredValue(articleAuthor, desired_key);

    if (
      result.includes(authorFilter[0]) ||
      result.includes(authorFilter[1]) ||
      result.includes(authorFilter[2]) ||
      result.includes(authorFilter[3]) ||
      result.includes(authorFilter[4]) ||
      result.includes(authorFilter[5]) ||
      result.includes(authorFilter[6]) ||
      result.includes(authorFilter[7]) ||
      result.includes(authorFilter[8]) ||
      result.includes(authorFilter[9]) ||
      result.includes(authorFilter[10])
    ) {
      return true;
    } else {
      return false;
    }
  });

export default filterBlogArticlesByAuthor;
