import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const PrivateRoute = ({ children, allowedRoles }) => {
  const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    message.warning('Please log in to access this page.');
    return <Navigate to="/login" />;
  }

  if (!Array.isArray(allowedRoles)) {
    console.error('allowedRoles must be an array.');
    return <Navigate to="/" />;
  }

  const userRole = getUserRole(user.role_id);

  if (!allowedRoles.includes(userRole)) {
    message.warning('You do not have permission to view this page.');
    return <Navigate to="/" />;
  }

  return children;
};

const getUserRole = (roleId) => {
  switch (roleId) {
    case 1:
      return 'admin';
    case 2:
      return 'teacher';
    case 3:
      return 'student';
    default:
      return null;
  }
};

export default PrivateRoute;
