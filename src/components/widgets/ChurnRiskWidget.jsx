/**
 * Churn Risk Widget - Client churn risk analysis
 * 
 * Displays clients at risk of churning with priority levels
 * and actionable insights for customer success teams.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, Chip, Button, List, ListItem } from '@mui/joy';
import { Warning, PriorityHigh, Info } from '@mui/icons-material';

export default function ChurnRiskWidget({ clients = [] }) {
  // Analyze churn risk
  const riskAnalysis = useMemo(() => {
    if (clients.length === 0) {
      return {
        high: [],
        medium: [],
        low: [],
        totalAtRisk: 0,
        riskScore: 0,
        actions: []
      };
    }

    const high = clients.filter(c => c.churn?.risk === 'high' || c.churn?.risk === 'critical');
    const medium = clients.filter(c => c.churn?.risk === 'medium' || c.churn?.risk === 'moderate');
    const low = clients.filter(c => c.churn?.risk === 'low');
    
    const totalAtRisk = high.length + medium.length;
    const riskScore = totalAtRisk / clients.length * 100;

    // Generate action recommendations
    const actions = [];
    if (high.length > 0) {
      actions.push({
        priority: 'high',
        text: `${high.length} clients need immediate attention`,
        icon: <PriorityHigh fontSize="small" />
      });
    }
    if (medium.length > 2) {
      actions.push({
        priority: 'medium',
        text: `Review ${medium.length} at-risk clients`,
        icon: <Warning fontSize="small" />
      });
    }

    return {
      high,
      medium,
      low,
      totalAtRisk,
      riskScore,
      actions
    };
  }, [clients]);

  const getRiskColor = (risk) => {
    if (risk === 'high' || risk === 'critical') return 'danger';
    if (risk === 'medium' || risk === 'moderate') return 'warning';
    if (risk === 'low') return 'success';
    return 'neutral';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (clients.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        <Typography level="body-sm">
          No client data available for churn analysis
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {/* Risk Summary */}
      <Box>
        <Typography level="title-lg" sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {riskAnalysis.totalAtRisk}
        </Typography>
        <Typography level="body-sm" color="neutral">
          Clients at risk of churning
        </Typography>
      </Box>

      {/* Risk Score */}
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant="soft"
            color={riskAnalysis.riskScore > 20 ? 'danger' : riskAnalysis.riskScore > 10 ? 'warning' : 'success'}
            size="sm"
          >
            {riskAnalysis.riskScore.toFixed(1)}% Portfolio Risk
          </Chip>
        </Stack>
      </Box>

      {/* Top At-Risk Clients */}
      {riskAnalysis.high.length > 0 && (
        <Box>
          <Typography level="body-sm" sx={{ fontWeight: 600, color: 'danger.600', mb: 1 }}>
            Critical Risk
          </Typography>
          <Stack spacing={0.5}>
            {riskAnalysis.high.slice(0, 3).map((client, index) => (
              <Box
                key={client.id}
                sx={{
                  p: 1,
                  bgcolor: 'danger.50',
                  borderRadius: 'sm',
                  border: '1px solid',
                  borderColor: 'danger.200'
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {client.companyName}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    {formatCurrency(client.mrr || 0)}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Actions Needed */}
      {riskAnalysis.actions.length > 0 && (
        <Box sx={{ flex: 1 }}>
          <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1 }}>
            Recommended Actions
          </Typography>
          <Stack spacing={1}>
            {riskAnalysis.actions.map((action, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  bgcolor: 'background.level1',
                  borderRadius: 'sm',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box sx={{ color: action.priority === 'high' ? 'danger.500' : 'warning.500' }}>
                  {action.icon}
                </Box>
                <Typography level="body-sm">
                  {action.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Risk Breakdown */}
      <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} sx={{ fontSize: 'sm' }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography level="body-xs" color="danger">
              {riskAnalysis.high.length}
            </Typography>
            <Typography level="body-xs" color="neutral">
              High
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography level="body-xs" color="warning">
              {riskAnalysis.medium.length}
            </Typography>
            <Typography level="body-xs" color="neutral">
              Medium
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography level="body-xs" color="success">
              {riskAnalysis.low.length}
            </Typography>
            <Typography level="body-xs" color="neutral">
              Low
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}