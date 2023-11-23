// let getBlogEndPoint = "https://app-umbraco-multisite.azurewebsites.net/umbraco/delivery/api/v1/content/item/";
let getBlogEndPoint = "https://app-umbraco-multisite-staging.azurewebsites.net/umbraco/delivery/api/v1/content/item/";

const getBlogArticle = async (id) => {
   
   const response = await fetch(getBlogEndPoint + "%2Fblog%2F" + id + "?expand=property%3Aauthor%2Cimage", {
      method: 'GET', // or 'POST' or other HTTP methods
      headers: {
         'Content-Type': 'application/json',
         'Api-Key': '54191bfa-d83f-4f8d-80ba-54587374b638',
      },
   });
  if (!response.ok) {
     console.log(response.status, response.statusText);
  } else {
     const data = await response.json();
   //   console.log(data);
     return data;
  }
};

export default getBlogArticle;
