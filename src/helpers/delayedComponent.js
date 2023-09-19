import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DelayedComponent = ({ children, waitBeforeShow = 200 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);

    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? children : null;
};

DelayedComponent.propTypes = {
    children: PropTypes.node,
    waitBeforeShow: PropTypes.bool,
  };

export default DelayedComponent;