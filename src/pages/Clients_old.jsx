/**
 * Clients Page - Client list with table view
 * 
 * Displays all clients in a Joy Table with key columns:
 * Company, Health, Risk, MRR, CSM, Industry
 * 
 * To integrate with data: replace placeholder data with actual client records
 * and add search, filtering, and pagination as needed.
 */

import React from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Table, 
  Button, 
  Chip,
  Input,
  Card
} from '@mui/joy';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

export default function Clients() {
  // Placeholder client data
  const mockClients = [
    {
      id: 'client-001',
      company: 'TechFlow Solutions',
      health: 85,
      risk: 'low',
      mrr: 12500,
      csm: 'Alex Rodriguez',
      industry: 'Software'
    },
    {
      id: 'client-002', 
      company: 'Retail Dynamics Inc',
      health: 42,
      risk: 'high',
      mrr: 3200,
      csm: 'Jessica Park',
      industry: 'Retail'
    },
    {
      id: 'client-003',
      company: 'FinanceFirst Group', 
      health: 92,
      risk: 'low',
      mrr: 8750,
      csm: 'Maria Santos',
      industry: 'Financial Services'
    },
    {
      id: 'client-004',
      company: 'HealthTech Systems',
      health: 67,
      risk: 'medium',
      mrr: 5400,
      csm: 'Alex Rodriguez',
      industry: 'Healthcare'
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const formatMRR = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box>
      {/* Page header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1}>
          <Typography level="h1" sx={{ fontWeight: 700 }}>
            Clients
          </Typography>
          <Typography level="body-md" color="neutral">
            Manage your client portfolio and track their success metrics
          </Typography>
        </Stack>
        
        <Button 
          variant="solid" 
          color="primary" 
          startDecorator={<AddIcon />}
        >
          Add Client
        </Button>
      </Stack>

      {/* Search and filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Input
          placeholder="Search clients..."
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <Button variant="outlined" color="neutral">
          Filter
        </Button>
        <Button variant="outlined" color="neutral">
          Export
        </Button>
      </Stack>

      {/* Client table */}
      <Card variant="outlined">
        <Table 
          hoverRow 
          sx={{ 
            '& thead th:nth-of-type(1)': { width: '25%' },
            '& thead th:nth-of-type(2)': { width: '10%' },
            '& thead th:nth-of-type(3)': { width: '10%' },
            '& thead th:nth-of-type(4)': { width: '15%' },
            '& thead th:nth-of-type(5)': { width: '20%' },
            '& thead th:nth-of-type(6)': { width: '20%' }
          }}
        >
          <thead>
            <tr>
              <th>Company</th>
              <th>Health</th>
              <th>Risk</th>
              <th>MRR</th>
              <th>CSM</th>
              <th>Industry</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map((client) => (
/**
 * Clients Page - Client list with table view
 * 
 * Displays all clients in a Joy Table with key columns:
 * Company, Health, Risk, MRR, CSM, Industry
 * 
 * Supports navigation to client detail pages.
 * To integrate with data: replace placeholder data with actual client records
 * and add search, filtering, and pagination as needed.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Table, 
  Button, 
  Chip,
  Input,
  Card
} from '@mui/joy';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

export default function Clients() {
  const navigate = useNavigate();

  // Placeholder client data
  const mockClients = [
    {
      id: 'client-001',
      company: 'TechFlow Solutions',
      health: 85,
      risk: 'low',
      mrr: 12500,
      csm: 'Alex Rodriguez',
      industry: 'Software'
    },
    {
      id: 'client-002', 
      company: 'Retail Dynamics Inc',
      health: 42,
      risk: 'high',
      mrr: 3200,
      csm: 'Jessica Park',
      industry: 'Retail'
    },
    {
      id: 'client-003',
      company: 'FinanceFirst Group', 
      health: 92,
      risk: 'low',
      mrr: 8750,
      csm: 'Maria Santos',
      industry: 'Financial Services'
    },
    {
      id: 'client-004',
      company: 'HealthTech Systems',
      health: 67,
      risk: 'medium',
      mrr: 5400,
      csm: 'Alex Rodriguez',
      industry: 'Healthcare'
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const formatMRR = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <Box>
      {/* Page header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1}>
          <Typography level="h1" sx={{ fontWeight: 700 }}>
            Clients
          </Typography>
          <Typography level="body-md" color="neutral">
            Manage your client portfolio and track their success metrics
          </Typography>
        </Stack>
        
        <Button 
          variant="solid" 
          color="primary" 
          startDecorator={<AddIcon />}
        >
          Add Client
        </Button>
      </Stack>

      {/* Search and filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Input
          placeholder="Search clients..."
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <Button variant="outlined" color="neutral">
          Filter
        </Button>
        <Button variant="outlined" color="neutral">
          Export
        </Button>
      </Stack>

      {/* Client table */}
      <Card variant="outlined">
        <Table 
          hoverRow 
          sx={{ 
            '& thead th:nth-of-type(1)': { width: '25%' },
            '& thead th:nth-of-type(2)': { width: '10%' },
            '& thead th:nth-of-type(3)': { width: '10%' },
            '& thead th:nth-of-type(4)': { width: '15%' },
            '& thead th:nth-of-type(5)': { width: '20%' },
            '& thead th:nth-of-type(6)': { width: '20%' }
          }}
        >
          <thead>
            <tr>
              <th>Company</th>
              <th>Health</th>
              <th>Risk</th>
              <th>MRR</th>
              <th>CSM</th>
              <th>Industry</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map((client) => (
              <tr 
                key={client.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleClientClick(client.id)}
              >
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {client.company}
                  </Typography>
                </td>
                <td>
                  <Chip 
                    size="sm" 
                    variant="soft" 
                    color={getHealthColor(client.health)}
                  >
                    {client.health}%
                  </Chip>
                </td>
                <td>
                  <Chip 
                    size="sm" 
                    variant="soft" 
                    color={getRiskColor(client.risk)}
                  >
                    {client.risk}
                  </Chip>
                </td>
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {formatMRR(client.mrr)}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {client.csm}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm" color="neutral">
                    {client.industry}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Table footer with pagination placeholder */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mt: 2 }}
      >
        <Typography level="body-sm" color="neutral">
          Showing {mockClients.length} of {mockClients.length} clients
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button size="sm" variant="outlined" disabled>
            Previous
          </Button>
          <Button size="sm" variant="outlined" disabled>
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {client.company}
                  </Typography>
                </td>
                <td>
                  <Chip 
                    size="sm" 
                    variant="soft" 
                    color={getHealthColor(client.health)}
                  >
                    {client.health}%
                  </Chip>
                </td>
                <td>
                  <Chip 
                    size="sm" 
                    variant="soft" 
                    color={getRiskColor(client.risk)}
                  >
                    {client.risk}
                  </Chip>
                </td>
                <td>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {formatMRR(client.mrr)}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {client.csm}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm" color="neutral">
                    {client.industry}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Table footer with pagination placeholder */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mt: 2 }}
      >
        <Typography level="body-sm" color="neutral">
          Showing {mockClients.length} of {mockClients.length} clients
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button size="sm" variant="outlined" disabled>
            Previous
          </Button>
          <Button size="sm" variant="outlined" disabled>
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}