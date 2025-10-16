let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";

const apiKey = process.env.REACT_APP_UMBRACO_API_KEY;

const getBlogArticles = async () => {
  const response = await fetch(getBlogEndPoint, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
  });
  const parsedResponse = await response.json();
  // console.log(parsedResponse, 'parse')

  return parsedResponse;
};

export default getBlogArticles;
