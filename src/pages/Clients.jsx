import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Table, Button, Chip, Input, Card, Select, Option, FormControl, FormLabel, CircularProgress } from '@mui/joy';
import { GroupsOutlined as ClientsIcon, Search, FilterAlt, TrendingUp, TrendingDown } from '@mui/icons-material';
import { getCompanyClients } from '../lib/clientData.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function Clients() {
  const navigate = useNavigate();
  const { userCompany } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('company');
  const [filterMRR, setFilterMRR] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadClients();
  }, [userCompany]);

  const loadClients = async () => {
    if (!userCompany?.id) {
      setClients([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const firestoreClients = await getCompanyClients(userCompany.id);
      setClients(firestoreClients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort clients
  const getFilteredAndSortedClients = () => {
    let filtered = clients;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.company?.name?.toLowerCase().includes(search) ||
        client.contact?.name?.toLowerCase().includes(search) ||
        client.contact?.email?.toLowerCase().includes(search) ||
        client.client?.id?.toLowerCase().includes(search) ||
        client.id?.toLowerCase().includes(search)
      );
    }

    // MRR filter
    if (filterMRR !== 'all') {
      filtered = filtered.filter(client => {
        const mrr = client.mrr || 0;
        switch (filterMRR) {
          case 'high': return mrr >= 10000;
          case 'medium': return mrr >= 1000 && mrr < 10000;
          case 'low': return mrr < 1000;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'company':
          aVal = a.company?.name || '';
          bVal = b.company?.name || '';
          break;
        case 'mrr':
          aVal = a.mrr || 0;
          bVal = b.mrr || 0;
          break;
        case 'renewal':
          aVal = a.renewal?.date ? new Date(a.renewal.date).getTime() : 0;
          bVal = b.renewal?.date ? new Date(b.renewal.date).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredClients = getFilteredAndSortedClients();

  const formatMRR = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Top-level loader
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Clients"
          description="Manage your client portfolio and track health scores across your customer base"
          icon={ClientsIcon}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size="sm" />
        </Box>
      </PageContainer>
    );
  }

  // Empty state
  if (clients.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Clients"
          description="Manage your client portfolio and track health scores across your customer base"
          icon={ClientsIcon}
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
        icon={ClientsIcon}
      />

      {/* Search and Filter Bar */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Input
              placeholder="Search by company, contact, or client ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startDecorator={<Search />}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              startDecorator={<FilterAlt />}
              color="neutral"
            >
              Filters
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl sx={{ minWidth: 180 }}>
              <FormLabel>Sort by</FormLabel>
              <Select value={sortBy} onChange={(e, newValue) => setSortBy(newValue)}>
                <Option value="company">Company Name</Option>
                <Option value="mrr">MRR</Option>
                <Option value="renewal">Renewal Date</Option>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <FormLabel>Order</FormLabel>
              <Select value={sortOrder} onChange={(e, newValue) => setSortOrder(newValue)}>
                <Option value="asc" startDecorator={<TrendingUp />}>Ascending</Option>
                <Option value="desc" startDecorator={<TrendingDown />}>Descending</Option>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <FormLabel>MRR Range</FormLabel>
              <Select value={filterMRR} onChange={(e, newValue) => setFilterMRR(newValue)}>
                <Option value="all">All Clients</Option>
                <Option value="high">High ($10k+)</Option>
                <Option value="medium">Medium ($1k-$10k)</Option>
                <Option value="low">Low (&lt;$1k)</Option>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography level="body-sm" color="neutral">
                Showing {filteredClients.length} of {clients.length} clients
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Clients Table */}
      <Card variant="outlined">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size="sm" />
          </Box>
        ) : filteredClients.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography level="body-md" color="neutral">No clients match your search criteria</Typography>
          </Box>
        ) : (
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
              {filteredClients.map((client) => (
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
        )}
      </Card>
    </PageContainer>
  );
}