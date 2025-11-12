/**
 * ClientDetail Page - Individual client overview with tabbed interface
 * 
 * Shows detailed information about a specific client with tabs:
 * Overview, Usage, Notes, Tasks (all placeholders for now)
 * 
 * Uses useParams to get client ID from URL.
 * To integrate with data: fetch client data based on ID and populate tabs.
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanel,
  Card,
  Chip,
  Button,
  Grid
} from '@mui/joy';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ImportedData } from '../lib/persist.js';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get real client data from localStorage
  const clients = ImportedData.getClients();
  const client = clients.find(c => c.id === id);

  // If client not found, show not found message
  if (!client) {
    return (
      <Box>
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </Button>
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography level="h2" sx={{ mb: 2 }}>Client Not Found</Typography>
          <Typography level="body-md" color="neutral">
            The client you're looking for doesn't exist or may have been removed.
          </Typography>
        </Card>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      {/* Back button and header */}
      <Stack spacing={3}>
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </Button>

        {/* Client header info */}
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={1}>
              <Typography level="h1" sx={{ fontWeight: 700 }}>
                {client.company?.name || 'Unknown Company'}
              </Typography>
              <Typography level="body-md" color="neutral">
                {client.contact?.name || 'N/A'} • {client.contact?.email || 'N/A'}
              </Typography>
              <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.400' }}>
                ID: {client.client?.id || client.id}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1}>
              <Chip 
                variant="soft" 
                color="primary"
                size="lg"
              >
                {client.subscribedMonths || 0} months
              </Chip>
              <Chip 
                variant="soft" 
                color="success"
                size="lg"
              >
                Active Client
              </Chip>
            </Stack>
          </Stack>

          {/* Key metrics */}
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">MRR</Typography>
                <Typography level="h3" color="primary">
                  {formatCurrency(client.mrr)}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Lifetime Value</Typography>
                <Typography level="h3">
                  {formatCurrency(client.ltv)}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Contract End</Typography>
                <Typography level="h3">{formatDate(client.contract?.endDate)}</Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Renewal Date</Typography>
                <Typography level="h3">{formatDate(client.renewal?.date)}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>

        {/* Tabbed interface */}
        <Tabs defaultValue={0} sx={{ backgroundColor: 'transparent' }}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Usage</Tab>
            <Tab>Notes</Tab>
            <Tab>Tasks</Tab>
          </TabList>
          
          <TabPanel value={0}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography level="title-lg">Client Overview</Typography>
              
              {/* Company Information */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Company Information</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Client ID</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          {client.client?.id || client.id}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Company Name</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.company?.name || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Primary Contact</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.contact?.name || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contact Email</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.contact?.email || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Imported</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.importedAt ? formatDate(client.importedAt) : 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>

              {/* Contract Information */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Contract Details</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contract Start Date</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.contract?.startDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contract End Date</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.contract?.endDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Next Renewal</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.renewal?.date)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Subscription Duration</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.subscribedMonths || 0} months
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>

              {/* Financial Information */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Financial Metrics</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Monthly Recurring Revenue</Typography>
                        <Typography level="h4" color="primary">
                          {formatCurrency(client.mrr)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Lifetime Value</Typography>
                        <Typography level="h4" color="success">
                          {formatCurrency(client.ltv)}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
          
          <TabPanel value={1}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography level="title-lg">Usage Analytics</Typography>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="body-md">
                    📊 <strong>Usage Tab Placeholder</strong>
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    This section would contain:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><Typography level="body-sm">Feature adoption charts</Typography></li>
                    <li><Typography level="body-sm">Login frequency and patterns</Typography></li>
                    <li><Typography level="body-sm">User engagement metrics</Typography></li>
                    <li><Typography level="body-sm">API usage statistics</Typography></li>
                    <li><Typography level="body-sm">Performance benchmarks</Typography></li>
                  </ul>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
          
          <TabPanel value={2}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography level="title-lg">Notes & Communications</Typography>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="body-md">
                    📝 <strong>Notes Tab Placeholder</strong>
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    This section would contain:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><Typography level="body-sm">Internal notes and observations</Typography></li>
                    <li><Typography level="body-sm">Meeting summaries and action items</Typography></li>
                    <li><Typography level="body-sm">Email communication history</Typography></li>
                    <li><Typography level="body-sm">Support ticket references</Typography></li>
                    <li><Typography level="body-sm">Strategic recommendations</Typography></li>
                  </ul>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
          
          <TabPanel value={3}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography level="title-lg">Tasks & Follow-ups</Typography>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="body-md">
                    ✅ <strong>Tasks Tab Placeholder</strong>
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    This section would contain:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><Typography level="body-sm">Open tasks and action items</Typography></li>
                    <li><Typography level="body-sm">Scheduled follow-ups</Typography></li>
                    <li><Typography level="body-sm">Renewal preparation checklist</Typography></li>
                    <li><Typography level="body-sm">Escalation procedures</Typography></li>
                    <li><Typography level="body-sm">Success milestones tracking</Typography></li>
                  </ul>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
        </Tabs>
      </Stack>
    </Box>
  );
}