import React from 'react';
import ErrorImg from '../assets/images/404error.png';
const ErrorPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <img src={ErrorImg} alt="404 Error Image" className="img-fluid" />
    </div>
  );
};

export default ErrorPage;
