/**
 * subzero App - Router, Theme Provider, and Authentication
 * 
 * Main application entry point that:
 * - Provides Joy UI theme using subzero brand palette (Coral / Slate / Off-White)
 * - Mounts React Router for navigation
 * - Provides Firebase Authentication context
 * - Enables dark/light mode switching
 * 
 * The router handles all page routing and the AppLayout provides
 * the shell structure with sidebar navigation.
 */

import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { RouterProvider } from 'react-router-dom';

// Import theme, router, and auth configuration
import theme from './assets/theme.js';
import { router } from './router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

export default function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CssVarsProvider>
  );
}