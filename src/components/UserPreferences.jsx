/**
 * UserPreferences Component - User-specific settings and preferences
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Card, Switch, Select, Option, FormControl, FormLabel, Button } from '@mui/joy';

export default function UserPreferences() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Email Notifications</Typography>
              <Typography level="body-sm" color="neutral">
                Receive email updates about client health changes
              </Typography>
            </Box>
            <Switch
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </Box>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Appearance
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="title-sm">Dark Mode</Typography>
              <Typography level="body-sm" color="neutral">
                Switch to dark theme
              </Typography>
            </Box>
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </Box>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Language & Region
        </Typography>
        <FormControl>
          <FormLabel>Language</FormLabel>
          <Select value={language} onChange={(e, value) => setLanguage(value)}>
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
            <Option value="de">German</Option>
          </Select>
        </FormControl>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="neutral">
          Reset to Defaults
        </Button>
        <Button variant="solid" color="primary">
          Save Preferences
        </Button>
      </Box>
    </Stack>
  );
}
