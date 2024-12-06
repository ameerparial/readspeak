import React from "react";
import { useColor } from "../store/color.state";

const PageNotFound = () => {
  const { settingOptions } = useColor();
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center vh-100 bg-${settingOptions.theme} text-center`}
    >
      {/* Icon Section */}
      <div className="mb-4">
        <i
          className="fas fa-volume-up text-primary"
          style={{ fontSize: "5rem" }}
        ></i>
      </div>

      {/* Heading */}
      <h1 className="display-1 text-danger">404</h1>

      {/* Description */}
      <p className="lead">
        Oops! The page you're looking for doesn't exist. <br />
        Let's get you back to reading aloud!
      </p>

      {/* Home Button */}
      <a href="/" className="btn btn-primary btn-lg mt-3">
        <i className="fas fa-home me-2"></i> Go to Home
      </a>
    </div>
  );
};

export default PageNotFound;
