import React from 'react';
import { Box, Typography, Stack, Card, Chip } from '@mui/joy';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function RevenueMetricsWidget({ clients = [] }) {
  const revenueData = React.useMemo(() => {
    const baseRevenue = clients.length * 75000; // Average revenue per client
    const monthlyRecurring = baseRevenue * 0.7; // 70% is recurring
    const oneTime = baseRevenue * 0.3; // 30% is one-time

    // Generate some growth metrics
    const growth = {
      mrr: Math.random() > 0.3 ? Math.floor(Math.random() * 25) + 5 : -Math.floor(Math.random() * 10),
      arr: Math.random() > 0.2 ? Math.floor(Math.random() * 30) + 10 : -Math.floor(Math.random() * 15),
      expansion: Math.floor(Math.random() * 40) + 10
    };

    return {
      totalRevenue: baseRevenue,
      monthlyRecurring: monthlyRecurring,
      oneTimeRevenue: oneTime,
      avgDealSize: Math.floor(baseRevenue / Math.max(clients.length, 1)),
      growth
    };
  }, [clients.length]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  const GrowthIndicator = ({ value, label }) => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {value >= 0 ? (
        <TrendingUp color="success" sx={{ fontSize: 14 }} />
      ) : (
        <TrendingDown color="danger" sx={{ fontSize: 14 }} />
      )}
      <Typography level="body-xs" color={value >= 0 ? 'success' : 'danger'}>
        {Math.abs(value)}%
      </Typography>
    </Stack>
  );

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
        Revenue Metrics
      </Typography>
      
      <Card variant="soft" color="primary" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography level="body-xs" color="primary">Total Revenue</Typography>
          <Typography level="title-lg" color="primary" sx={{ fontWeight: 700 }}>
            {formatCompactCurrency(revenueData.totalRevenue)}
          </Typography>
          <GrowthIndicator value={revenueData.growth.arr} />
        </Stack>
      </Card>

      <Stack spacing={1.5}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                Monthly Recurring
              </Typography>
              <Typography level="body-xs" color="neutral">
                {formatCompactCurrency(revenueData.monthlyRecurring)}
              </Typography>
            </Stack>
            <GrowthIndicator value={revenueData.growth.mrr} />
          </Stack>
        </Card>

        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                Avg Deal Size
              </Typography>
              <Typography level="body-xs" color="neutral">
                {formatCompactCurrency(revenueData.avgDealSize)}
              </Typography>
            </Stack>
            <Chip size="sm" color="neutral" variant="soft">
              {clients.length} deals
            </Chip>
          </Stack>
        </Card>

        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                Expansion Revenue
              </Typography>
              <Typography level="body-xs" color="neutral">
                Growth from existing clients
              </Typography>
            </Stack>
            <GrowthIndicator value={revenueData.growth.expansion} />
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}