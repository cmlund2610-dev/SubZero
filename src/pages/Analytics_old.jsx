/**
 * Analytics Page - Comprehensive Business Intelligence Dashboard
 * 
 * Three main dashboards:
 * 1. Overview - High-level KPIs and trends
 * 2. Revenue & Growth - MRR, LTV, growth metrics
 * 3. Churn & Retention - Renewal pipeline, churn analysis
 */

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Card, 
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Chip,
  LinearProgress,
  Table,
  Alert
} from '@mui/joy';
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown,
  Assessment,
  MonetizationOn,
  People,
  Schedule,
  Warning,
  CheckCircle,
  Dashboard,
  Autorenew
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { ImportedData } from '../lib/persist.js';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0);
  const clients = ImportedData.getClients();

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!clients.length) return null;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    // Revenue & Growth Metrics
    const totalMRR = clients.reduce((sum, client) => sum + (client.mrr || 0), 0);
    const totalLTV = clients.reduce((sum, client) => sum + (client.ltv || 0), 0);
    const avgMRR = totalMRR / clients.length;
    const avgLTV = totalLTV / clients.length;
    const avgRetentionPeriod = totalLTV / totalMRR;

    // Top customers by MRR
    const topCustomersByMRR = [...clients]
      .sort((a, b) => (b.mrr || 0) - (a.mrr || 0))
      .slice(0, 10)
      .map(client => ({
        name: client.company?.name || 'Unknown',
        mrr: client.mrr || 0,
        ltv: client.ltv || 0
      }));

    // Renewal Analysis
    const contractsRenewing30Days = clients.filter(client => {
      if (!client.renewal?.date) return false;
      const renewalDate = new Date(client.renewal.date);
      return renewalDate <= thirtyDaysFromNow && renewalDate >= now;
    });

    const contractsRenewing60Days = clients.filter(client => {
      if (!client.renewal?.date) return false;
      const renewalDate = new Date(client.renewal.date);
      return renewalDate <= sixtyDaysFromNow && renewalDate >= now;
    });

    const renewalPipeline30Days = contractsRenewing30Days.reduce((sum, client) => sum + (client.mrr || 0), 0);
    const renewalPipeline60Days = contractsRenewing60Days.reduce((sum, client) => sum + (client.mrr || 0), 0);

    // Churn Analysis
    const expiredContracts = clients.filter(client => {
      if (!client.contract?.endDate) return false;
      return new Date(client.contract.endDate) < now;
    });

    const avgContractLength = clients.reduce((sum, client) => sum + (client.subscribedMonths || 0), 0) / clients.length;

    // At-Risk Analysis
    const medianLTV = [...clients].sort((a, b) => (a.ltv || 0) - (b.ltv || 0))[Math.floor(clients.length / 2)]?.ltv || 0;
    const atRiskContracts = clients.filter(client => {
      const renewalDate = client.renewal?.date ? new Date(client.renewal.date) : null;
      const lowLTV = (client.ltv || 0) < medianLTV;
      const renewingSoon = renewalDate && renewalDate <= thirtyDaysFromNow;
      return lowLTV || renewingSoon;
    });

    return {
      // Revenue & Growth
      totalMRR,
      totalLTV,
      avgMRR,
      avgLTV,
      avgRetentionPeriod,
      topCustomersByMRR,
      activeCustomers: clients.length,

      // Renewals & Pipeline
      contractsRenewing30Days: contractsRenewing30Days.length,
      contractsRenewing60Days: contractsRenewing60Days.length,
      renewalPipeline30Days,
      renewalPipeline60Days,
      avgContractLength,

      // Churn & Risk
      expiredContracts: expiredContracts.length,
      atRiskContracts: atRiskContracts.length,
      medianLTV
    };
  }, [clients]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Show empty state if no data
  if (!clients.length || !analytics) {
    return (
      <PageContainer>
        <PageHeader
          title="Analytics"
          description="Comprehensive business intelligence dashboard"
          icon={BarChart}
        />
        <Alert color="primary" sx={{ mt: 3 }}>
          <Typography level="title-sm" sx={{ mb: 1 }}>
            No Data Available
          </Typography>
          <Typography level="body-sm">
            Import client data to see comprehensive analytics across revenue, retention, and growth metrics.
          </Typography>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Comprehensive business intelligence dashboard"
        icon={BarChart}
      />

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <TabList>
          <Tab sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Dashboard sx={{ fontSize: 16 }} />
            Overview
          </Tab>
          <Tab sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 16 }} />
            Revenue & Growth
          </Tab>
          <Tab sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Autorenew sx={{ fontSize: 16 }} />
            Churn & Retention
          </Tab>
        </TabList>

        {/* Overview Dashboard */}
        <TabPanel value={0} sx={{ px: 0 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography level="h3" sx={{ mb: 2 }}>
              Overview Dashboard
            </Typography>

            {/* Executive KPIs */}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <Stack spacing={3} sx={{ flex: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Typography level="body-sm" color="neutral">Total MRR</Typography>
                      <Typography level="h2" color="primary">{formatCurrency(analytics.totalMRR)}</Typography>
                    </Stack>
                  </Card>

                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Typography level="body-sm" color="neutral">Total LTV</Typography>
                      <Typography level="h2" color="success">{formatCurrency(analytics.totalLTV)}</Typography>
                    </Stack>
                  </Card>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Typography level="body-sm" color="neutral">Active Customers</Typography>
                      <Typography level="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People />
                        {analytics.activeCustomers}
                      </Typography>
                    </Stack>
                  </Card>

                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Typography level="body-sm" color="neutral">Avg. Contract Length</Typography>
                      <Typography level="h2">{analytics.avgContractLength.toFixed(1)}m</Typography>
                    </Stack>
                  </Card>
                </Stack>
              </Stack>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Renewal Pipeline (Next 60 Days)</Typography>
                  <Typography level="h2" color="primary">
                    {formatCurrency(analytics.renewalPipeline60Days)}
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {analytics.contractsRenewing60Days} contracts renewing
                  </Typography>
                  <LinearProgress 
                    determinate 
                    value={Math.min((analytics.renewalPipeline60Days / analytics.totalMRR) * 100, 100)}
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                </Stack>
              </Card>
            </Stack>

            {/* Business Health Indicators */}
            <Typography level="title-lg" sx={{ mt: 2 }}>Business Health Indicators</Typography>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" />
                    Positive Indicators
                  </Typography>
                  <Stack spacing={1}>
                    <Typography level="body-sm">• Average LTV: {formatCurrency(analytics.avgLTV)}</Typography>
                    <Typography level="body-sm">• Average retention: {analytics.avgRetentionPeriod.toFixed(1)} months</Typography>
                    <Typography level="body-sm">• Revenue pipeline: {formatCurrency(analytics.renewalPipeline60Days)}</Typography>
                  </Stack>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" />
                    Areas for Attention
                  </Typography>
                  <Stack spacing={1}>
                    <Typography level="body-sm">• At-risk contracts: {analytics.atRiskContracts}</Typography>
                    <Typography level="body-sm">• Expired contracts: {analytics.expiredContracts}</Typography>
                    <Typography level="body-sm">• Renewals in 30 days: {analytics.contractsRenewing30Days}</Typography>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </TabPanel>

        {/* Revenue & Growth Dashboard */}
        <TabPanel value={1} sx={{ px: 0 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography level="h3" sx={{ mb: 2 }}>
              Revenue & Growth Dashboard
            </Typography>

            {/* Key Metrics Cards */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Total MRR</Typography>
                  <Typography level="h3" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn />
                    {formatCurrency(analytics.totalMRR)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Monthly Recurring Revenue</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Average MRR per Account (ARPA)</Typography>
                  <Typography level="h3" color="success" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp />
                    {formatCurrency(analytics.avgMRR)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Revenue per customer</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Total LTV</Typography>
                  <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment />
                    {formatCurrency(analytics.totalLTV)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Lifetime Value</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* LTV Metrics */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Average LTV per Customer</Typography>
                  <Typography level="h3">{formatCurrency(analytics.avgLTV)}</Typography>
                  <Typography level="body-xs" color="neutral">Mean customer value</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">LTV : MRR Ratio</Typography>
                  <Typography level="h3">{analytics.avgRetentionPeriod.toFixed(1)}x</Typography>
                  <Typography level="body-xs" color="neutral">Average retention months</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* Top Customers Table */}
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography level="h4" sx={{ mb: 3 }}>Top 10 Customers by MRR</Typography>
                <Table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>MRR</th>
                      <th>LTV</th>
                      <th>LTV/MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCustomersByMRR.map((customer, index) => (
                      <tr key={index}>
                        <td>{customer.name}</td>
                        <td>{formatCurrency(customer.mrr)}</td>
                        <td>{formatCurrency(customer.ltv)}</td>
                        <td>{customer.mrr > 0 ? (customer.ltv / customer.mrr).toFixed(1) + 'x' : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </Card>
          </Stack>
        </TabPanel>

        {/* Churn & Retention Dashboard */}
        <TabPanel value={2} sx={{ px: 0 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography level="h3" sx={{ mb: 2 }}>
              Churn & Retention Dashboard
            </Typography>

            {/* Renewal Pipeline */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Contracts Renewing in Next 30 Days</Typography>
                  <Typography level="h3" color="warning" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule />
                    {analytics.contractsRenewing30Days}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Upcoming renewals</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Renewal Pipeline Value (30 Days)</Typography>
                  <Typography level="h3" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn />
                    {formatCurrency(analytics.renewalPipeline30Days)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Revenue at risk</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Renewal Pipeline Value (60 Days)</Typography>
                  <Typography level="h3" color="primary">
                    {formatCurrency(analytics.renewalPipeline60Days)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Extended pipeline</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* Retention Metrics */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Average Contract Length</Typography>
                  <Typography level="h3">{analytics.avgContractLength.toFixed(1)} months</Typography>
                  <Typography level="body-xs" color="neutral">Average engagement duration</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Average Retention Period</Typography>
                  <Typography level="h3">{analytics.avgRetentionPeriod.toFixed(1)} months</Typography>
                  <Typography level="body-xs" color="neutral">Estimated customer lifespan</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* Risk Analysis */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">Expired Contracts</Typography>
                  <Typography level="h3" color="danger" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning />
                    {analytics.expiredContracts}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Contracts past end date</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Typography level="body-sm" color="neutral">At-Risk Contracts</Typography>
                  <Typography level="h3" color="warning" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning />
                    {analytics.atRiskContracts}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Need attention</Typography>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </TabPanel>
      </Tabs>
    </PageContainer>
  );
}