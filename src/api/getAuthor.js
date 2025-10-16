// let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content/item/";
let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/%2Fauthors%2Fmaisie-edmond?fields=properties%5B%24all%5D

const apiKey = process.env.REACT_APP_UMBRACO_API_KEY;

const getAuthor = async (id) => {
  const response = await fetch(
    getBlogEndPoint + "%2Fauthors%2F" + id + "?fields=properties%5B%24all%5D",
    {
      method: "GET", // or 'POST' or other HTTP methods
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
    }
  );
  if (!response.ok) {
    console.log("error getting author details");
    const data = "Not found";
    // console.log(data);
    return data;
  } else {
    const data = await response.json();
    // console.log(data);
    return data;
  }
};

export default getAuthor;
