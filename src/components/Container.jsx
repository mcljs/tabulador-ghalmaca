import React from "react";
import PropTypes from "prop-types";

const Container = ({ children, className }) => {
  return (
    <div
      className={`relative container max-w-7xl mx-auto px-8  ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
};

export default Container;
