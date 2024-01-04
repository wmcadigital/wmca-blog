import PropTypes from "prop-types";

const VideoComponent = ({ url }) => {

  // get id from url
  let ID = '';
  function YouTubeGetID(url){
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }

  YouTubeGetID(url);

  return (
  <div className='wmcads-video-embed'>
    {url}
    <iframe src={`https://www.youtube.com/embed/${ID}`} title="video" frameBorder='0' allowFullScreen={true}></iframe>
  </div>
  )
  };

VideoComponent.propTypes = {
  url: PropTypes.string,
};

export default VideoComponent;
