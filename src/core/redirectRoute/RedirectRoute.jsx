import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import config from '../../config/config';

const RedirectRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  if (isAuthenticated && user) {
    if (user?.role === config.adminRole) return <Navigate to="/admin" />;
    else if (user?.role === config.userRole) return <Navigate to="/user" />;
  }

  return children;
};

export default RedirectRoute;
