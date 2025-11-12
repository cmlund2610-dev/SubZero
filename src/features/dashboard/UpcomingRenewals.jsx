/**
 * UpcomingRenewals - Dashboard renewals card component
 * 
 * Shows next 5 client renewals in the next 90 days.
 * Displays "No upcoming renewals" message when none found.
 * 
 * Uses nextRenewals() from lib/metrics.js to filter and sort renewal data.
 * To connect live data: pass canonical clients array as prop instead of mock data.
 * 
 * @param {Object} props Component props
 * @param {Array} props.clients Array of canonical client data
 */

import { Card, Typography, Stack, Box, Chip, Divider } from '@mui/joy';
import { nextRenewals, formatCurrency, formatRelativeDate } from '../../lib/metrics.js';

export default function UpcomingRenewals({ clients = [] }) {
  const renewals = nextRenewals(clients, 90);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
      case 'critical':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        height: '100%',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Typography
            level="title-lg"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Upcoming Renewals
          </Typography>
          
          <Typography level="body-sm" color="neutral">
            {renewals.length > 0 
              ? `${renewals.length} renewal${renewals.length === 1 ? '' : 's'} in the next 90 days`
              : 'No upcoming renewals in the next 90 days'
            }
          </Typography>
        </Stack>

        {renewals.length > 0 ? (
          <Stack spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
            {renewals.map((renewal, index) => (
              <Box key={renewal.id}>
                <Stack spacing={1.5}>
                  {/* Client name and renewal date */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        level="body-md"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {renewal.companyName}
                      </Typography>
                      
                      <Typography level="body-sm" color="neutral">
                        {formatRelativeDate(renewal.renewalDate)}
                      </Typography>
                    </Stack>

                    <Typography
                      level="body-sm"
                      color="primary"
                      sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {formatCurrency(renewal.mrr)}
                    </Typography>
                  </Stack>

                  {/* Health and risk indicators */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getHealthColor(renewal.healthScore)}
                    >
                      Health: {renewal.healthScore}%
                    </Chip>
                    
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getRiskColor(renewal.churnRisk)}
                    >
                      {renewal.churnRisk} risk
                    </Chip>
                  </Stack>
                </Stack>

                {/* Divider between items (not after last item) */}
                {index < renewals.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack 
            sx={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4 
            }}
          >
            <Box sx={{ textAlign: 'center', opacity: 0.6 }}>
              <Typography sx={{ fontSize: '3rem', mb: 1 }}>📅</Typography>
              <Typography level="body-sm" color="neutral">
                All renewals are beyond 90 days
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Footer with action hint */}
        {renewals.length > 0 && (
          <Box
            sx={{
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography level="body-xs" color="neutral" textAlign="center">
              💡 Click on any client to view detailed renewal information
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}