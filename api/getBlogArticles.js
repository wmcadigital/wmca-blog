let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";

const getBlogArticles = async () => {
  const response = await fetch(getBlogEndPoint);
  const parsedResponse = await response.json();
  console.log(parsedResponse);

  return parsedResponse;
};

export default getBlogArticles;
