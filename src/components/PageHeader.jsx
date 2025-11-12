/**
 * PageHeader Component - Standardized page header for all pages
 * 
 * Provides consistent layout and styling for page headers across the application.
 * Includes title, description, and optional action buttons.
 */

import React from 'react';
import { Box, Typography, Stack } from '@mui/joy';

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon,
  children,
  actions
}) => {
  return (
    <Box sx={{ mb: 4, px: 0 }}>
      {/* Title and Icon */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography 
          level="h2" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 600
          }}
        >
          {Icon && (
            typeof Icon === 'function' ? 
              <Icon size={32} /> : // Lucide React icon
              <Icon sx={{ fontSize: '2rem' }} /> // MUI icon
          )}
          {title}
        </Typography>
        
        {/* Action buttons */}
        {actions && (
          <Stack direction="row" spacing={2}>
            {actions}
          </Stack>
        )}
      </Stack>

      {/* Description */}
      {description && (
        <Typography level="body-lg" color="neutral" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      {/* Additional content */}
      {children}
    </Box>
  );
};

export default PageHeader;