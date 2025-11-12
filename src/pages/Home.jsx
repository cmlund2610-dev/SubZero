/**
 * Home Page - Dashboard with client statistics and quick actions
 * 
 * Main dashboard page showing key metrics, quick actions, and upcoming renewals.
 * Uses actual dashboard components: StatsRow, QuickActions, and UpcomingRenewals.
 * 
 * Data flows from localStorage through ImportedData to dashboard components.
 * Shows empty states when no data is present.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

// Import theme and utilities
import { unlocks } from '../lib/metrics.js';
import { ImportedData, WidgetConfig } from '../lib/persist.js';

// Import dashboard components
import StatsRow from '../features/dashboard/StatsRow.jsx';
import QuickActions from '../features/dashboard/QuickActions.jsx';
import UpcomingRenewals from '../features/dashboard/UpcomingRenewals.jsx';
import { NavigationSuggestions } from '../components/EnhancedNavigation.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function Home() {
  const [clients, setClients] = useState([]);
  const [unlockedAnalytics, setUnlockedAnalytics] = useState(new Set());
  const navigate = useNavigate();

  // Load and process client data
  useEffect(() => {
    // Get clients from localStorage
    const clients = ImportedData.getClients();
    setClients(clients);

    // Calculate unlocked analytics groups
    const unlockedGroups = unlocks(clients);
    setUnlockedAnalytics(unlockedGroups);
  }, []);

  // Show empty state if no clients
  if (clients.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        px: 4
      }}>
  <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <Box
              component="img"
              src="/Submark.logo.orange.svg"
              alt="subzero Logo"
              sx={{
                width: 80,
                height: 80,
                filter: 'drop-shadow(0 4px 8px rgba(255, 109, 86, 0.2))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          </Box>
          <Typography level="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to subzero!
          </Typography>
          <Typography level="body-lg" color="neutral" sx={{ maxWidth: '500px', mx: 'auto', mb: 4 }}>
            Precision in Data. Clarity in Design. Import your client data to unlock powerful analytics and health scores.
          </Typography>
        </Box>

        <Stack spacing={2} direction="row" justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Button 
            size="lg"
            sx={{ 
              px: 4, 
              py: 1.5,
              background: '#FF6D56',
              '&:hover': {
                background: '#E55F4C',
              }
            }} 
            onClick={() => navigate('/data')}
          >
            🚀 Import Client Data
          </Button>
          <Button 
            variant="outlined" 
            size="lg"
            sx={{ px: 4, py: 1.5 }}
            onClick={() => navigate('/analytics')}
          >
            📊 View Demo Analytics
          </Button>
        </Stack>

        <Box sx={{ 
          mt: 6, 
          p: 3, 
          backgroundColor: 'background.level1', 
          borderRadius: 'lg',
          maxWidth: '600px',
          mx: 'auto'
        }}>
          <Typography level="body-sm" color="neutral" sx={{ mb: 2, fontWeight: 600 }}>
            ✨ What you'll unlock:
          </Typography>
          <Stack spacing={1}>
            <Typography level="body-sm" color="neutral">
              📈 <strong>Health Scores</strong> - Predict churn risk and expansion opportunities
            </Typography>
            <Typography level="body-sm" color="neutral">
              🔄 <strong>Renewal Tracking</strong> - Never miss a contract renewal again
            </Typography>
            <Typography level="body-sm" color="neutral">
              📊 <strong>Usage Analytics</strong> - Understand feature adoption patterns
            </Typography>
            <Typography level="body-sm" color="neutral">
              🎯 <strong>Success Insights</strong> - Data-driven recommendations for growth
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Home"
        description="Here's what's happening with your client portfolio today"
        icon={HomeIcon}
      />
      
      {/* Analytics unlock badges */}
      {unlockedAnalytics.size > 0 && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            flexWrap: 'wrap',
            mb: 4
          }}
        >
          {Array.from(unlockedAnalytics).map((group) => (
            <Chip
              key={group}
              size="sm"
              variant="soft"
              color="success"
              startDecorator="✨"
            >
              {group}
            </Chip>
          ))}
        </Stack>
      )}

      {/* Stats row - using actual component */}
      <StatsRow clients={clients} />

      {/* Two-column layout for Quick Actions and Upcoming Renewals */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Quick Actions - using actual component */}
        <QuickActions />
        
        {/* Upcoming Renewals - using actual component */}
        <UpcomingRenewals clients={clients} />
      </Box>

      {/* Navigation Suggestions */}
      <NavigationSuggestions 
        clients={clients}
        hasWidgets={(WidgetConfig.getAnalytics().enabled || []).length > 0}
      />
    </PageContainer>
  );
}