/**
 * Settings Component - Application and User Settings
 * 
 * Central settings page for app configuration and user preferences
 */

import React from 'react';
import { Box, Typography, Stack, Card, Tabs, TabList, Tab, TabPanel, Switch, FormControl, FormLabel, Input, Select, Option, Button, Divider } from '@mui/joy';
import PageContainer from './PageContainer.jsx';
import PageHeader from './PageHeader.jsx';
import UserPreferences from './UserPreferences.jsx';
import { Settings as SettingsIcon, Notifications, Security } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

export default function Settings() {
  const { isAdmin } = useAuth();

  return (
    <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Manage your preferences and application settings"
      />

      <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
        <TabList>
          <Tab>User Preferences</Tab>
          <Tab>Notifications</Tab>
          <Tab>Security</Tab>
        </TabList>
        
        <TabPanel value={0} sx={{ p: 3 }}>
          <UserPreferences />
        </TabPanel>
        
        <TabPanel value={1} sx={{ p: 3 }}>
          <NotificationSettings />
        </TabPanel>
        
        <TabPanel value={2} sx={{ p: 3 }}>
          <SecuritySettings />
        </TabPanel>
      </Tabs>
    </PageContainer>
  );
}

// Notification Settings Component
function NotificationSettings() {
  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications /> Email Notifications
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Client Health Alerts</Typography>
              <Typography level="body-sm" color="neutral">
                Receive alerts when client health scores drop below threshold
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Renewal Reminders</Typography>
              <Typography level="body-sm" color="neutral">
                Get notified about upcoming contract renewals
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Churn Risk Warnings</Typography>
              <Typography level="body-sm" color="neutral">
                Alerts for clients at high risk of churning
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Weekly Summary</Typography>
              <Typography level="body-sm" color="neutral">
                Receive a weekly summary of key metrics and changes
              </Typography>
            </Box>
            <Switch />
          </Box>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          In-App Notifications
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Desktop Notifications</Typography>
              <Typography level="body-sm" color="neutral">
                Show browser notifications for important events
              </Typography>
            </Box>
            <Switch />
          </Box>
        </Stack>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="solid" color="primary">
          Save Notification Settings
        </Button>
      </Box>
    </Stack>
  );
}

// Security Settings Component
function SecuritySettings() {
  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security /> Password & Authentication
        </Typography>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <Input type="password" placeholder="Enter current password" />
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input type="password" placeholder="Enter new password" />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <Input type="password" placeholder="Confirm new password" />
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="solid" color="primary">
              Update Password
            </Button>
          </Box>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Two-Factor Authentication
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography level="title-sm">Enable 2FA</Typography>
            <Typography level="body-sm" color="neutral">
              Add an extra layer of security to your account
            </Typography>
          </Box>
          <Switch />
        </Box>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Active Sessions
        </Typography>
        <Typography level="body-sm" color="neutral">
          You are currently signed in on 1 device. Last activity: Today at 4:05 AM
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" color="danger">
            Sign Out All Devices
          </Button>
        </Box>
      </Card>
    </Stack>
  );
}

// (Integrations removed per request)

// Data & Storage Settings Component
function CompanySettings() {
  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Storage /> Company Data
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography level="body-sm" color="neutral">Storage Used</Typography>
            <Typography level="h4">2.4 GB / 10 GB</Typography>
          </Box>
          <Box sx={{ 
            height: 8, 
            bgcolor: 'neutral.200', 
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: '24%', 
              height: '100%', 
              bgcolor: 'primary.500',
              transition: 'width 0.3s'
            }} />
          </Box>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Data Export
        </Typography>
        <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
          Export all your client data in CSV or JSON format
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="neutral">
            Export as CSV
          </Button>
          <Button variant="outlined" color="neutral">
            Export as JSON
          </Button>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Data Retention
        </Typography>
        <FormControl>
          <FormLabel>Client Data Retention Period</FormLabel>
          <Select defaultValue="forever">
            <Option value="1year">1 Year</Option>
            <Option value="2years">2 Years</Option>
            <Option value="5years">5 Years</Option>
            <Option value="forever">Forever</Option>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="solid" color="primary">
            Save Settings
          </Button>
        </Box>
      </Card>

      <Card variant="outlined" sx={{ borderColor: 'danger.300' }}>
        <Typography level="title-lg" sx={{ mb: 2, color: 'danger.500' }}>
          Danger Zone
        </Typography>
        <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
          Permanently delete all client data and close your account. This action cannot be undone.
        </Typography>
        <Button variant="outlined" color="danger">
          Delete Account
        </Button>
      </Card>
    </Stack>
  );
}
