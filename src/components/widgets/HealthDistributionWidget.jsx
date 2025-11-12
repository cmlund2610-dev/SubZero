/**
 * Health Distribution Widget - Client health score visualization
 * 
 * Shows distribution of client health scores in a donut chart format
 * with color-coded segments and summary statistics.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, LinearProgress } from '@mui/joy';

export default function HealthDistributionWidget({ clients = [] }) {
  // Calculate health distribution
  const distribution = useMemo(() => {
    if (clients.length === 0) {
      return {
        healthy: { count: 0, percentage: 0 },
        warning: { count: 0, percentage: 0 },
        critical: { count: 0, percentage: 0 },
        avgHealth: 0,
        total: 0
      };
    }

    const healthy = clients.filter(c => (c.health?.score || 0) >= 70);
    const warning = clients.filter(c => {
      const score = c.health?.score || 0;
      return score >= 40 && score < 70;
    });
    const critical = clients.filter(c => (c.health?.score || 0) < 40);
    
    const total = clients.length;
    const avgHealth = clients.reduce((sum, c) => sum + (c.health?.score || 0), 0) / total;

    return {
      healthy: {
        count: healthy.length,
        percentage: (healthy.length / total) * 100
      },
      warning: {
        count: warning.length,
        percentage: (warning.length / total) * 100
      },
      critical: {
        count: critical.length,
        percentage: (critical.length / total) * 100
      },
      avgHealth,
      total
    };
  }, [clients]);

  if (clients.length < 5) {
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
          Need at least 5 clients to show distribution
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Average Health Score */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography level="title-lg" sx={{ fontWeight: 700, fontSize: '2rem' }}>
          {Math.round(distribution.avgHealth)}
        </Typography>
        <Typography level="body-sm" color="neutral">
          Average Health Score
        </Typography>
      </Box>

      {/* Visual Distribution */}
      <Box sx={{ flex: 1 }}>
        {/* Healthy Clients */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography level="body-sm" sx={{ fontWeight: 600, color: 'success.600' }}>
              Healthy (70-100)
            </Typography>
            <Typography level="body-sm">
              {distribution.healthy.count} clients
            </Typography>
          </Stack>
          <LinearProgress
            determinate
            value={distribution.healthy.percentage}
            color="success"
            size="sm"
            sx={{ height: 8 }}
          />
          <Typography level="body-xs" sx={{ mt: 0.5, textAlign: 'right' }}>
            {distribution.healthy.percentage.toFixed(1)}%
          </Typography>
        </Box>

        {/* Warning Clients */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography level="body-sm" sx={{ fontWeight: 600, color: 'warning.600' }}>
              At Risk (40-69)
            </Typography>
            <Typography level="body-sm">
              {distribution.warning.count} clients
            </Typography>
          </Stack>
          <LinearProgress
            determinate
            value={distribution.warning.percentage}
            color="warning"
            size="sm"
            sx={{ height: 8 }}
          />
          <Typography level="body-xs" sx={{ mt: 0.5, textAlign: 'right' }}>
            {distribution.warning.percentage.toFixed(1)}%
          </Typography>
        </Box>

        {/* Critical Clients */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography level="body-sm" sx={{ fontWeight: 600, color: 'danger.600' }}>
              Critical (0-39)
            </Typography>
            <Typography level="body-sm">
              {distribution.critical.count} clients
            </Typography>
          </Stack>
          <LinearProgress
            determinate
            value={distribution.critical.percentage}
            color="danger"
            size="sm"
            sx={{ height: 8 }}
          />
          <Typography level="body-xs" sx={{ mt: 0.5, textAlign: 'right' }}>
            {distribution.critical.percentage.toFixed(1)}%
          </Typography>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography level="body-sm" color="neutral">
            Total Clients
          </Typography>
          <Typography level="body-sm" sx={{ fontWeight: 600 }}>
            {distribution.total}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}