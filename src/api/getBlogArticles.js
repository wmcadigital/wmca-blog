let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";

const getBlogArticles = async () => {

  const response = await fetch(getBlogEndPoint, {
    method: 'GET', // or 'POST' or other HTTP methods
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': '54191bfa-d83f-4f8d-80ba-54587374b638',
    },
  });
  const parsedResponse = await response.json();
  // console.log(parsedResponse, 'parse')

  return parsedResponse;
};

export default getBlogArticles;
