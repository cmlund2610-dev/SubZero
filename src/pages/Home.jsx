/**
 * Home Page - Professional dashboard with client statistics and insights
 * 
 * Clean, professional dashboard showing key metrics and actionable insights.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, Card, Grid, Divider, List, ListItem, ListItemDecorator, Checkbox, CircularProgress } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { HomeRounded as HomeIcon, CheckCircle, TrendingUp, ArrowForward, NotificationsActive, Assessment, PeopleAlt, AssignmentTurnedIn, Warning, CalendarToday } from '@mui/icons-material';

// Import utilities
import { getCompanyClients, getClientTasks } from '../lib/clientData.js';
import { useAuth } from '../context/AuthContext.jsx';

// Import dashboard components
import UpcomingRenewals from '../features/dashboard/UpcomingRenewals.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function Home() {
  const [clients, setClients] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userCompany } = useAuth();

  // Load clients and tasks
  useEffect(() => {
    loadData();
  }, [userCompany]);

  const loadData = async () => {
    if (!userCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const firestoreClients = await getCompanyClients(userCompany.id);
      setClients(firestoreClients || []);
      // End initial loading after clients; tasks will load separately
      setLoading(false);
      // Kick off tasks loading asynchronously
      loadUpcomingTasks(firestoreClients || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setClients([]);
      setUpcomingTasks([]);
    } finally {
      // loading already handled; keep consistent
    }
  };

  const loadUpcomingTasks = async (clientsList) => {
    if (!userCompany?.id || !clientsList.length) return;
    try {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      // Fetch tasks for all clients in parallel
      const taskArrays = await Promise.all(
        clientsList.map(async (client) => {
          try {
            const clientTasks = await getClientTasks(userCompany.id, client.id);
            return clientTasks
              .filter(task => {
                if (task.completed) return false;
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate >= now && dueDate <= sevenDaysFromNow;
              })
              .map(task => ({
                ...task,
                clientId: client.id,
                clientName: client.company?.name || 'Unknown Client'
              }));
          } catch (e) {
            console.error(`Error loading tasks for client ${client.id}:`, e);
            return [];
          }
        })
      );
      const combined = taskArrays.flat().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setUpcomingTasks(combined);
    } catch (error) {
      console.error('Error loading upcoming tasks:', error);
      setUpcomingTasks([]);
    }
  };

  // Calculate total MRR using the same logic as Analytics page
  const totalMRR = clients.reduce((sum, client) => sum + (Number(client.mrr) || 0), 0);

  // Calculate renewals in next 90 days
  const renewalsIn90Days = clients.filter(c => {
    const renewalDate = c.renewal?.date;
    if (!renewalDate) return false;
    const daysUntil = Math.ceil((new Date(renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 90 && daysUntil >= 0;
  }).length;

  // While loading from Firestore, render a lightweight skeleton to avoid empty-state flicker
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Home"
          description="Overview of your customer success metrics"
          icon={HomeIcon}
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
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        px: 4
      }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <Box
              component="img"
              src="/Submark.logo.orange.svg"
              alt="subzero Logo"
              sx={{
                width: 80,
                height: 80,
                filter: 'drop-shadow(0 4px 8px rgba(255, 109, 86, 0.2))',
              }}
            />
          </Box>
          <Typography level="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to SubZero
          </Typography>
          <Typography level="body-lg" color="neutral" sx={{ maxWidth: '500px', mx: 'auto', mb: 4 }}>
            Your customer success management platform. Import your client data to unlock powerful analytics and insights.
          </Typography>
        </Box>

        <Stack spacing={2} direction="row" justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Button 
            size="lg"
            sx={{ 
              px: 4, 
              py: 1.5,
              background: '#FF6D56',
              '&:hover': {
                background: '#E55F4C',
              }
            }} 
            onClick={() => navigate('/data')}
          >
            Import Client Data
          </Button>
          <Button 
            variant="outlined" 
            size="lg"
            sx={{ px: 4, py: 1.5 }}
            onClick={() => navigate('/analytics')}
          >
            View Demo Analytics
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ mt: 6, maxWidth: '900px', mx: 'auto' }}>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <PeopleAlt sx={{ fontSize: 40, color: '#FF6D56', mb: 1 }} />
              <Typography level="title-md" sx={{ mb: 0.5, fontWeight: 600 }}>
                Health Scores
              </Typography>
              <Typography level="body-xs" color="neutral">
                Predict churn and identify opportunities
              </Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <AssignmentTurnedIn sx={{ fontSize: 40, color: '#FF6D56', mb: 1 }} />
              <Typography level="title-md" sx={{ mb: 0.5, fontWeight: 600 }}>
                Renewals
              </Typography>
              <Typography level="body-xs" color="neutral">
                Track contracts and automate alerts
              </Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#FF6D56', mb: 1 }} />
              <Typography level="title-md" sx={{ mb: 0.5, fontWeight: 600 }}>
                Revenue
              </Typography>
              <Typography level="body-xs" color="neutral">
                Monitor MRR and growth trends
              </Typography>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="soft" sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: '#FF6D56', mb: 1 }} />
              <Typography level="title-md" sx={{ mb: 0.5, fontWeight: 600 }}>
                Risk Alerts
              </Typography>
              <Typography level="body-xs" color="neutral">
                Catch issues before they escalate
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Home"
        description="Overview of your customer success metrics"
        icon={HomeIcon}
      />

      {/* Welcome Banner */}
      <Card variant="soft" sx={{ mb: 3, background: 'linear-gradient(135deg, #FF6D56 0%, #FF8A75 100%)' }}>
        <Box sx={{ p: 3 }}>
          <Typography level="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Welcome back to SubZero
          </Typography>
          <Typography level="body-md" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
            Here's what's happening with your customer portfolio today
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button 
              variant="solid" 
              sx={{ 
                bgcolor: 'white', 
                color: '#FF6D56',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
              onClick={() => navigate('/clients')}
              endDecorator={<ArrowForward />}
            >
              View All Clients
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* Two-column layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' }, gap: 3 }}>
        
        {/* Left column - Recent Activity & Tasks */}
        <Stack spacing={3}>
          
          {/* Key Metrics Overview */}
          <Card variant="outlined">
            <Box sx={{ p: 3 }}>
              <Typography level="title-lg" sx={{ mb: 3, fontWeight: 700 }}>
                Key Metrics Overview
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Box>
                    <Typography level="h2" sx={{ fontWeight: 700, color: '#FF6D56' }}>
                      {clients.length}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Total Clients
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid xs={6}>
                  <Box>
                    <Typography level="h2" sx={{ fontWeight: 700, color: 'success.500' }}>
                      ${(totalMRR / 1000).toFixed(1)}K
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Total MRR
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid xs={6}>
                  <Box>
                    <Typography level="h2" sx={{ fontWeight: 700, color: 'warning.500' }}>
                      {renewalsIn90Days}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Renewals (90 days)
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid xs={6}>
                  <Box>
                    <Typography level="h2" sx={{ fontWeight: 700, color: 'danger.500' }}>
                      {clients.filter(c => (c.healthScore || 0) < 50).length}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      At-Risk Clients
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Upcoming Tasks */}
          <Card variant="outlined">
            <Box sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CalendarToday sx={{ color: '#FF6D56' }} />
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Upcoming Tasks
                </Typography>
              </Stack>
              
              <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
                Tasks due in the next 7 days
              </Typography>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography level="body-sm" color="neutral">
                    Loading tasks...
                  </Typography>
                </Box>
              ) : upcomingTasks.length > 0 ? (
                <List>
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <ListItem 
                      key={task.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'background.level1' },
                        borderRadius: 'sm',
                        mb: 1
                      }}
                      onClick={() => navigate(`/clients/${task.clientId}`)}
                    >
                      <ListItemDecorator>
                        <Checkbox 
                          size="sm" 
                          checked={false} 
                          disabled
                          sx={{ pointerEvents: 'none' }}
                        />
                      </ListItemDecorator>
                      <Stack sx={{ flex: 1 }}>
                        <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography level="body-xs" color="neutral">
                            {task.clientName}
                          </Typography>
                          <Typography level="body-xs" color="neutral">
                            •
                          </Typography>
                          <Typography level="body-xs" color={
                            new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) 
                              ? 'danger' 
                              : 'warning'
                          }>
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Typography>
                        </Stack>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4, 
                  px: 2,
                  bgcolor: 'background.level1',
                  borderRadius: 'md'
                }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.500', mb: 1 }} />
                  <Typography level="body-sm" color="neutral">
                    No upcoming tasks this week
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Button 
                variant="soft" 
                fullWidth
                onClick={() => navigate('/clients')}
                endDecorator={<ArrowForward />}
              >
                Go to Client Overview
              </Button>
            </Box>
          </Card>
        </Stack>

        {/* Right column - Contract Renewals */}
        <UpcomingRenewals clients={clients} />
      </Box>
    </PageContainer>
  );
}