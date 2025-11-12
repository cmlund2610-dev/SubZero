import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Table, Button, Chip, Input, Card } from '@mui/joy';
import { Diamond } from '@mui/icons-material';
import { ImportedData } from '../lib/persist.js';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function Clients() {
  const navigate = useNavigate();
  const clients = ImportedData.getClients();

  const formatMRR = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Show empty state if no clients
  if (clients.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Clients"
          description="Manage your client portfolio and track health scores across your customer base"
          icon={Diamond}
        />

        {/* Enhanced empty state */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 6,
          px: 4,
          backgroundColor: 'background.level1',
          borderRadius: 'lg',
          border: '2px dashed',
          borderColor: 'neutral.300'
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography level="display1" sx={{ fontSize: '4rem', mb: 2 }}>
              👥
            </Typography>
            <Typography level="h3" sx={{ mb: 1, fontWeight: 600 }}>
              No Clients Yet
            </Typography>
            <Typography level="body-md" color="neutral" sx={{ maxWidth: 400 }}>
              Start building your customer success portfolio by importing your client data. 
              Once imported, you'll see health scores, risk levels, and key metrics here.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Button
              size="lg"
              variant="solid"
              onClick={() => navigate('/data')}
              sx={{
                px: 4,
                py: 1.5,
                background: '#FF6D56',
                '&:hover': {
                  background: '#E55F4C',
                }
              }}
            >
              📤 Import Client Data
            </Button>
            <Button
              size="lg"
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1.5 }}
            >
              ← Back to Dashboard
            </Button>
          </Stack>

          <Box sx={{
            p: 3,
            backgroundColor: 'background.surface',
            borderRadius: 'md',
            maxWidth: 500
          }}>
            <Typography level="body-sm" color="neutral" sx={{ mb: 2, fontWeight: 600 }}>
              What you can track once you have clients:
            </Typography>
            <Stack spacing={1}>
              <Typography level="body-sm" color="neutral">
                🏢 Company names and contact information
              </Typography>
              <Typography level="body-sm" color="neutral">
                💰 Monthly recurring revenue (MRR) tracking
              </Typography>
              <Typography level="body-sm" color="neutral">
                📅 Contract and renewal date management
              </Typography>
              <Typography level="body-sm" color="neutral">
                📊 Subscription duration and lifetime value
              </Typography>
            </Stack>
          </Box>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Manage your client portfolio and track health scores across your customer base"
        icon={Diamond}
      />

      <Card variant="outlined">
        <Table hoverRow>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Company</th>
              <th>Contact</th>
              <th>MRR</th>
              <th>Renewal Date</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr 
                key={client.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <td>
                  <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.500' }}>
                    {client.client?.id || client.id}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {client.company?.name || 'N/A'}
                  </Typography>
                </td>
                <td>
                  <Stack spacing={0.5}>
                    <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                      {client.contact?.name || 'N/A'}
                    </Typography>
                    <Typography level="body-xs" color="neutral">
                      {client.contact?.email || 'N/A'}
                    </Typography>
                  </Stack>
                </td>
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {formatMRR(client.mrr || 0)}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {client.renewal?.date ? new Date(client.renewal.date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </PageContainer>
  );
}