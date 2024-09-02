import React from "react";
import getAuthor from "../api/getAuthor";
import getAuthorArticles from "../api/getAuthorArticles";
import ScrollToTop from "../helpers/ScrollToTop";
import { useState, useEffect } from "react";
// import BlogBody from "./BlogBody";
import { useNavigate, useLocation }from "react-router-dom";
import Banner from "./Banner";
import Breadcrumb from "./Breadcrumb";
import { Helmet } from "react-helmet";
import formatDate from "../helpers/formatDate";
//import ImageComponent from "./ImageComponent";
import ReactGA from "react-ga4";
//import { object } from "prop-types";

// export async function loader() {
//   console.log("loader");
//   const author = await getAuthor("b7da28a2-4a25-4f0b-b4d3-a563a69adddf");
//   return { author };
// }

const BlogAuthor = () => {
  const location = useLocation();
  const { state } = location;
  const authorUrl = state?.authorUrl || '';
  const [loading, setLoading] = useState(false);
  //console.log(loading);
  
  const [author, setAuthor] = useState([]);
  const [authorArticles, setAuthorArticles] = useState([]);

  const getAuthorData = async () => {
    setLoading(true);
    const response = await getAuthor(authorUrl);
    setAuthor(response);
    setLoading(false);
  };
  
    useEffect(() => {
      getAuthorData();
  }, []);

  const getAuthorsArticles = async () => {
    const response = await getAuthorArticles(authorUrl);
    // Sort the data by date in descending order
    //const sortedData = response.sort((a, b) => new Date(b.date) - new Date(a.date));
    //console.log(sortedData);
    setAuthorArticles(response);
  };
  
  
    // console.log(authorArticles);  
    // console.log(authorArticles.items?.length);

    useEffect(() => {
      getAuthorsArticles();
  }, []);


  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.hash,
      //title: author?.name,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <>
      <Helmet>
        (<title>{author.name}</title>)
      </Helmet>
      <ScrollToTop />
      <Breadcrumb
        // article={article.name}
        current={window?.setTopics?.url}
        name={window?.setTopics?.name}
        parent={window?.setTopics?.breadcrumbs?.breadcrumb[0]}
        parent2={window?.setTopics?.breadcrumbs?.breadcrumb[1]}
        parent3={window?.setTopics?.breadcrumbs?.breadcrumb[2]}
        parent4={window?.setTopics?.breadcrumbs?.breadcrumb[3]}
        parent5={window?.setTopics?.breadcrumbs?.breadcrumb[4]}
        parent6={window?.setTopics?.breadcrumbs?.breadcrumb[5]}
        parent7={window?.setTopics?.breadcrumbs?.breadcrumb[6]}
        parent8={window?.setTopics?.breadcrumbs?.breadcrumb[7]}
      />
      {/* <Banner
        image={window?.setBanner?.bannerimg}
        title={window?.setBanner?.name}
        summary={window?.setBanner?.summary}
        article={true}
      /> */}
      <div className="wmcads-container">
        <main className="wmcads-container--main">
          <div className="wmcads-grid">
            <div className="wmcads-banner-container wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-md-p-r-lg">
              <>
                <div className="wmcads-float-left wmcads-col-1 wmcads-col-sm-1-4 wmcads-m-r-lg">
                {author.properties?.image !== null ? (<img alt={author.name} src={`https://cms-stg.wmca.org.uk${author.properties?.image[0].url}`}/>) : (<></>)}
                </div>
                {/* {author.properties?.image !== null && <img alt={author.name} src={`https://cms-stg.wmca.org.uk${author.properties?.image[0].url}`}/>} */}
                <div className="wmcads-float-left">
                  {author.name && <h1>{author.name}</h1>}
                  {author.properties?.jobTitle !== null ? (<strong>{author.properties?.jobTitle}</strong>) : (<></>)}
                </div>
              </>
            </div>
            <div className="main wmcads-col-1 wmcads-col-md-2-3 wmcads-m-b-md wmcads-p-r-lg">
              <>
                {author.properties?.bio !== null ? (<div className="wmcads-col-1" dangerouslySetInnerHTML={{ __html: author.properties?.bio.markup }} />) : (<></>)}
              </>
            </div>
            <div className="wmcads-col-1 wmcads-col-md-2-3">
              {author.name && <h2>Recent articles written by {author.name}</h2>}
              
              {authorArticles.items?.length ? (
                <div className="wmcads-css-grid-2-col">
                <>
                  {authorArticles.items?.map((article, index) => (
                    <>
                    <div className="wmcads-content-card wmcads-content-card--news">
                    <img alt={article.properties.image[0].name} src={`https://cms.wmca.org.uk${article.properties.image[0].url}?anchor=center&mode=crop&width=600&height=250`}></img>
                    <p>{formatDate(article.properties.date)}</p>
                    <a className="wmcads-link" key={index} href={article.route.path}>{article.name}</a>
                    </div>
                    </>
                  ))}
                </>
                </div>
              ) : null}

              {author.name && <a className="wmcads-link">View more posts written by {author.name}</a>}
            </div>

            {/* Check to not display this div unless there is at least one child list item */}
            {author.properties?.facebook || author.properties?.linkedin || author.properties?.twitter !== null ? (<>
            
              <div className="wmcads-col-1 wmcads-col-md-2-3">
                {author.name && <h3>Follow {author.name} on social media</h3>}
                <ul>
                  {author.properties?.facebook !== null ? (<li><a href={author.properties?.facebook[0].url} target="_blank" rel="noreferrer">Facebook</a></li>) : (<></>)}
                  {author.properties?.linkedin !== null ? (<li><a href={author.properties?.linkedin[0].url} target="_blank" rel="noreferrer">LinkedIn</a></li>) : (<></>)}
                  {author.properties?.twitter !== null ? (<li><a href={author.properties?.twitter[0].url} target="_blank" rel="noreferrer">Twitter</a></li>) : (<></>)}
                </ul> 
              </div>

            </>) : (<></>)}
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogAuthor;
