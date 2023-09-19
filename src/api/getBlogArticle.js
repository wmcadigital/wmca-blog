let getBlogEndPoint = "https://app-umbraco-multisite.azurewebsites.net/umbraco/delivery/api/v1/content/item/";

const getBlogArticle = async (id) => {
   console.log(id);
  const response = await fetch(getBlogEndPoint + id + "?expand=property%3Aauthor%2Cimage");
  if (!response.ok) {
     console.log(response.status, response.statusText);
  } else {
     const data = await response.json();
     console.log(data);
     return data;
  }
};

export default getBlogArticle;
