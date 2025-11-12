/**
 * Account Page - User account management
 * 
 * Combines Profile, UserPreferences, and other account-related settings
 */

import React from 'react';
import { Box, Tabs, TabList, Tab, TabPanel } from '@mui/joy';
import PageContainer from '../components/PageContainer.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Profile from '../components/Profile.jsx';
import UserPreferences from '../components/UserPreferences.jsx';
import { AccountCircle } from '@mui/icons-material';

export default function Account() {
  return (
    <PageContainer>
      <PageHeader
        icon={AccountCircle}
        title="Account"
        description="Manage your account profile and preferences"
      />

      <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Preferences</Tab>
        </TabList>
        <TabPanel value={0} sx={{ p: 3 }}>
          <Profile />
        </TabPanel>
        <TabPanel value={1} sx={{ p: 3 }}>
          <UserPreferences />
        </TabPanel>
      </Tabs>
    </PageContainer>
  );
}
