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

// Predefined empty state variations
export const EmptyStates = {
  NoClients: (props) => (
    <EmptyState
      icon="👥"
      title="No Clients Yet"
      description="Start by importing your client data or adding clients manually to see insights and analytics."
      actionText="Import Data"
      secondaryActionText="Learn More"
      {...props}
    />
  ),

  NoData: (props) => (
    <EmptyState
      icon="📊"
      title="No Data Available"
      description="Import your client data to unlock powerful analytics and insights."
      actionText="Import Now"
      {...props}
    />
  ),

  NoRenewals: (props) => (
    <EmptyState
      icon="📅"
      title="No Upcoming Renewals"
      description="Great! You don't have any contract renewals due in the near future."
      size="small"
      {...props}
    />
  ),

  NoWidgets: (props) => (
    <EmptyState
      icon="🧩"
      title="No Widgets Added"
      description="Add analytics widgets to visualize your client data and track key metrics."
      actionText="Add Widget"
      {...props}
    />
  ),

  NoWebhooks: (props) => (
    <EmptyState
      icon="🔗"
      title="No Webhooks Configured"
      description="Set up webhooks to receive real-time notifications about client health changes and renewals."
      actionText="Add Webhook"
      {...props}
    />
  ),

  GetStarted: (props) => (
    <EmptyState
      icon="🚀"
  title="Welcome to SubZero!"
      description="Get started by importing your client data to unlock powerful customer success insights and analytics."
      actionText="Import Client Data"
      secondaryActionText="View Demo"
      size="large"
      {...props}
    />
  ),

  SearchEmpty: (props) => (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description="Try adjusting your search criteria or filters to find what you're looking for."
      size="small"
      {...props}
    />
  ),

  Error: (props) => (
    <EmptyState
      icon="⚠️"
      title="Something Went Wrong"
      description="There was an error loading this content. Please try refreshing the page."
      actionText="Refresh"
      size="small"
      {...props}
    />
  )
};