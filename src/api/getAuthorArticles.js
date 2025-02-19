// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
let getBlogEndPoint =
  "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=500";
//let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content?filter=author%e1f248a6-239c-42b1-8521-f690629e88c6&skip=0&take=10&fields=properties%5B%24all%5D"
// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content?filter=author%3A"

const getAuthorArticles = async (id) => {
  const response = await fetch(
    getBlogEndPoint + id + "&skip=0&take=10&fields=properties%5B%24all%5D",
    {
      method: "GET", // or 'POST' or other HTTP methods
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "54191bfa-d83f-4f8d-80ba-54587374b638",
      },
    }
  );
  const parsedResponse = await response.json();

  return parsedResponse;
};

export default getAuthorArticles;
