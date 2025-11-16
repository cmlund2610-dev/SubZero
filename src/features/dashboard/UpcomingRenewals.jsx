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
import { useNavigate } from 'react-router-dom';
import { nextRenewals, formatCurrency, formatRelativeDate } from '../../lib/metrics.js';

export default function UpcomingRenewals({ clients = [] }) {
  const navigate = useNavigate();
  const allRenewals = nextRenewals(clients, 90); // full list
  const renewals = allRenewals.slice(0, 5); // display first 5

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

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        height: '100%',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Typography
            level="title-lg"
            sx={{ fontWeight: 700 }}
          >
            Contract Renewals
          </Typography>
          
          <Typography level="body-sm" color="neutral">
            {allRenewals.length > 0 
              ? `${allRenewals.length} renewal${allRenewals.length === 1 ? '' : 's'} in the next 90 days` + (allRenewals.length > 5 ? ` • showing first 5` : '')
              : 'No upcoming renewals in the next 90 days'
            }
          </Typography>
        </Stack>

        {renewals.length > 0 ? (
          <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', maxHeight: '500px' }}>
            {renewals.map((renewal) => (
              <Box key={renewal.id}>
                <Card 
                  variant="soft" 
                  sx={{ 
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }
                  }}
                  onClick={() => navigate(`/clients/${renewal.id}`)}
                >
                  <Stack spacing={1.5}>
                    {/* Client name and dates */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          level="title-sm"
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {renewal.companyName}
                        </Typography>
                        
                        <Typography level="body-xs" color="neutral">
                          {formatRelativeDate(renewal.renewalDate)}
                        </Typography>

                        <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'md' }}>
                          {new Date(renewal.renewalDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </Typography>
                      </Stack>

                      <Typography
                        level="title-sm"
                        sx={{ fontWeight: 700, whiteSpace: 'nowrap', color: '#FF6D56' }}
                      >
                        {formatCurrency(renewal.mrr)}
                      </Typography>
                    </Stack>

                    {/* Additional details and risk */}
                    <Stack spacing={1}>
                      {renewal.contractValue > 0 && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography level="body-xs" color="neutral">
                            Contract Value
                          </Typography>
                          <Typography level="body-sm" sx={{ fontWeight: 'md' }}>
                            {formatCurrency(renewal.contractValue)}
                          </Typography>
                        </Stack>
                      )}

                      {renewal.contactName && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography level="body-xs" color="neutral">
                            Contact
                          </Typography>
                          <Typography level="body-sm">
                            {renewal.contactName}
                          </Typography>
                        </Stack>
                      )}

                      {renewal.csmOwner && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography level="body-xs" color="neutral">
                            CSM
                          </Typography>
                          <Typography level="body-sm">
                            {renewal.csmOwner}
                          </Typography>
                        </Stack>
                      )}

                      {renewal.churnRisk && renewal.churnRisk !== 'unknown' && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            size="sm"
                            variant="soft"
                            color={getRiskColor(renewal.churnRisk)}
                          >
                            {renewal.churnRisk} risk
                          </Chip>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Card>
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
      </Stack>
    </Card>
  );
}