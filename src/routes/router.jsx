import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RedirectRoute from '../core/redirectRoute/RedirectRoute';
import LoginPage from '../pages/loginPage/LoginPage';
import ProtectedRoute from '../core/protectedRoute/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <div>Hello world!</div>
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
