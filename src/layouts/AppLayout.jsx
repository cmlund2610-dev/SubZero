/**
 * AppLayout - Main application shell with sidebar navigation
 * 
 * Joy UI layout with fixed sidebar, topbar, and content area.
 * Contains navigation items and renders child routes via Outlet.
 * Integrates with Firebase authentication for user profile display.
 * 
 * Features:
 * - Fixed left sidebar (240px width on desktop, hidden on mobile)
 * - Topbar with logo and actions
 * - Responsive content area with max-width container
 * - Active route highlighting
 * - Firebase auth integration
 */

import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  Sheet,
  List,
  CircularProgress,
  Divider,
  Card
} from '@mui/joy';
import {
  Home,
  People,
  Receipt,
  Settings,
  BarChart,
  CloudUpload,
  Logout,
  Person,
  CreditCard,
  Diamond
} from '@mui/icons-material';

import NavItem from '../components/NavItem.jsx';
import CollapsibleNavSection from '../components/CollapsibleNavSection.jsx';
import ProfilePicture from '../components/ProfilePicture.jsx';
import AdminOnly from '../components/FeatureGate.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import usePermissions from '../hooks/usePermissions.js';

export default function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, userProfile, userCompany, logout, isAdmin } = useAuth();
  const { getRoleDisplayName } = usePermissions();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display info
  const displayName = userProfile?.fullName || currentUser?.displayName || 'User';
  const jobTitle = userProfile?.jobTitle || 'Team Member';
  const companyName = userCompany?.name || 'Company';
  const roleDisplay = getRoleDisplayName();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sheet
        sx={{
          width: { xs: 0, sm: 240 },
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.surface',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000
        }}
      >
        {/* Logo section */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2} alignItems="center">
            {/* subzero Logo */}
            <Box
              component="img"
              src="/Primary Logo grey : orange.svg"
              alt="subzero Logo"
              sx={{
                width: 160,
                height: 'auto',
                maxWidth: '100%'
              }}
            />
          </Stack>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, px: 2 }}>
          <List
            sx={{
              gap: 0.5,
              '--List-nestedInsetStart': '0px',
              '--ListItem-paddingY': '8px',
            }}
          >
            <NavItem to="/" icon={<Home />}>
              Home
            </NavItem>
            
            <CollapsibleNavSection title="Clients" defaultExpanded={false}>
              <NavItem to="/clients" icon={<Diamond />}>
                Clients overview
              </NavItem>
              <NavItem to="/renewals" icon={<Receipt />}>
                Contract Renewals
              </NavItem>
            </CollapsibleNavSection>
            
            <CollapsibleNavSection title="Analytics" defaultExpanded={false}>
              <NavItem to="/analytics" icon={<BarChart />}>
                Metrics & Data
              </NavItem>
              <NavItem to="/data" icon={<CloudUpload />}>
                Data Import
              </NavItem>
            </CollapsibleNavSection>
            
            <CollapsibleNavSection title="Settings" defaultExpanded={false}>
              <NavItem to="/settings" icon={<Settings />}>
                Account settings
              </NavItem>
              <AdminOnly>
                <NavItem to="/users" icon={<People />}>
                  Users
                </NavItem>
              </AdminOnly>
              <AdminOnly>
                <NavItem to="/billing" icon={<CreditCard />}>
                  Billing
                </NavItem>
              </AdminOnly>
            </CollapsibleNavSection>
          </List>
        </Box>

        {/* User section at bottom */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          
          {/* User avatar and info */}
          <Card 
            variant="soft" 
            sx={{ 
              p: 2, 
              mb: 2,
              background: 'linear-gradient(135deg, rgba(255, 109, 86, 0.10) 0%, rgba(255, 109, 86, 0.15) 100%)',
              cursor: 'pointer',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255, 109, 86, 0.15) 0%, rgba(255, 109, 86, 0.20) 100%)'
              }
            }}
            onClick={() => navigate('/profile')}
          >
            <Stack spacing={2} alignItems="center">
              <ProfilePicture 
                size="md"
                user={userProfile}
              />
              <Stack alignItems="center" spacing={0.5}>
                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                  {displayName}
                </Typography>
                <Typography level="body-xs" color="neutral">
                  {jobTitle}
                </Typography>
                <Typography level="body-xs" sx={{ color: '#FF6D56', fontWeight: 500 }}>
                  {companyName} • {roleDisplay}
                </Typography>
              </Stack>
            </Stack>
          </Card>

          {/* Logout button */}
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            startDecorator={<Logout />}
            onClick={handleLogout}
            sx={{
              width: '100%',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'danger.300',
                color: 'danger.600',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Sheet>

      {/* Main content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: { xs: 0, sm: '240px' } // Add left margin for fixed sidebar
      }}>
        {/* Page content with suspense for lazy loading */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            px: 3,
            py: 3,
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, transparent 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 109, 86, 0.06) 1px, transparent 0)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              zIndex: 0
            }
          }}
        >
          <Box sx={{ maxWidth: 1120, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Suspense 
              fallback={
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px' 
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}