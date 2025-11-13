/**
 * AppLayout - Main application layout with CoreUI sidebar
 * 
 * Features unfoldable sidebar navigation with categories and items
 * Uses CoreUI React components for robust sidebar functionality
 */

import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/joy';
import Sidebar from '../components/Sidebar.jsx';
import '@coreui/coreui/dist/css/coreui.min.css';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* CoreUI Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        ml: 'auto'
      }}>
        {/* Page content with suspense for lazy loading */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            px: 3,
            py: 3,
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, transparent 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 109, 86, 0.06) 1px, transparent 0)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              zIndex: 0
            }
          }}
        >
          <Box sx={{ maxWidth: 1120, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Suspense 
              fallback={
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px' 
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}