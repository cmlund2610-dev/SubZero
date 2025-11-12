/**
 * StatsRow - Dashboard KPI cards component
 * 
 * Displays 4 key metrics in a responsive grid:
 * - Total Clients, At Risk, Total MRR, Avg Health
 * 
 * Uses calcTotals() from lib/metrics.js to compute values from canonical client data.
 * To connect live data: pass canonical clients array as prop instead of mock data.
 * 
 * @param {Object} props Component props
 * @param {Array} props.clients Array of canonical client data
 */

import { Box, Grid, Card, Typography, Stack } from '@mui/joy';
import { calcTotals, formatCurrency, formatPercentage } from '../../lib/metrics.js';

export default function StatsRow({ clients = [] }) {
  const { totalClients, atRisk, totalMRR, avgHealth } = calcTotals(clients);

  const stats = [
    {
      label: 'Total Clients',
      value: totalClients.toLocaleString(),
      color: 'primary',
      icon: '👥',
      gradient: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(67, 56, 202, 0.05) 100%)'
    },
    {
      label: 'At Risk',
      value: atRisk.toLocaleString(),
      color: atRisk > 0 ? 'danger' : 'success',
      icon: '⚠️',
      gradient: atRisk > 0 
        ? 'linear-gradient(135deg, rgba(220, 38, 127, 0.1) 0%, rgba(220, 38, 127, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
    },
    {
      label: 'Total MRR',
      value: formatCurrency(totalMRR),
      color: 'success',
      icon: '💰',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
    },
    {
      label: 'Avg Health',
      value: formatPercentage(avgHealth),
      color: avgHealth >= 70 ? 'success' : avgHealth >= 50 ? 'warning' : 'danger',
      icon: '📊',
      gradient: avgHealth >= 70 
        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
        : avgHealth >= 50 
        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(220, 38, 127, 0.1) 0%, rgba(220, 38, 127, 0.05) 100%)'
    }
  ];

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid key={stat.label} xs={12} sm={6} md={3}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                height: '100%',
                background: stat.gradient,
                border: '1px solid',
                borderColor: `${stat.color}.200`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  borderColor: `${stat.color}.300`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `var(--joy-palette-${stat.color}-500)`,
                }
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography
                    level="body-sm"
                    color="neutral"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                  >
                    {stat.label}
                  </Typography>
                  <Box sx={{ 
                    fontSize: '1.5rem', 
                    opacity: 0.8,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                  }}>
                    {stat.icon}
                  </Box>
                </Stack>
                
                <Typography
                  level="h2"
                  color={stat.color}
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                    lineHeight: 1.1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {stat.value}
                </Typography>
                
                {/* Subtle bottom accent */}
                <Box sx={{ 
                  height: '2px',
                  width: '40%',
                  background: `var(--joy-palette-${stat.color}-400)`,
                  borderRadius: '1px',
                  opacity: 0.6
                }} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}