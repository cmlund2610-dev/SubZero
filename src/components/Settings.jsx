/**
 * Settings Component - Application and User Settings
 * 
 * Central settings page for app configuration and user preferences
 */

import React from 'react';
import { Box, Typography, Stack, Card, Tabs, TabList, Tab, TabPanel } from '@mui/joy';
import PageContainer from './PageContainer.jsx';
import PageHeader from './PageHeader.jsx';
import UserPreferences from './UserPreferences.jsx';
import CompanySettings from './CompanySettings.jsx';
import { Settings as SettingsIcon } from '@mui/icons-material';

export default function Settings() {
  return (
    <PageContainer>
      <PageHeader
        icon={<SettingsIcon />}
        title="Settings"
        subtitle="Manage your preferences and application settings"
      />

      <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
        <TabList>
          <Tab>User Preferences</Tab>
          <Tab>Company Settings</Tab>
        </TabList>
        <TabPanel value={0} sx={{ p: 3 }}>
          <UserPreferences />
        </TabPanel>
        <TabPanel value={1} sx={{ p: 3 }}>
          <CompanySettings />
        </TabPanel>
      </Tabs>
    </PageContainer>
  );
}
