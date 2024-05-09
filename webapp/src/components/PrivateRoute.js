import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const PrivateRoute = ({ children }) => {
  const user = sessionStorage.getItem('user');

  if (!user) {
    message.warning('Please log in to access this page.');
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
