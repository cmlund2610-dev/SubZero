/**
 * Analytics Page - Comprehensive Business Intelligence Dashboard with Data Visualizations
 * 
 * Three main dashboards:
 * 1. Overview - High-level KPIs and storytelling visuals
 * 2. Revenue & Growth - Revenue analysis with detailed charts
 * 3. Churn & Retention - Retention analytics and risk assessment
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Table,
  Alert,
  Link as JoyLink,
  Tooltip as JoyTooltip,
  IconButton,
  Avatar,
  Button
} from '@mui/joy';
import { 
  MultilineChartRounded, 
  TrendingUp, 
  TrendingDown,
  Assessment,
  MonetizationOn,
  People,
  Schedule,
  Warning,
  CheckCircle,
  Dashboard,
  Autorenew,
  Info
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { getCompanyClients } from '../lib/clientData.js';
import { useAuth } from '../context/AuthContext.jsx';

// Helper component for metric tooltips
const MetricTooltip = ({ title, description }) => (
  <JoyTooltip 
    title={
      <Box sx={{ maxWidth: 280 }}>
        <Typography level="title-sm" sx={{ mb: 1, color: 'common.white' }}>
          {title}
        </Typography>
        <Typography level="body-xs" sx={{ color: 'common.white' }}>
          {description}
        </Typography>
      </Box>
    }
    placement="top"
    arrow
    variant="solid"
    sx={{
      backgroundColor: 'neutral.800',
      color: 'common.white',
      border: '1px solid',
      borderColor: 'neutral.700',
      boxShadow: 'lg',
      '& .MuiTooltip-arrow': {
        color: 'neutral.800',
      }
    }}
  >
    <IconButton 
      size="sm" 
      variant="plain" 
      color="neutral"
      sx={{ ml: 1, '--IconButton-size': '16px' }}
    >
      <Info sx={{ fontSize: 14 }} />
    </IconButton>
  </JoyTooltip>
);

export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userCompany } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, [userCompany]);

  const loadClients = async () => {
    if (!userCompany?.id) {
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

  // Enhanced analytics calculations with chart data
  const analytics = useMemo(() => {
    if (!clients.length) return null;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    // Basic metrics
    const totalMRR = clients.reduce((sum, client) => sum + (Number(client.mrr) || 0), 0);
    const totalLTV = clients.reduce((sum, client) => sum + (Number(client.ltv) || 0), 0);
    const avgMRR = totalMRR / clients.length;
    const avgLTV = totalLTV / clients.length;
    const avgRetentionPeriod = totalLTV / totalMRR;

    // Active vs Expired Contracts for Donut Chart
    const activeContracts = clients.filter(client => {
      if (!client.contract?.endDate) return true;
      return new Date(client.contract.endDate) >= now;
    });
    const expiredContracts = clients.filter(client => {
      if (!client.contract?.endDate) return false;
      return new Date(client.contract.endDate) < now;
    });

    const contractStatusData = [
      { name: 'Active', value: activeContracts.length, color: '#22c55e' },
      { name: 'Expired', value: expiredContracts.length, color: '#ef4444' }
    ];

    // MRR Trend by Month (from contract start dates)
    const mrrByMonth = {};
    clients.forEach(client => {
      if (client.contract?.startDate && client.mrr) {
        const startDate = new Date(client.contract.startDate);
        const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
        mrrByMonth[monthKey] = (mrrByMonth[monthKey] || 0) + (Number(client.mrr) || 0);
      }
    });

    const mrrTrendData = Object.entries(mrrByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, mrr]) => ({
        month,
        mrr,
        formattedMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    // Renewal Pipeline Timeline
    const renewalsByMonth = {};
    clients.forEach(client => {
      if (client.renewal?.date && client.mrr) {
        const renewalDate = new Date(client.renewal.date);
        if (renewalDate >= now) {
          const monthKey = `${renewalDate.getFullYear()}-${String(renewalDate.getMonth() + 1).padStart(2, '0')}`;
          if (!renewalsByMonth[monthKey]) {
            renewalsByMonth[monthKey] = { count: 0, mrr: 0 };
          }
          renewalsByMonth[monthKey].count += 1;
          renewalsByMonth[monthKey].mrr += (Number(client.mrr) || 0);
        }
      }
    });

    const renewalTimelineData = Object.entries(renewalsByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 12) // Next 12 months
      .map(([month, data]) => ({
        month,
        count: data.count,
        mrr: data.mrr,
        formattedMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    // Top customers by MRR
    const topCustomersByMRR = [...clients]
      .sort((a, b) => (Number(b.mrr) || 0) - (Number(a.mrr) || 0))
      .slice(0, 10)
      .map(client => ({
        id: client.client?.id,
        name: client.company?.name || 'Unknown',
        mrr: Number(client.mrr) || 0,
        ltv: Number(client.ltv) || 0,
        endDate: client.contract?.endDate || 'N/A'
      }));

    // LTV Distribution (histogram buckets)
    const ltvBuckets = [
      { range: '0-10k', min: 0, max: 10000, count: 0 },
      { range: '10k-25k', min: 10000, max: 25000, count: 0 },
      { range: '25k-50k', min: 25000, max: 50000, count: 0 },
      { range: '50k-100k', min: 50000, max: 100000, count: 0 },
      { range: '100k+', min: 100000, max: Infinity, count: 0 }
    ];

    clients.forEach(client => {
      const ltv = Number(client.ltv) || 0;
      const bucket = ltvBuckets.find(b => ltv >= b.min && ltv < b.max);
      if (bucket) bucket.count++;
    });

    // Contract Age vs MRR scatter plot
    const contractAgeScatterData = clients.map(client => {
      const startDate = client.contract?.startDate ? new Date(client.contract.startDate) : null;
      const monthsOld = startDate ? Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30)) : 0;
      return {
        age: monthsOld,
        mrr: Number(client.mrr) || 0,
        ltv: Number(client.ltv) || 0,
        name: client.company?.name || 'Unknown'
      };
    }).filter(d => d.age > 0 && d.mrr > 0);

    // Contract End Date Distribution
    const endDateBuckets = {};
    clients.forEach(client => {
      if (client.contract?.endDate) {
        const endDate = new Date(client.contract.endDate);
        const monthKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
        endDateBuckets[monthKey] = (endDateBuckets[monthKey] || 0) + 1;
      }
    });

    const endDateDistributionData = Object.entries(endDateBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 12)
      .map(([month, count]) => ({
        month,
        count,
        formattedMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    // Retention Curve
    const retentionCurveData = [];
    for (let months = 1; months <= 24; months++) {
      const totalStartedBeforeMonth = clients.filter(client => {
        const startDate = client.contract?.startDate ? new Date(client.contract.startDate) : null;
        return startDate && Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30)) >= months;
      }).length;

      const stillActiveAfterMonth = clients.filter(client => {
        const startDate = client.contract?.startDate ? new Date(client.contract.startDate) : null;
        const endDate = client.contract?.endDate ? new Date(client.contract.endDate) : null;
        
        if (!startDate) return false;
        
        const monthsFromStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));
        const isStillActive = !endDate || endDate >= now;
        
        return monthsFromStart >= months && isStillActive;
      }).length;

      if (totalStartedBeforeMonth > 0) {
        retentionCurveData.push({
          month: months,
          retentionRate: (stillActiveAfterMonth / totalStartedBeforeMonth) * 100
        });
      }
    }

    // Churned Revenue Trend
    const churnedRevenueByMonth = {};
    clients.forEach(client => {
      if (client.contract?.endDate && client.mrr) {
        const endDate = new Date(client.contract.endDate);
        if (endDate < now) {
          const monthKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
          churnedRevenueByMonth[monthKey] = (churnedRevenueByMonth[monthKey] || 0) + client.mrr;
        }
      }
    });

    const churnedRevenueData = Object.entries(churnedRevenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, revenue]) => ({
        month,
        revenue,
        formattedMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    // Renewal calculations
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

    const renewalPipeline30Days = contractsRenewing30Days.reduce((sum, client) => sum + (Number(client.mrr) || 0), 0);
    const renewalPipeline60Days = contractsRenewing60Days.reduce((sum, client) => sum + (Number(client.mrr) || 0), 0);
    const avgContractLength = clients.reduce((sum, client) => sum + (Number(client.subscribedMonths) || 0), 0) / clients.length;

    // At-Risk Analysis
    const medianLTV = [...clients].sort((a, b) => (Number(a.ltv) || 0) - (Number(b.ltv) || 0))[Math.floor(clients.length / 2)]?.ltv || 0;
    const atRiskContracts = clients.filter(client => {
      const renewalDate = client.renewal?.date ? new Date(client.renewal.date) : null;
      const lowLTV = (Number(client.ltv) || 0) < medianLTV;
      const renewingSoon = renewalDate && renewalDate <= thirtyDaysFromNow;
      return lowLTV || renewingSoon;
    });

    return {
      // Basic metrics
      totalMRR,
      totalLTV,
      avgMRR,
      avgLTV,
      avgRetentionPeriod,
      activeCustomers: clients.length,
      
      // Chart data
      contractStatusData,
      mrrTrendData,
      renewalTimelineData,
      topCustomersByMRR,
      ltvBuckets,
      contractAgeScatterData,
      endDateDistributionData,
      retentionCurveData,
      churnedRevenueData,
      
      // Renewal metrics
      contractsRenewing30Days: contractsRenewing30Days.length,
      contractsRenewing60Days: contractsRenewing60Days.length,
      renewalPipeline30Days,
      renewalPipeline60Days,
      avgContractLength,
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

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  // Show loader while fetching from Firestore
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="KPIs and Metrics"
          description="Comprehensive business intelligence dashboard"
          icon={MultilineChartRounded}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size="sm" />
        </Box>
      </PageContainer>
    );
  }

  // Show empty state if no data after loading
  if (!clients.length || !analytics) {
    return (
      <PageContainer>
        <PageHeader
          title="KPIs and Metrics"
          description="Comprehensive business intelligence dashboard"
          icon={MultilineChartRounded}
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

  // Show empty state if no clients
  if (clients.length === 0) {
    return (
      <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
        <PageHeader
          title="Analytics"
          description="Import client data to unlock powerful analytics and insights"
          icon={Assessment}
        />
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography level="body-md">No client data available. Please import data to get started.</Typography>
          <Button variant="solid" color="primary" onClick={() => navigate('/import')}>Import Client Data</Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <PageHeader
        title="KPIs and Metrics"
        description="Comprehensive business intelligence dashboard with data visualizations"
        icon={MultilineChartRounded}
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

        {/* Overview Dashboard - Enhanced with Visualizations */}
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography level="body-sm" color="neutral">Total MRR</Typography>
                        <MetricTooltip 
                          title="Monthly Recurring Revenue (MRR)"
                          description="The total predictable revenue generated from all active subscriptions and contracts on a monthly basis. This is your core recurring revenue stream."
                        />
                      </Box>
                      <Typography level="h2" color="primary">{formatCurrency(analytics.totalMRR)}</Typography>
                    </Stack>
                  </Card>

                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography level="body-sm" color="neutral">Total LTV</Typography>
                        <MetricTooltip 
                          title="Lifetime Value (LTV)"
                          description="The total revenue expected from all customers over their entire relationship with your business. Higher LTV indicates more valuable, long-term customer relationships."
                        />
                      </Box>
                      <Typography level="h2" color="success">{formatCurrency(analytics.totalLTV)}</Typography>
                    </Stack>
                  </Card>

                  <Card sx={{ flex: 1, p: 3 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography level="body-sm" color="neutral">Active Customers</Typography>
                        <MetricTooltip 
                          title="Active Customer Count"
                          description="The total number of customers with contracts that haven't expired. This represents your current customer base size."
                        />
                      </Box>
                      <Typography level="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People />
                        {analytics.activeCustomers}
                      </Typography>
                    </Stack>
                  </Card>
                </Stack>

                {/* MRR Trend Chart */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography level="title-lg">MRR Growth Trend</Typography>
                    <MetricTooltip 
                      title="MRR Growth Over Time"
                      description="Shows how your Monthly Recurring Revenue has grown since customers signed their contracts. Look for consistent upward trends to identify healthy business growth."
                    />
                  </Box>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={analytics.mrrTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="formattedMonth" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <RechartsTooltip formatter={(value) => [formatCurrency(value), 'MRR']} />
                        <Line 
                          type="monotone" 
                          dataKey="mrr" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Stack>

              <Stack spacing={3} sx={{ flex: 1 }}>
                {/* Active vs Expired Contracts Donut */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography level="title-lg">Contract Health</Typography>
                    <MetricTooltip 
                      title="Contract Status Distribution"
                      description="Visual breakdown of active contracts vs expired contracts. A healthy business should have predominantly active contracts (green) with minimal expired contracts (red)."
                    />
                  </Box>
                  <Box sx={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={analytics.contractStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.contractStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>

                {/* Renewal Pipeline Summary */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography level="title-lg">Upcoming Renewals</Typography>
                    <MetricTooltip 
                      title="Short-term Renewal Pipeline"
                      description="Revenue at risk from contracts renewing in the next 30 days. This represents critical revenue that needs renewal attention to prevent churn."
                    />
                  </Box>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography level="body-sm" color="neutral">Next 30 Days</Typography>
                        <MetricTooltip 
                          title="30-Day Renewal Revenue"
                          description="Total MRR from contracts that need to be renewed within the next 30 days. Focus on these contracts to prevent immediate churn."
                        />
                      </Box>
                      <Typography level="h3" color="warning">
                        {formatCurrency(analytics.renewalPipeline30Days)}
                      </Typography>
                      <Typography level="body-xs" color="neutral">
                        {analytics.contractsRenewing30Days} contracts
                      </Typography>
                    </Box>
                    <LinearProgress 
                      determinate 
                      value={Math.min((analytics.renewalPipeline30Days / analytics.totalMRR) * 100, 100)}
                      color="warning"
                    />
                  </Stack>
                </Card>
              </Stack>
            </Stack>

            {/* Renewal Pipeline Timeline */}
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography level="title-lg">Renewal Pipeline Timeline</Typography>
                <MetricTooltip 
                  title="Monthly Renewal Forecast"
                  description="Shows upcoming contract renewals by month with both revenue impact (blue bars) and volume (green bars). Use this to plan renewal campaigns and predict future revenue."
                />
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <RechartsBarChart data={analytics.renewalTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedMonth" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'mrr' ? formatCurrency(value) : value, 
                        name === 'mrr' ? 'Revenue' : 'Contracts'
                      ]} 
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="mrr" fill="#3b82f6" name="MRR Value" />
                    <Bar yAxisId="right" dataKey="count" fill="#22c55e" name="Contract Count" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Stack>
        </TabPanel>

        {/* Revenue & Growth Dashboard - Enhanced */}
        <TabPanel value={1} sx={{ px: 0 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography level="h3" sx={{ mb: 2 }}>
              Revenue & Growth Dashboard
            </Typography>

            {/* Key Metrics Cards */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">Total MRR</Typography>
                    <MetricTooltip 
                      title="Monthly Recurring Revenue"
                      description="Sum of all monthly recurring revenue from active contracts. This is your predictable monthly income from subscriptions."
                    />
                  </Box>
                  <Typography level="h3" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn />
                    {formatCurrency(analytics.totalMRR)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Monthly Recurring Revenue</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">ARPA</Typography>
                    <MetricTooltip 
                      title="Average Revenue Per Account"
                      description="The average monthly revenue generated per customer. Higher ARPA indicates premium customers or successful upselling strategies."
                    />
                  </Box>
                  <Typography level="h3" color="success" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp />
                    {formatCurrency(analytics.avgMRR)}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Revenue per customer</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">Average LTV</Typography>
                    <MetricTooltip 
                      title="Average Lifetime Value"
                      description="The average total revenue expected from each customer over their entire relationship. Higher LTV indicates stronger customer retention and value."
                    />
                  </Box>
                  <Typography level="h3">{formatCurrency(analytics.avgLTV)}</Typography>
                  <Typography level="body-xs" color="neutral">Mean customer value</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">LTV : MRR Ratio</Typography>
                    <MetricTooltip 
                      title="LTV to MRR Multiple"
                      description="How many months of revenue each customer provides on average. A higher ratio indicates better customer retention and longer contract periods."
                    />
                  </Box>
                  <Typography level="h3">{analytics.avgRetentionPeriod.toFixed(1)}x</Typography>
                  <Typography level="body-xs" color="neutral">Average retention months</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* Revenue Analytics Charts */}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              {/* MRR by Contract Start Month */}
              <Card sx={{ flex: 2, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography level="title-lg">MRR by Contract Start Month</Typography>
                  <MetricTooltip 
                    title="Revenue Growth by Acquisition Month"
                    description="Shows when new MRR was added to your business based on contract start dates. Helps identify seasonal patterns and successful growth periods."
                  />
                </Box>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={analytics.mrrTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formattedMonth" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <RechartsTooltip formatter={(value) => [formatCurrency(value), 'MRR']} />
                      <Area 
                        type="monotone"
                        dataKey="mrr"
                        stroke="#3b82f6"
                        fillOpacity={0.3}
                        fill="url(#colorUv)"
                      />
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              {/* Top Customers Table */}
              <Card sx={{ flex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography level="title-lg">Top Customers by MRR</Typography>
                  <MetricTooltip 
                    title="Highest Value Customers"
                    description="The customers contributing the most to your MRR. Focus on retaining these customers as they have the highest revenue impact."
                  />
                </Box>
                <Table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Customer</th>
                      <th style={{ textAlign: 'right' }}>MRR</th>
                      <th style={{ textAlign: 'right' }}>LTV</th>
                      <th style={{ textAlign: 'center' }}>Contract End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCustomersByMRR.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={customer.avatar} sx={{ mr: 2 }} />
                            <Link to={`/customers/${customer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {customer.name}
                            </Link>
                          </Box>
                        </td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(customer.mrr)}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(customer.ltv)}</td>
                        <td style={{ textAlign: 'center' }}>
                          {new Date(customer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Stack>
          </Stack>
        </TabPanel>

        {/* Churn & Retention Dashboard - Enhanced */}
        <TabPanel value={2} sx={{ px: 0 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography level="h3" sx={{ mb: 2 }}>
              Churn & Retention Dashboard
            </Typography>

            {/* Key Metrics Cards */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">Churned Revenue</Typography>
                    <MetricTooltip 
                     
                    />
                  </Box>
                  <Typography level="h3" color="error">
                    {formatCurrency(analytics.churnedRevenueData.reduce((sum, data) => sum + data.revenue, 0))}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Last 12 months</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">Retention Rate</Typography>
                    <MetricTooltip 
                      title="Customer Retention Rate"
                      description="The percentage of customers who remain with your service over a given period. Calculated as the number of customers at the end of the period divided by the number at the start."
                    />
                  </Box>
                  <Typography level="h3" color="success">
                    {analytics.retentionCurveData.length > 0 ? `${analytics.retentionCurveData[analytics.retentionCurveData.length - 1].retentionRate.toFixed(1)}%` : 'N/A'}
                  </Typography>
                  <Typography level="body-xs" color="neutral">24-month trend</Typography>
                </Stack>
              </Card>

              <Card sx={{ flex: 1, p: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography level="body-sm" color="neutral">At-Risk Contracts</Typography>
                    <MetricTooltip 
                      title="Contracts at Risk of Churn"
                      description="The number of contracts that are at risk of churning, based on low LTV or nearing renewal dates. Proactive engagement with these customers is crucial."
                    />
                  </Box>
                  <Typography level="h3" color="warning">
                    {analytics.atRiskContracts}
                  </Typography>
                  <Typography level="body-xs" color="neutral">Immediate attention needed</Typography>
                </Stack>
              </Card>
            </Stack>

            {/* Churn Analysis Charts */}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              {/* Churned Revenue Trend */}
              <Card sx={{ flex: 2, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography level="title-lg">Churned Revenue Trend</Typography>
                  <MetricTooltip 
                    title="Lost Revenue Over Time"
                    description="Tracks the trend of revenue lost to churn on a monthly basis. Helps identify patterns or spikes in churned revenue."
                  />
                </Box>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={analytics.churnedRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formattedMonth" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Churned Revenue']} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              {/* Retention Curve */}
              <Card sx={{ flex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography level="title-lg">Retention Curve</Typography>
                  <MetricTooltip 
                    title="Customer Retention Over Time"
                    description="Shows the percentage of customers retained over time since their contract start. A key metric for understanding customer loyalty and satisfaction."
                  />
                </Box>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={analytics.retentionCurveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <RechartsTooltip formatter={(value) => [value, 'Retention Rate']} />
                      <Line 
                        type="monotone" 
                        dataKey="retentionRate" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Stack>
          </Stack>
        </TabPanel>
      </Tabs>
    </PageContainer>
  );
}
