import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RedirectRoute from '../core/redirectRoute/RedirectRoute';
import LoginPage from '../pages/loginPage/LoginPage';
import ProtectedRoute from '../core/protectedRoute/ProtectedRoute';
import AdminHome from '../pages/adminHome/AdminHome';
import AdminDashboard from '../pages/adminDashboard/AdminDashboard';
import Books from '../pages/books/Books';
import Authors from '../pages/authors/Authors';
import Users from '../pages/users/Users';
import Lending from '../pages/lending/Lending';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminHome />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'books',
        element: <Books />,
      },
      {
        path: 'authors',
        element: <Authors />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'lending',
        element: <Lending />,
      },
    ],
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
