/**
 * CompanySettings Component - Company-wide settings (Admin only)
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Card, Input, FormControl, FormLabel, Button, Select, Option } from '@mui/joy';
import { useAuth } from '../context/AuthContext.jsx';

export default function CompanySettings() {
  const { userCompany, isAdmin } = useAuth();
  const [companyName, setCompanyName] = useState(userCompany?.name || '');
  const [industry, setIndustry] = useState(userCompany?.industry || '');
  const [companySize, setCompanySize] = useState(userCompany?.size || '');

  if (!isAdmin) {
    return (
      <Card variant="outlined">
        <Typography level="body-md" color="neutral">
          Only administrators can modify company settings.
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Company Information
        </Typography>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>Company Name</FormLabel>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Industry</FormLabel>
            <Select value={industry} onChange={(e, value) => setIndustry(value)}>
              <Option value="technology">Technology</Option>
              <Option value="finance">Finance</Option>
              <Option value="healthcare">Healthcare</Option>
              <Option value="retail">Retail</Option>
              <Option value="manufacturing">Manufacturing</Option>
              <Option value="other">Other</Option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Company Size</FormLabel>
            <Select value={companySize} onChange={(e, value) => setCompanySize(value)}>
              <Option value="1-10">1-10 employees</Option>
              <Option value="11-50">11-50 employees</Option>
              <Option value="51-200">51-200 employees</Option>
              <Option value="201-500">201-500 employees</Option>
              <Option value="500+">500+ employees</Option>
            </Select>
          </FormControl>
        </Stack>
      </Card>

      <Card variant="outlined">
        <Typography level="title-lg" sx={{ mb: 2 }}>
          Billing Information
        </Typography>
        <Typography level="body-sm" color="neutral">
          Manage your subscription and billing details in the{' '}
          <Typography component="a" href="/billing" sx={{ color: 'primary.500' }}>
            Billing section
          </Typography>
          .
        </Typography>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="neutral">
          Cancel
        </Button>
        <Button variant="solid" color="primary">
          Save Changes
        </Button>
      </Box>
    </Stack>
  );
}
