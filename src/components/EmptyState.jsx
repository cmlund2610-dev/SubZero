/**
 * EmptyState Component - Reusable empty state with illustrations
 * 
 * Provides consistent empty state UI across the application
 * with customizable icons, messages, and action buttons.
 */

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/joy';

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  size = 'medium'
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: '2.5rem',
          titleLevel: 'title-md',
          spacing: 2,
          padding: 2
        };
      case 'large':
        return {
          iconSize: '5rem',
          titleLevel: 'h3',
          spacing: 4,
          padding: 6
        };
      default: // medium
        return {
          iconSize: '3.5rem',
          titleLevel: 'h4',
          spacing: 3,
          padding: 4
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: styles.padding,
        px: 2,
        minHeight: size === 'large' ? 400 : size === 'small' ? 200 : 300
      }}
    >
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            fontSize: styles.iconSize,
            color: 'text.tertiary',
            mb: styles.spacing
          }}
        >
          {icon}
        </Box>
      )}

      {/* Title */}
      <Typography 
        level={styles.titleLevel} 
        sx={{ 
          mb: 1,
          color: 'text.secondary',
          fontWeight: 600
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography 
          level="body-md" 
          color="neutral" 
          sx={{ 
            mb: styles.spacing,
            maxWidth: size === 'large' ? 500 : 400,
            lineHeight: 1.5
          }}
        >
          {description}
        </Typography>
      )}

      {/* Action Buttons */}
      {(actionText || secondaryActionText) && (
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1.5}
          sx={{ mt: 1 }}
        >
          {actionText && onAction && (
            <Button
              size={size === 'small' ? 'sm' : 'md'}
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="outlined"
              size={size === 'small' ? 'sm' : 'md'}
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}