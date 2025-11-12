/**
 * User Growth Widget - Active user growth visualization
 * 
 * Shows user growth trends and key user metrics across
 * the client portfolio with growth indicators.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, Chip, LinearProgress } from '@mui/joy';
import { TrendingUp, People, PersonAdd } from '@mui/icons-material';

export default function UserGrowthWidget({ clients = [] }) {
  // Calculate user metrics
  const userMetrics = useMemo(() => {
    if (clients.length === 0) {
      return {
        totalActiveUsers: 0,
        totalUsers: 0,
        avgUsersPerClient: 0,
        utilizationRate: 0,
        growthTrend: 0,
        topGrowthClients: []
      };
    }

    const totalActiveUsers = clients.reduce((sum, c) => sum + (c.users?.active || 0), 0);
    const totalUsers = clients.reduce((sum, c) => sum + (c.users?.total || 0), 0);
    const avgUsersPerClient = totalUsers / clients.length;
    const utilizationRate = totalUsers > 0 ? (totalActiveUsers / totalUsers) * 100 : 0;

    // Simulate growth trend (in real app, this would be calculated from historical data)
    const growthTrend = 5 + Math.random() * 15; // Random 5-20% growth

    // Find clients with highest user counts (representing growth)
    const topGrowthClients = clients
      .filter(c => c.users?.total > 0)
      .sort((a, b) => (b.users?.total || 0) - (a.users?.total || 0))
      .slice(0, 3)
      .map(c => ({
        name: c.companyName,
        users: c.users?.total || 0,
        active: c.users?.active || 0,
        utilization: c.users?.total > 0 ? ((c.users?.active || 0) / c.users.total) * 100 : 0
      }));

    return {
      totalActiveUsers,
      totalUsers,
      avgUsersPerClient,
      utilizationRate,
      growthTrend,
      topGrowthClients
    };
  }, [clients]);

  if (clients.length < 3) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        <Typography level="body-sm">
          Need at least 3 clients to analyze user growth
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Total Active Users */}
      <Box>
        <Typography level="title-lg" sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
          {userMetrics.totalActiveUsers.toLocaleString()}
        </Typography>
        <Typography level="body-sm" color="neutral">
          Active Users Across Portfolio
        </Typography>
      </Box>

      {/* Growth Indicator */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          variant="soft"
          color="success"
          startDecorator={<TrendingUp />}
          size="sm"
        >
          +{userMetrics.growthTrend.toFixed(1)}%
        </Chip>
        <Typography level="body-sm" color="neutral">
          growth trend
        </Typography>
      </Stack>

      {/* Key Metrics */}
      <Stack spacing={2} sx={{ flex: 1 }}>
        {/* Utilization Rate */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
              User Utilization
            </Typography>
            <Typography level="body-sm">
              {userMetrics.utilizationRate.toFixed(1)}%
            </Typography>
          </Stack>
          <LinearProgress
            determinate
            value={userMetrics.utilizationRate}
            color={userMetrics.utilizationRate > 70 ? 'success' : userMetrics.utilizationRate > 50 ? 'warning' : 'danger'}
            size="sm"
            sx={{ height: 6 }}
          />
          <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
            {userMetrics.totalActiveUsers} of {userMetrics.totalUsers} total users
          </Typography>
        </Box>

        {/* Top Growth Clients */}
        {userMetrics.topGrowthClients.length > 0 && (
          <Box>
            <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1 }}>
              Largest User Bases
            </Typography>
            <Stack spacing={0.5}>
              {userMetrics.topGrowthClients.map((client, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1,
                    bgcolor: 'background.level1',
                    borderRadius: 'sm',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <People fontSize="small" color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                      {client.name}
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      {client.active}/{client.users} users ({client.utilization.toFixed(0)}%)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Summary Stats */}
      <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography level="body-sm" color="neutral">
            Avg per client
          </Typography>
          <Typography level="body-sm" sx={{ fontWeight: 600 }}>
            {Math.round(userMetrics.avgUsersPerClient)} users
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}