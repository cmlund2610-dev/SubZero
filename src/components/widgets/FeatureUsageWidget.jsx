import React from 'react';
import { Box, Typography, Stack, LinearProgress, Card } from '@mui/joy';

export default function FeatureUsageWidget({ clients = [] }) {
  const featureData = React.useMemo(() => {
    const features = [
      {
        name: 'Dashboard',
        usage: Math.floor(Math.random() * 20) + 75, // 75-95%
        description: 'Main analytics view'
      },
      {
        name: 'Reporting',
        usage: Math.floor(Math.random() * 30) + 60, // 60-90%
        description: 'Custom reports'
      },
      {
        name: 'API Integration',
        usage: Math.floor(Math.random() * 40) + 40, // 40-80%
        description: 'Third-party connections'
      },
      {
        name: 'Mobile App',
        usage: Math.floor(Math.random() * 35) + 25, // 25-60%
        description: 'iOS/Android usage'
      },
      {
        name: 'Advanced Analytics',
        usage: Math.floor(Math.random() * 30) + 20, // 20-50%
        description: 'Premium features'
      }
    ];

    return features.sort((a, b) => b.usage - a.usage);
  }, [clients.length]);

  const getUsageColor = (usage) => {
    if (usage >= 70) return 'success';
    if (usage >= 40) return 'warning';
    return 'danger';
  };

  const totalActiveClients = Math.max(Math.floor(clients.length * 0.85), 1);

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="title-sm" sx={{ fontWeight: 600 }}>
          Feature Adoption
        </Typography>
        <Typography level="body-xs" color="neutral">
          {totalActiveClients} active users
        </Typography>
      </Box>
      
      <Stack spacing={2}>
        {featureData.map((feature, index) => (
          <Card key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography level="body-sm" sx={{ fontWeight: 500 }}>
                    {feature.name}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    {feature.description}
                  </Typography>
                </Stack>
                <Typography 
                  level="body-sm" 
                  color={getUsageColor(feature.usage)}
                  sx={{ fontWeight: 600 }}
                >
                  {feature.usage}%
                </Typography>
              </Stack>
              
              <LinearProgress
                determinate
                value={feature.usage}
                color={getUsageColor(feature.usage)}
                size="sm"
                sx={{ 
                  '--LinearProgress-thickness': '6px',
                  '--LinearProgress-radius': '3px'
                }}
              />
              
              <Typography level="body-xs" color="neutral">
                {Math.floor(totalActiveClients * (feature.usage / 100))} of {totalActiveClients} clients
              </Typography>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Box sx={{ p: 2, backgroundColor: 'background.level1', borderRadius: 'sm' }}>
        <Typography level="body-xs" color="neutral" sx={{ textAlign: 'center' }}>
          💡 <strong>Tip:</strong> Low adoption features may need better onboarding
        </Typography>
      </Box>
    </Stack>
  );
}