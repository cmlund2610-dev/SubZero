import React from 'react';
import { Box, Typography, Stack, LinearProgress, Chip } from '@mui/joy';

export default function NPSScoreWidget({ clients = [] }) {
  // Generate NPS data
  const npsData = React.useMemo(() => {
    const totalResponses = Math.max(clients.length * 0.7, 10); // 70% response rate
    const promoters = Math.floor(totalResponses * 0.45); // 45% promoters
    const detractors = Math.floor(totalResponses * 0.15); // 15% detractors  
    const passives = totalResponses - promoters - detractors;
    
    const npsScore = Math.round(((promoters - detractors) / totalResponses) * 100);
    
    return {
      score: npsScore,
      promoters,
      passives,
      detractors,
      totalResponses,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendValue: Math.floor(Math.random() * 10) + 1
    };
  }, [clients.length]);

  const getScoreColor = (score) => {
    if (score >= 50) return 'success';
    if (score >= 0) return 'warning';
    return 'danger';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Great';
    if (score >= 30) return 'Good';
    if (score >= 0) return 'Needs Work';
    return 'Critical';
  };

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Typography level="title-sm" sx={{ fontWeight: 600 }}>
        Net Promoter Score
      </Typography>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography level="h2" color={getScoreColor(npsData.score)} sx={{ fontWeight: 700 }}>
          {npsData.score}
        </Typography>
        <Typography level="body-xs" color="neutral">
          {getScoreLabel(npsData.score)}
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="body-xs" color="neutral">Promoters</Typography>
          <Chip size="sm" color="success" variant="soft">{npsData.promoters}</Chip>
        </Stack>
        <LinearProgress
          determinate
          value={(npsData.promoters / npsData.totalResponses) * 100}
          color="success"
          size="sm"
        />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="body-xs" color="neutral">Passives</Typography>
          <Chip size="sm" color="warning" variant="soft">{npsData.passives}</Chip>
        </Stack>
        <LinearProgress
          determinate
          value={(npsData.passives / npsData.totalResponses) * 100}
          color="warning"
          size="sm"
        />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="body-xs" color="neutral">Detractors</Typography>
          <Chip size="sm" color="danger" variant="soft">{npsData.detractors}</Chip>
        </Stack>
        <LinearProgress
          determinate
          value={(npsData.detractors / npsData.totalResponses) * 100}
          color="danger"
          size="sm"
        />
      </Stack>

      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Typography level="body-xs" color="neutral">
          Based on {npsData.totalResponses} responses
        </Typography>
      </Box>
    </Stack>
  );
}