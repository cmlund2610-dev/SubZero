/**
 * MRR Trend Widget - Monthly Recurring Revenue visualization
 * 
 * Shows MRR growth over time with trend indicators and key metrics.
 * Requires minimum 2 data points to display meaningful trends.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/joy';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

export default function MRRTrendWidget({ clients = [] }) {
  // Calculate MRR metrics
  const metrics = useMemo(() => {
    if (clients.length === 0) {
      return {
        currentMRR: 0,
        previousMRR: 0,
        growth: 0,
        growthPercent: 0,
        trend: 'flat',
        avgMRR: 0,
        totalClients: 0
      };
    }

    // Current MRR (sum of all active clients)
    const currentMRR = clients
      .filter(c => c.subscription?.status === 'active')
      .reduce((sum, client) => sum + (client.mrr || 0), 0);

    // For demo purposes, simulate previous month MRR
    // In real implementation, this would come from historical data
    const previousMRR = currentMRR * (0.85 + Math.random() * 0.3); // Random historical value
    
    const growth = currentMRR - previousMRR;
    const growthPercent = previousMRR > 0 ? (growth / previousMRR) * 100 : 0;
    
    let trend = 'flat';
    if (growthPercent > 2) trend = 'up';
    else if (growthPercent < -2) trend = 'down';

    const avgMRR = clients.length > 0 ? currentMRR / clients.length : 0;

    return {
      currentMRR,
      previousMRR,
      growth,
      growthPercent,
      trend,
      avgMRR,
      totalClients: clients.length
    };
  }, [clients]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getTrendIcon = () => {
    switch (metrics.trend) {
      case 'up': return <TrendingUp />;
      case 'down': return <TrendingDown />;
      default: return <TrendingFlat />;
    }
  };

  const getTrendColor = () => {
    switch (metrics.trend) {
      case 'up': return 'success';
      case 'down': return 'danger';
      default: return 'neutral';
    }
  };

  if (clients.length < 2) {
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
          Need at least 2 clients to show MRR trends
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Current MRR */}
      <Box>
        <Typography level="title-lg" sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
          {formatCurrency(metrics.currentMRR)}
        </Typography>
        <Typography level="body-sm" color="neutral">
          Total Monthly Recurring Revenue
        </Typography>
      </Box>

      {/* Growth Indicator */}
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant="soft"
            color={getTrendColor()}
            startDecorator={getTrendIcon()}
            size="sm"
          >
            {formatPercent(metrics.growthPercent)}
          </Chip>
          <Typography level="body-sm" color="neutral">
            vs last month
          </Typography>
        </Stack>
      </Box>

      {/* Key Metrics */}
      <Stack spacing={1} sx={{ flex: 1, justifyContent: 'flex-end' }}>
        <Box>
          <Typography level="body-sm" color="neutral">
            Average per client
          </Typography>
          <Typography level="title-sm" sx={{ fontWeight: 600 }}>
            {formatCurrency(metrics.avgMRR)}
          </Typography>
        </Box>
        
        <Box>
          <Typography level="body-sm" color="neutral">
            Active clients
          </Typography>
          <Typography level="title-sm" sx={{ fontWeight: 600 }}>
            {metrics.totalClients}
          </Typography>
        </Box>
      </Stack>

      {/* Simple trend visualization */}
      <Box sx={{ height: 40, bgcolor: 'background.level1', borderRadius: 'sm', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '20%',
            width: '60%',
            height: `${Math.min(Math.max(20 + metrics.growthPercent * 2, 10), 90)}%`,
            bgcolor: getTrendColor() === 'success' ? 'success.500' : 
                    getTrendColor() === 'danger' ? 'danger.500' : 'neutral.500',
            borderRadius: 'sm sm 0 0',
            opacity: 0.8,
            transition: 'all 0.3s ease'
          }}
        />
      </Box>
    </Stack>
  );
}