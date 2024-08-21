import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RedirectRoute from '../core/redirectRoute/RedirectRoute';
import LoginPage from '../pages/loginPage/LoginPage';
import ProtectedRoute from '../core/protectedRoute/ProtectedRoute';
import AdminHome from '../pages/adminHome/AdminHome';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <RedirectRoute>
        <LoginPage />
      </RedirectRoute>
    ),
  },
]);

export default router;
