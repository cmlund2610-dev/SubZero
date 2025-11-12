/**
 * QuickActions - Interactive dashboard action card component
 * 
 * Displays functional quick action buttons with real navigation and interactions.
 * Features animated buttons and gradient styling.
 * 
 * Actions include data import, analytics navigation, and account settings.
 */

import { Card, Typography, Button, Stack, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, Analytics, Settings, Add } from '@mui/icons-material';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Import Client Data',
      icon: <CloudUpload />,
      action: () => navigate('/data'),
      color: 'primary',
      variant: 'solid',
      gradient: true
    },
    {
      label: 'View Analytics',
      icon: <Analytics />,
      action: () => navigate('/analytics'),
      color: 'neutral',
      variant: 'outlined'
    },
    {
      label: 'Account Settings',
      icon: <Settings />,
      action: () => navigate('/account'),
      color: 'neutral', 
      variant: 'outlined'
    },
    {
      label: 'Add Widget',
      icon: <Add />,
      action: () => {
        // Scroll to analytics page where widgets can be added
        navigate('/analytics');
        setTimeout(() => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 100);
      },
      color: 'neutral',
      variant: 'outlined'
    }
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        height: '100%',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={3} sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Typography
            level="title-lg"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4338CA, #7C3AED)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Quick Actions
          </Typography>
          
          <Typography level="body-sm" color="neutral">
            Jump into key tasks and features to maximize your customer success impact.
          </Typography>
        </Stack>

        <Stack spacing={2} sx={{ flex: 1 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="md"
              variant={action.variant}
              color={action.color}
              onClick={action.action}
              startDecorator={action.icon}
              sx={{
                py: 1.5,
                justifyContent: 'flex-start',
                fontWeight: 600,
                ...(action.gradient && {
                  background: 'linear-gradient(45deg, #4338CA, #7C3AED)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3730A3, #6D28D9)',
                  },
                }),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>

        {/* Enhanced tip */}
        <Box
          sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: 'success.200',
          }}
        >
          <Typography level="body-xs" color="success" sx={{ fontWeight: 600 }}>
            🎯 <strong>Pro Tip:</strong> Import your data first to unlock personalized insights and health scoring across all features.
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}