import React from 'react';
import './error.scss';
import {Link} from 'react-router-dom';

const Error = ({ errorCode, errorText }) => {
  return (
    <div className="error-page w-100 h-100 flex-row-nowrap align-items-center">
      <div className="error-content-wrapper position-absolute w-100 text-align-center">
        <div className="error-code">
          { errorCode || 404 }
        </div>
        <div className="error-text">
          { errorText || "Page not found" }
        </div>
        <Link to="/" className="link back-to-home">
          Go to Home Page  
        </Link>
      </div>
    </div>
  );
}

export default Error;