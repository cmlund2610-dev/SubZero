// src/App.jsx
import * as React from 'react'
import Box from '@mui/joy/Box'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import Card from '@mui/joy/Card'
import Button from '@mui/joy/Button'
import Grid from '@mui/joy/Grid'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
      {/* Topbar */}
      <Box
        component="header"
        sx={{
          px: 3, py: 2, borderBottom: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          position: 'sticky', top: 0, bgcolor: 'background.body', zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography level="h4">Beehive.io</Typography>
          <Button variant="solid" color="primary">Sign in</Button>
        </Stack>
      </Box>

      {/* Page container */}
      <Box sx={{ maxWidth: 1120, mx: 'auto', px: 3, py: 3 }}>
        <Typography level="h2" sx={{ mb: 1 }}>Home</Typography>
        <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
          Here’s what’s happening with your client portfolio today
        </Typography>

        {/* Stats row */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            ['Total Clients', '0'],
            ['At Risk', '0'],
            ['Total MRR', '$0'],
            ['Avg Health', '0%'],
          ].map(([label, value]) => (
            <Grid xs={12} md={3} key={label}>
              <Card variant="outlined">
                <Typography level="body-xs" color="neutral">{label}</Typography>
                <Typography level="h3">{value}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Two-up */}
        <Grid container spacing={1.5}>
          <Grid xs={12} md={6}>
            <Card>
              <Typography level="title-md" sx={{ mb: 0.5 }}>Quick Actions</Typography>
              <Typography level="body-sm" color="neutral">No Data Connected</Typography>
              <Typography level="body-sm" color="neutral">
                Connect your data sources to see client information
              </Typography>
              <Button sx={{ mt: 1.5 }} variant="solid" color="primary">
                Connect Data Sources
              </Button>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <Typography level="title-md" sx={{ mb: 0.5 }}>Upcoming Renewals</Typography>
              <Typography level="body-sm" color="neutral">
                No upcoming renewals in the next 90 days
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
