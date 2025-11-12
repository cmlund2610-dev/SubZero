/**
 * HelpTooltip - Contextual help component with hover/click interactions
 * 
 * Provides helpful tips and guidance throughout the app interface.
 * Uses Joy UI Tooltip with enhanced styling and accessibility.
 */

import React, { useState } from 'react';
import { 
  Tooltip, 
  IconButton, 
  Typography, 
  Box,
  Button,
  Stack
} from '@mui/joy';
import { 
  HelpOutline, 
  Info, 
  Lightbulb,
  Close
} from '@mui/icons-material';

export default function HelpTooltip({ 
  title, 
  content, 
  variant = 'info',
  placement = 'top',
  size = 'sm',
  trigger = 'hover', // 'hover' | 'click'
  children,
  actionLabel,
  onAction
}) {
  const [open, setOpen] = useState(false);

  const getIcon = () => {
    switch (variant) {
      case 'tip':
        return <Lightbulb sx={{ fontSize: '1rem' }} />;
      case 'info':
      default:
        return <HelpOutline sx={{ fontSize: '1rem' }} />;
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'tip':
        return 'warning';
      case 'info':
      default:
        return 'neutral';
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setOpen(!open);
    }
  };

  const tooltipContent = (
    <Box sx={{ maxWidth: 280, p: 1.5 }}>
      <Stack spacing={1.5}>
        {title && (
          <Typography 
            level="body-sm" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
        )}
        <Typography 
          level="body-xs" 
          sx={{ 
            lineHeight: 1.5,
            color: 'text.primary'
          }}
        >
          {content}
        </Typography>
        {actionLabel && onAction && (
          <Button 
            size="xs" 
            variant="soft" 
            color={getColor()}
            onClick={() => {
              onAction();
              setOpen(false);
            }}
            sx={{ mt: 1, fontSize: '0.75rem' }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );

  if (children) {
    return (
      <Tooltip
        title={tooltipContent}
        placement={placement}
        variant="solid"
        color="neutral"
        open={trigger === 'click' ? open : undefined}
        onClose={trigger === 'click' ? () => setOpen(false) : undefined}
        sx={{
          maxWidth: 'none',
          backgroundColor: 'neutral.800',
          color: 'common.white',
          border: '1px solid',
          borderColor: 'neutral.700',
          boxShadow: 'lg',
          '& .MuiTooltip-arrow': {
            color: 'neutral.800',
          }
        }}
      >
        <Box 
          onClick={handleClick}
          sx={{ 
            cursor: trigger === 'click' ? 'pointer' : 'default',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={tooltipContent}
      placement={placement}
      variant="solid"
      color="neutral"
      open={trigger === 'click' ? open : undefined}
      onClose={trigger === 'click' ? () => setOpen(false) : undefined}
      sx={{
        maxWidth: 'none',
        backgroundColor: 'neutral.800',
        color: 'common.white',
        border: '1px solid',
        borderColor: 'neutral.700',
        boxShadow: 'lg',
        '& .MuiTooltip-arrow': {
          color: 'neutral.800',
        }
      }}
    >
      <IconButton
        size={size}
        variant="plain"
        color={getColor()}
        onClick={handleClick}
        sx={{
          '--IconButton-size': size === 'xs' ? '20px' : size === 'sm' ? '24px' : '32px',
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 1,
            backgroundColor: `${getColor()}.softHoverBg`,
          },
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}

// Helper component for inline help text with icon
export function InlineHelp({ children, variant = 'tip' }) {
  return (
    <HelpTooltip
      content={children}
      variant={variant}
      size="xs"
    />
  );
}

// Helper component for section help headers
export function SectionHelp({ title, children, actionLabel, onAction }) {
  return (
    <HelpTooltip
      title={title}
      content={children}
      variant="info"
      trigger="click"
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}