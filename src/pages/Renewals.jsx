/**
 * Renewals Page - Contract renewals tracking with stages
 * 
 * Shows renewal pipeline with different stages and upcoming renewals.
 * Uses imported client data to calculate renewal dates and pipeline.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Chip, 
  Card,
  Table,
  Button,
  Grid,
  Link,
  Select,
  Option
} from '@mui/joy';
import { 
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Receipt
} from '@mui/icons-material';
import { ImportedData } from '../lib/persist.js';
import EnhancedNavigation from '../components/EnhancedNavigation.jsx';
import HelpTooltip from '../components/HelpTooltip.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function Renewals() {
  const [activeStage, setActiveStage] = useState('all');
  const navigate = useNavigate();
  
  // State to track renewal data with stage/probability changes
  const [renewalsData, setRenewalsData] = useState({});
  
  // Get client data and calculate renewals
  const clients = ImportedData.getClients();
  
  const upcomingRenewals = useMemo(() => {
    if (clients.length === 0) return [];
    
    return clients
      .filter(client => client.renewal?.date)
      .map(client => {
        const renewalDate = new Date(client.renewal.date);
        const today = new Date();
        const daysUntil = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
        
        // Use stored data if available, otherwise use defaults
        const stored = renewalsData[client.id] || {};
        
        return {
          id: client.id,
          company: client.company?.name || 'Unknown Company',
          renewalDate: client.renewal.date,
          currentMRR: client.mrr || 0,
          proposedMRR: client.mrr || 0, // In real app, this would be separate
          stage: stored.stage || 'forecast', // Use stored or default stage
          probability: stored.probability !== undefined ? stored.probability : (client.health?.score || 50),
          csm: client.csm?.owner || 'Unassigned',
          daysUntil
        };
      })
      .filter(renewal => renewal.daysUntil <= 90 && renewal.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [clients, renewalsData]);

  // Show empty state if no renewals
  if (upcomingRenewals.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Contract Renewals"
          description="Track and manage contract renewals across your client portfolio"
          icon={Receipt}
        >
          <HelpTooltip text="Track renewal timelines, success probability, and revenue impact across your client portfolio" />
        </PageHeader>
        
        {clients.length === 0 ? (
          <Card 
            variant="outlined" 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              border: '2px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>📋</Typography>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Track Contract Renewals
            </Typography>
            <Typography level="body-md" color="neutral" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Import your client data to unlock powerful renewal tracking features:
            </Typography>
            
            <Box sx={{ textAlign: 'left', mb: 4, maxWidth: 300, mx: 'auto' }}>
              <Stack spacing={1}>
                <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  📊 Pipeline forecasting and weighted revenue projections
                </Typography>
                <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⏰ Automated renewal alerts and timeline tracking
                </Typography>
                <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎯 Success probability scoring and risk assessment
                </Typography>
                <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  📈 Stage-based workflow management
                </Typography>
              </Stack>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button 
                size="lg"
                sx={{
                  background: '#FF6D56',
                  color: 'white',
                  '&:hover': {
                    background: '#E55F4C',
                  }
                }}
                onClick={() => window.location.href = '/data'}
              >
                Import Client Data
              </Button>
              <Button variant="outlined" color="neutral">
                View Demo
              </Button>
            </Stack>
          </Card>
        ) : (
          <Card 
            variant="outlined" 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              border: '2px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>✅</Typography>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              All Caught Up!
            </Typography>
            <Typography level="body-md" color="neutral" sx={{ mb: 3 }}>
              No upcoming renewals in the next 90 days. Your renewal pipeline is clear.
            </Typography>
            <Button variant="outlined" color="neutral">
              View All Contracts
            </Button>
          </Card>
        )}
      </PageContainer>
    );
  }

  // Renewal stages configuration
  const renewalStages = {
    all: { label: 'All', color: 'neutral' },
    forecast: { label: 'Forecast', color: 'primary' },
    tentative: { label: 'Tentative', color: 'warning' },
    negotiation: { label: 'Negotiation', color: 'warning' },
    closed_won: { label: 'Closed Won', color: 'success' },
    closed_lost: { label: 'Closed Lost', color: 'danger' }
  };

  const getStageColor = (stage) => {
    return renewalStages[stage]?.color || 'neutral';
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'success';
    if (probability >= 60) return 'warning';
    return 'danger';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handlers for updating stage and probability
  const handleStageChange = (clientId, newStage) => {
    setRenewalsData(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        stage: newStage
      }
    }));
  };

  const handleProbabilityChange = (clientId, newProbability) => {
    setRenewalsData(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        probability: newProbability
      }
    }));
  };

    // Filter renewals by stage
  const filteredRenewals = activeStage === 'all' 
    ? upcomingRenewals 
    : upcomingRenewals.filter(renewal => renewal.stage === activeStage);

  // Calculate stage counts
  const stages = Object.keys(renewalStages).map(key => {
    const count = key === 'all' 
      ? upcomingRenewals.length 
      : upcomingRenewals.filter(r => r.stage === key).length;
    return {
      key,
      label: renewalStages[key].label,
      color: renewalStages[key].color,
      count
    };
  });

  // Total Pipeline is the sum of ALL current MRR from clients with upcoming renewals
  const totalPipeline = upcomingRenewals.reduce((sum, renewal) => sum + Number(renewal.currentMRR || 0), 0);
  
  // Weighted Value is probability-adjusted proposed MRR
  const weightedValue = filteredRenewals.reduce((sum, renewal) => 
    sum + (Number(renewal.proposedMRR || 0) * Number(renewal.probability || 0) / 100), 0
  );
  
  // Average probability across all renewals
  const avgProbability = filteredRenewals.length > 0
    ? Math.round(filteredRenewals.reduce((sum, renewal) => sum + renewal.probability, 0) / filteredRenewals.length)
    : 0;

  return (
    <PageContainer>
      {/* Page header */}
      <PageHeader
        title="Contract Renewals"
        description="Track and manage your renewal pipeline"
        icon={Receipt}
      >
        <HelpTooltip text="Track renewal timelines, success probability, and revenue impact across your client portfolio" />
      </PageHeader>

      {/* Summary metrics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography level="body-sm" color="neutral">Total Pipeline</Typography>
              <Typography level="h2" color="primary">
                {formatCurrency(totalPipeline)}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography level="body-sm" color="neutral">Weighted Value</Typography>
              <Typography level="h2" color="success">
                {formatCurrency(weightedValue)}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography level="body-sm" color="neutral">Active Renewals</Typography>
              <Typography level="h2">
                {filteredRenewals.length}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography level="body-sm" color="neutral">Avg Probability</Typography>
              <Typography level="h2">
                {avgProbability}%
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Stage filters */}
      <Box sx={{ mb: 3 }}>
        <Typography level="title-md" sx={{ mb: 2 }}>
          Renewal Stages
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {stages.map((stage) => (
            <Chip
              key={stage.key}
              variant={activeStage === stage.key ? 'solid' : 'outlined'}
              color={stage.color}
              onClick={() => setActiveStage(stage.key)}
              sx={{ cursor: 'pointer' }}
            >
              {stage.label} ({stage.count})
            </Chip>
          ))}
        </Stack>
      </Box>

      {/* Renewals table */}
      <Card variant="outlined">
        <Table hoverRow>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Company</th>
              <th style={{ width: '12%' }}>Days Until</th>
              <th style={{ width: '13%' }}>Renewal Date</th>
              <th style={{ width: '13%' }}>Current MRR</th>
              <th style={{ width: '13%' }}>Proposed MRR</th>
              <th style={{ width: '10%' }}>Stage</th>
              <th style={{ width: '10%' }}>Probability</th>
              <th style={{ width: '9%' }}>CSM</th>
            </tr>
          </thead>
          <tbody>
            {filteredRenewals.map((renewal) => (
              <tr key={renewal.id}>
                <td>
                  <Link
                    onClick={() => navigate(`/clients/${renewal.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: 'primary.500',
                      '&:hover': {
                        color: 'primary.700',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {renewal.company}
                  </Link>
                </td>
                <td>
                  <Chip 
                    size="sm" 
                    variant="soft" 
                    color={renewal.daysUntil <= 7 ? 'danger' : renewal.daysUntil <= 30 ? 'warning' : 'neutral'}
                  >
                    {renewal.daysUntil} days
                  </Chip>
                </td>
                <td>
                  <Typography level="body-sm">
                    {new Date(renewal.renewalDate).toLocaleDateString()}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {formatCurrency(renewal.currentMRR)}
                  </Typography>
                </td>
                <td>
                  <Stack spacing={0.5}>
                    <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                      {formatCurrency(renewal.proposedMRR)}
                    </Typography>
                    {renewal.proposedMRR !== renewal.currentMRR && (
                      <Typography 
                        level="body-xs" 
                        color={renewal.proposedMRR > renewal.currentMRR ? 'success' : 'danger'}
                      >
                        {renewal.proposedMRR > renewal.currentMRR ? '+' : ''}
                        {formatCurrency(renewal.proposedMRR - renewal.currentMRR)}
                      </Typography>
                    )}
                  </Stack>
                </td>
                <td>
                  <Select
                    value={renewal.stage}
                    onChange={(e, value) => handleStageChange(renewal.id, value)}
                    size="sm"
                    variant="soft"
                    color={getStageColor(renewal.stage)}
                    sx={{ minWidth: 120 }}
                  >
                    <Option value="forecast">Forecast</Option>
                    <Option value="tentative">Tentative</Option>
                    <Option value="negotiation">Negotiation</Option>
                    <Option value="closed_won">Closed Won</Option>
                    <Option value="closed_lost">Closed Lost</Option>
                  </Select>
                </td>
                <td>
                  <Select
                    value={renewal.probability}
                    onChange={(e, value) => handleProbabilityChange(renewal.id, value)}
                    size="sm"
                    variant="soft"
                    color={getProbabilityColor(renewal.probability)}
                    sx={{ minWidth: 80 }}
                  >
                    <Option value={0}>0%</Option>
                    <Option value={10}>10%</Option>
                    <Option value={20}>20%</Option>
                    <Option value={30}>30%</Option>
                    <Option value={40}>40%</Option>
                    <Option value={50}>50%</Option>
                    <Option value={60}>60%</Option>
                    <Option value={70}>70%</Option>
                    <Option value={80}>80%</Option>
                    <Option value={90}>90%</Option>
                    <Option value={100}>100%</Option>
                  </Select>
                </td>
                <td>
                  <Typography level="body-sm">
                    {renewal.csm}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" color="neutral" startDecorator={<CalendarIcon />}>
          Export Calendar
        </Button>
        <Button variant="outlined" color="neutral" startDecorator={<TrendingUpIcon />}>
          View Analytics
        </Button>
      </Stack>
    </PageContainer>
  );
}