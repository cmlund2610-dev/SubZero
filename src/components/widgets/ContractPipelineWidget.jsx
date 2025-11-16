import React from 'react';
import { Box, Typography, Stack, Card, Chip } from '@mui/joy';

export default function ContractPipelineWidget({ clients = [] }) {
  // Generate pipeline data from clients
  const pipelineData = React.useMemo(() => {
    return [
      {
        label: 'Expiring Soon',
        count: Math.floor(clients.length * 0.15),
        color: 'danger',
        period: '< 30 days'
      },
      {
        label: 'Due This Quarter',
        count: Math.floor(clients.length * 0.25),
        color: 'warning', 
        period: '30-90 days'
      },
      {
        label: 'Future Renewals',
        count: Math.floor(clients.length * 0.35),
        color: 'neutral',
        period: '90+ days'
      },
      {
        label: 'Active Negotiations',
        count: Math.floor(clients.length * 0.08),
        color: 'primary',
        period: 'In progress'
      }
    ];
  }, [clients.length]);

  const totalValue = React.useMemo(() => {
    const base = clients.length * 50000; // Average contract value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(base);
  }, [clients.length]);

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="title-sm" sx={{ fontWeight: 600 }}>
          Contract Pipeline
        </Typography>
        <Typography level="body-xs" color="neutral">
          {totalValue} Total
        </Typography>
      </Box>
      
      <Stack spacing={1.5}>
        {pipelineData.map((item, index) => (
          <Card key={index} variant="soft" sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
                <Typography level="body-xs" color="neutral">
                  {item.period}
                </Typography>
              </Stack>
              <Stack alignItems="flex-end" spacing={0.5}>
                <Chip size="sm" color={item.color} variant="solid">
                  {item.count}
                </Chip>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}