// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&filter=author%3A";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&filter=author%3A";
let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&filter=author%3A";
//let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&filter=author%3A"

const apiKey = process.env.REACT_APP_UMBRACO_API_KEY;

const getAuthorArticles = async (id) => {
  const response = await fetch(
    getBlogEndPoint + id + "&skip=0&take=10&fields=properties%5B%24all%5D",
    {
      method: "GET", // or 'POST' or other HTTP methods
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
    }
  );
  const parsedResponse = await response.json();

  return parsedResponse;
};

export default getAuthorArticles;
