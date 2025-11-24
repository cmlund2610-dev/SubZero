/**
 * React Router v6 configuration for subzero with Authentication
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
import Settings from './components/Settings.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

// Define the withSuspense function to wrap components with Suspense
function withSuspense(Component) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}

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
const EmailTemplates = lazy(() => import('./pages/EmailTemplates.jsx'));
const CompanyOverview = lazy(() => import('./pages/CompanyOverview.jsx'));

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
        {withSuspense(Signin)}
      </PublicRoute>
    )
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        {withSuspense(Signup)}
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
        element: withSuspense(Home)
      },
      {
        path: 'clients',
        element: withSuspense(Clients)
      },
      {
        path: 'clients/:id',
        element: withSuspense(ClientDetail)
      },
      {
        path: 'renewals',
        element: withSuspense(Renewals)
      },
      {
        path: 'analytics',
        element: withSuspense(Analytics)
      },
      {
        path: 'data',
        element: withSuspense(DataImport)
      },
      {
        path: 'import',
        element: withSuspense(DataImport)
      },
      {
        path: 'account',
        element: withSuspense(Account)
      },
      {
        path: 'company-overview',
        element: withSuspense(CompanyOverview)
      },
      {
        path: 'profile',
        element: withSuspense(Profile)
      },
      {
        path: 'settings',
        element: withSuspense(Settings)
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            {withSuspense(UserManagement)}
          </AdminRoute>
        )
      },
      {
        path: 'billing',
        element: (
          <AdminRoute>
            {withSuspense(Billing)}
          </AdminRoute>
        )
      },
      {
        path: 'email-templates',
        element: (
          <AdminRoute>
            {withSuspense(EmailTemplates)}
          </AdminRoute>
        )
      },
      {
        path: 'styleguide',
        element: withSuspense(StyleGuide)
      },
    ]
  },
  {
    path: '/email-templates',
    element: withSuspense(EmailTemplates),
  },
]);