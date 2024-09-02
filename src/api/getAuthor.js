 let getBlogEndPoint = "https://cms-stg.wmca.org.uk/umbraco/delivery/api/v2/content/item/";
// let getBlogEndPoint = "https://localhost:44353/umbraco/delivery/api/v1/content/item/";
//let getBlogEndPoint = "https://cms.wmca.org.uk/umbraco/delivery/api/v1/content/item/";

const getAuthor = async (id) => {
   const response = await fetch(getBlogEndPoint + id + "?fields=properties%5B%24all%5D", {
      method: 'GET', // or 'POST' or other HTTP methods
      headers: {
         'Content-Type': 'application/json',
         'Api-Key': '54191bfa-d83f-4f8d-80ba-54587374b638',
      },
   });
  if (!response.ok) {
  } else {
     const data = await response.json();
     return data;
  }
};

export default getAuthor;
