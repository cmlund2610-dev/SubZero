/**
 * React Router v6 configuration for SubZero with Authentication
 * 
 * Defines routes with lazy loading and authentication protection.
 * Public routes: /signin, /signup
 * Protected routes: / (Home), /clients, /clients/:id, /renewals, /analytics, /data, /account
 * 
 * To add new routes: add route objects to the routes array below
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute, { PublicRoute, AdminRoute } from './components/auth/ProtectedRoute.jsx';

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home.jsx'));
const Clients = lazy(() => import('./pages/Clients.jsx'));
const ClientDetail = lazy(() => import('./pages/ClientDetail.jsx'));
const Renewals = lazy(() => import('./pages/Renewals.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const DataImport = lazy(() => import('./pages/DataImport.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));
const UserManagement = lazy(() => import('./components/UserManagement.jsx'));
const Billing = lazy(() => import('./components/Billing.jsx'));

// Auth components
const Signin = lazy(() => import('./components/auth/Signin.jsx'));
const Signup = lazy(() => import('./components/auth/Signup.jsx'));

// Style guide component
const StyleGuide = lazy(() => import('./components/StyleGuide.jsx'));

export const router = createBrowserRouter([
  // Public auth routes
  {
    path: '/signin',
    element: (
      <PublicRoute>
        <Signin />
      </PublicRoute>
    )
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },
  // Protected app routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'clients',
        element: <Clients />
      },
      {
        path: 'clients/:id',
        element: <ClientDetail />
      },
      {
        path: 'renewals',
        element: <Renewals />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'data',
        element: <DataImport />
      },
      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        )
      },
      {
        path: 'billing',
        element: (
          <AdminRoute>
            <Billing />
          </AdminRoute>
        )
      },
      {
        path: 'styleguide',
        element: <StyleGuide />
      }
    ]
  }
]);