/**
 * Protected Route Component
 * 
 * Wrapper component that ensures user is authenticated before
 * allowing access to protected pages
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/joy';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size="lg" />
        <Typography level="body-md" color="neutral">
          Loading your account...
        </Typography>
      </Box>
    );
  }

  // Redirect to signin if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

// Public route wrapper (redirects authenticated users)
export function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size="lg" />
        <Typography level="body-md" color="neutral">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect authenticated users to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show public content
  return children;
}

// Admin route wrapper (requires admin role)
export function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size="lg" />
        <Typography level="body-md" color="neutral">
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  // Redirect to signin if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and admin, render the protected content
  return children;
}