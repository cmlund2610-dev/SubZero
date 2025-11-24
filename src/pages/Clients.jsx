import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Table, Button, Chip, Input, Card, Select, Option, FormControl, FormLabel, CircularProgress, Checkbox, Autocomplete, Modal, TextField } from '@mui/joy';
import { GroupsOutlined as ClientsIcon, Search, FilterAlt, TrendingUp, TrendingDown } from '@mui/icons-material';
import { getCompanyClients, upsertClient } from '../lib/clientData.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default function Clients() {
  const navigate = useNavigate();
  const { userCompany } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('company');
  const [filterMRR, setFilterMRR] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClients, setSelectedClients] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    company: '',
    contact: '',
    mrrRange: [0, 100000],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    clientId: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    contractStartDate: '',
    contractEndDate: '',
    renewalDate: '',
    mrr: '',
    ltv: '',
    subscribedMonths: '',
  });

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

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filter and sort clients
  const getFilteredAndSortedClients = () => {
    let filtered = clients;

    // Apply advanced filters
    if (advancedFilters.company) {
      filtered = filtered.filter((client) =>
        client.company?.name?.toLowerCase().includes(advancedFilters.company.toLowerCase())
      );
    }

    if (advancedFilters.contact) {
      filtered = filtered.filter((client) =>
        client.contact?.name?.toLowerCase().includes(advancedFilters.contact.toLowerCase())
      );
    }

    if (advancedFilters.mrrRange) {
      const [minMRR, maxMRR] = advancedFilters.mrrRange;
      filtered = filtered.filter((client) => {
        const mrr = client.mrr || 0;
        return mrr >= minMRR && mrr <= maxMRR;
      });
    }

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

  const handleSelectClient = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map((client) => client.id));
    }
  };

  const notify = (message, type = 'info') => {
    toast(message, { type });
  };

  const handleBulkDelete = () => {
    // Example notification for bulk delete
    notify('Bulk delete action executed!', 'success');
    console.log('Deleting clients:', selectedClients);
  };

  const handleBulkUpdate = () => {
    // Example notification for bulk update
    notify('Bulk update action executed!', 'success');
    console.log('Updating clients:', selectedClients);
  };

  const handleCreateClient = async () => {
    try {
      if (!userCompany?.id) {
        throw new Error('No company ID found. Please sign in again.');
      }

      const clientId = newClient.clientId || newClient.companyName.toLowerCase().replace(/\s+/g, '-');
      await upsertClient(userCompany.id, clientId, {
        ...newClient,
        id: clientId,
        renewal: { date: newClient.renewalDate },
      });

      setNewClient({
        clientId: '',
        companyName: '',
        contactName: '',
        contactEmail: '',
        contractStartDate: '',
        contractEndDate: '',
        renewalDate: '',
        mrr: '',
        ltv: '',
        subscribedMonths: '',
      });
      setIsModalOpen(false);
      loadClients();
      notify('Client created successfully!', 'success');
    } catch (error) {
      console.error('Error creating client:', error);
      notify('Failed to create client. Please try again.', 'error');
    }
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

  // Show empty state if no clients
  if (clients.length === 0) {
    return (
      <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
        <PageHeader
          title="Clients"
          description="Import client data to manage your client portfolio"
          icon={ClientsIcon}
        />
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography level="body-md">No client data available. Please import data to get started.</Typography>
          <Button variant="solid" color="primary" onClick={() => navigate('/import')}>Import Client Data</Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset logic if needed
      }}
    >
      <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
        <PageHeader
          title="Clients"
          description="Manage your client portfolio and track health scores across your customer base"
          icon={ClientsIcon}
        />

        {/* Toast Notifications */}
        <ToastContainer />

        {/* Bulk Actions Toolbar */}
        {selectedClients.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography level="body-sm">
                {selectedClients.length} client(s) selected
              </Typography>
              <Button variant="solid" color="danger" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
              <Button variant="solid" color="primary" onClick={handleBulkUpdate}>
                Update Selected
              </Button>
            </Stack>
          </Card>
        )}

        {/* Top action bar */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="solid"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Client
          </Button>
        </Stack>

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
          <Table>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={selectedClients.length === filteredClients.length}
                    indeterminate={
                      selectedClients.length > 0 &&
                      selectedClients.length < filteredClients.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Client ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>MRR</th>
                <th>Renewal Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleSelectClient(client.id)}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.500' }}>
                      {client.client?.id || client.id}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      level="body-sm"
                      sx={{ fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
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

        {/* Add Client Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Card sx={{ p: 3, maxWidth: 600, mx: 'auto', my: '10%', maxHeight: '80vh', overflowY: 'auto', borderRadius: 2, boxShadow: 3 }}>
            <Typography level="h5" sx={{ mb: 3, textAlign: 'center' }}>Create New Client</Typography>
            
            <Typography level="h6" sx={{ mb: 2 }}>Client Information</Typography>
            <Stack spacing={2} direction="row" flexWrap="wrap" gap={2} alignItems="flex-start">
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Client ID</FormLabel>
                  <Input
                    placeholder="Enter Client ID"
                    value={newClient.clientId}
                    onChange={(e) => setNewClient({ ...newClient, clientId: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Company Name</FormLabel>
                  <Input
                    placeholder="Enter Company Name"
                    value={newClient.companyName}
                    onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Contact Name</FormLabel>
                  <Input
                    placeholder="Enter Contact Name"
                    value={newClient.contactName}
                    onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Contact Email</FormLabel>
                  <Input
                    placeholder="Enter Contact Email"
                    value={newClient.contactEmail}
                    onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
            </Stack>

            <Typography level="h6" sx={{ mt: 3, mb: 2 }}>Contract and Financial Details</Typography>
            <Stack spacing={2} direction="row" flexWrap="wrap" gap={2} alignItems="flex-start">
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Contract Start Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="YYYY-MM-DD"
                    value={newClient.contractStartDate}
                    onChange={(e) => setNewClient({ ...newClient, contractStartDate: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Contract End Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="YYYY-MM-DD"
                    value={newClient.contractEndDate}
                    onChange={(e) => setNewClient({ ...newClient, contractEndDate: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Renewal Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="YYYY-MM-DD"
                    value={newClient.renewalDate}
                    onChange={(e) => setNewClient({ ...newClient, renewalDate: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Monthly Recurring Revenue (MRR)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter MRR"
                    value={newClient.mrr}
                    onChange={(e) => setNewClient({ ...newClient, mrr: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Lifetime Value (LTV)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter LTV"
                    value={newClient.ltv}
                    onChange={(e) => setNewClient({ ...newClient, ltv: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                  <Typography level="body-xs" color="neutral" sx={{ mt: 1 }}>
                    Enter the total revenue expected from the client.
                  </Typography>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px', pl: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Subscribed Months</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter Subscribed Months"
                    value={newClient.subscribedMonths}
                    onChange={(e) => setNewClient({ ...newClient, subscribedMonths: e.target.value })}
                    sx={{ height: '40px', pl: 2 }}
                  />
                  <Typography level="body-xs" color="neutral" sx={{ mt: 1 }}>
                    Enter the number of months the client has subscribed.
                  </Typography>
                </FormControl>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="solid" color="primary" onClick={handleCreateClient}>Create</Button>
            </Stack>
          </Card>
        </Modal>
      </PageContainer>
    </ErrorBoundary>
  );
}