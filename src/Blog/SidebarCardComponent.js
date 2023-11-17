import PropTypes from "prop-types";

const SidebarCardComponent = (data) => {

  const InnerSidebarContent = (data) => {
    return (
      <>
        {data?.image !== null ? (
          <img src={`https://app-umbraco-multisite-staging.azurewebsites.net/${data?.image[0].url}`} alt={data?.image[0].name} />
        ) : null}
        <div className="wmcads-p-sm">
          <h3>{data.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: data.content.markup }}></div>
        </div>
      </>
    )
  }

  if (data?.link !== null) {

    const url = data?.link[0].url !== null ? data?.link[0].url : `https://app-umbraco-multisite-staging.azurewebsites.net${data?.link[0].route.path}`;

    return (
      <a href={url} target="_self" className="wmcads-content-card sidebar">
        <InnerSidebarContent {...data} />
      </a>
    )
  } else {
    return (
      <div className="wmcads-content-card sidebar">
        <InnerSidebarContent {...data} />
      </div>
    )
  }
}

SidebarCardComponent.propTypes = {
  data: PropTypes.object,
};

export default SidebarCardComponent;
