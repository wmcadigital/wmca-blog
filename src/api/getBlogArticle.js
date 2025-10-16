// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content/item/";
let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content/item/";

const apiKey = process.env.REACT_APP_UMBRACO_API_KEY;

const getBlogArticle = async (id) => {
  const response = await fetch(
    getBlogEndPoint +
      "%2Fblog%2F" +
      id +
      "?expand=properties%5Bauthor%5D&fields=properties%5B%24all%5D",
    {
      method: "GET", // or 'POST' or other HTTP methods
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
    }
  );
  if (!response.ok) {
    console.log(response.status, response.statusText);
  } else {
    const data = await response.json();
    return data;
  }
};

export default getBlogArticle;
