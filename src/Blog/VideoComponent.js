import PropTypes from "prop-types";

const VideoComponent = ({ url }) => (
  <div className='wmcads-video-embed'>
    <iframe src={`https://www.youtube.com/embed/${url}`} title="video" frameBorder='0' allowfullscreen={true}></iframe>
  </div>
);

VideoComponent.propTypes = {
  url: PropTypes.string,
};

export default VideoComponent;
