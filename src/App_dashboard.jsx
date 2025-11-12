/**
 * subzero Dashboard App
 * 
 * Main dashboard composition displaying:
 * - Sidebar with logo
 * - Stats row with KPIs 
 * - Quick Actions and Upcoming Renewals cards
 * - Analytics unlock badges
 * 
 * Uses mock data from clients.sample.json processed through mappers.
 * To integrate live data: replace mock import with API calls in useEffect
 * and pass real canonical client data to dashboard components.
 */

import React, { useState, useEffect } from 'react';
import { CssVarsProvider, CssBaseline } from '@mui/joy/styles';
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  Grid, 
  Chip,
  Sheet
} from '@mui/joy';

// Import theme and utilities
import theme from './assets/theme.js';
import { toCanonicalArray } from './lib/mappers.js';
import { unlocks } from './lib/metrics.js';

// Import dashboard components
import StatsRow from './features/dashboard/StatsRow.jsx';
import QuickActions from './features/dashboard/QuickActions.jsx';
import UpcomingRenewals from './features/dashboard/UpcomingRenewals.jsx';

// Import mock data
import mockClientsData from './data/clients.sample.json';

export default function App() {
  const [clients, setClients] = useState([]);
  const [unlockedAnalytics, setUnlockedAnalytics] = useState(new Set());

  // Load and process client data
  useEffect(() => {
    // Convert legacy mock data to canonical format
    const canonicalClients = toCanonicalArray(mockClientsData);
    setClients(canonicalClients);

    // Calculate unlocked analytics groups
    const unlockedGroups = unlocks(canonicalClients);
    setUnlockedAnalytics(unlockedGroups);

    // TODO: Replace with real API call
    // fetchClientsFromAPI().then(legacyData => {
    //   const canonical = toCanonicalArray(legacyData);
    //   setClients(canonical);
    //   setUnlockedAnalytics(unlocks(canonical));
    // });
  }, []);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <Sheet
            sx={{
              width: { xs: 0, sm: 240 },
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.surface'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stack spacing={1} alignItems="center">
                {/* subzero Logo */}
                <Box
                  component="img"
                  src="/Primary Logo grey : orange.svg"
                  alt="subzero Logo"
                  sx={{
                    width: 160,
                    height: 'auto',
                    mb: 1
                  }}
                />
              </Stack>
            </Box>

            {/* Navigation placeholder */}
            <Box sx={{ px: 2, flex: 1 }}>
              <Stack spacing={0.5}>
                <Button 
                  variant="soft" 
                  color="primary" 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  🏠 Dashboard
                </Button>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  👥 Clients
                </Button>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  📊 Analytics
                </Button>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  ⚙️ Settings
                </Button>
              </Stack>
            </Box>
          </Sheet>

          {/* Main content area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Topbar */}
            <Sheet
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.surface'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  {/* Mobile logo */}
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Box
                      component="img"
                      src="/Primary Logo grey : orange.svg"
                      alt="subzero Logo"
                      sx={{
                        height: 28,
                        width: 'auto'
                      }}
                    />
                  </Box>
                  
                  {/* Analytics unlock badges */}
                  {unlockedAnalytics.size > 0 && (
                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                </Stack>

                <Button variant="solid" color="primary">
                  Sign in
                </Button>
              </Stack>
            </Sheet>

            {/* Page content */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                px: 3,
                py: 3
              }}
            >
              <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                {/* Page header */}
                <Stack spacing={1} sx={{ mb: 4 }}>
                  <Typography level="h1" sx={{ fontWeight: 700 }}>
                    Dashboard
                  </Typography>
                  <Typography level="body-md" color="neutral">
                    Here's what's happening with your client portfolio today
                  </Typography>
                  
                  {/* Mobile analytics badges */}
                  {unlockedAnalytics.size > 0 && (
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        display: { xs: 'flex', md: 'none' },
                        flexWrap: 'wrap',
                        mt: 2
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
                </Stack>

                {/* Stats row */}
                <StatsRow clients={clients} />

                {/* Two-column layout for Quick Actions and Upcoming Renewals */}
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <QuickActions />
                  </Grid>
                  
                  <Grid xs={12} md={6}>
                    <UpcomingRenewals clients={clients} />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}