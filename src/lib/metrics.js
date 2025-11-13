/**
 * Client metrics calculation utilities for dashboard KPIs
 * 
 * Provides functions to compute key metrics from canonical client data:
 * - Total clients, at-risk counts, MRR totals, health averages
 * - Upcoming renewals filtering
 * - Analytics unlock matrix based on available data fields
 * 
 * To integrate with live data: import canonical client array and call these functions
 * 
 * @typedef {Object} CanonicalClient Normalized client data structure
 */

/**
 * Calculates dashboard totals and KPIs
 * 
 * @param {Array<CanonicalClient>} clients - Array of canonical client data
 * @returns {Object} Dashboard metrics
 */
export function calcTotals(clients) {
  if (!Array.isArray(clients) || clients.length === 0) {
    return {
      totalClients: 0,
      atRisk: 0,
      totalMRR: 0,
      avgHealth: 0
    };
  }

  const totalClients = clients.length;
  
  // At risk: churn risk is "high" or "critical" OR health score < 50
  const atRisk = clients.filter(client => {
    const churnRisk = client.churn?.risk;
    const healthScore = client.health?.score || 0;
    return (churnRisk === 'high' || churnRisk === 'critical') || healthScore < 50;
  }).length;

  // Total MRR sum
  const totalMRR = clients.reduce((sum, client) => {
    return sum + (Number(client.mrr) || 0);
  }, 0);

  // Average health score (rounded to 0 decimals)
  const healthScores = clients
    .map(client => client.health?.score || 0)
    .filter(score => score > 0);
  
  const avgHealth = healthScores.length > 0
    ? Math.round(healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length)
    : 0;

  return {
    totalClients,
    atRisk,
    totalMRR,
    avgHealth
  };
}

/**
 * Gets upcoming renewals within specified days
 * 
 * @param {Array<CanonicalClient>} clients - Array of canonical client data
 * @param {number} days - Number of days to look ahead (default: 90)
 * @returns {Array<Object>} Sorted array of upcoming renewals
 */
export function nextRenewals(clients, days = 90, limit) {
  if (!Array.isArray(clients)) {
    return [];
  }

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const renewals = clients
    .filter(client => {
      // Support both nested and flat structures
      const renewalDate = client.renewal?.date || client.renewal_date || client.contract_end_date;
      return renewalDate;
    })
    .map(client => {
      // Support both nested and flat structures
      const renewalDateStr = client.renewal?.date || client.renewal_date || client.contract_end_date;
      const renewalDate = new Date(renewalDateStr);
      
      return {
        id: client.id,
        companyName: client.company?.name || client.companyName || client.company_name || client.client_name,
        renewalDate: renewalDateStr,
        contractValue: client.contract?.value || client.contract_value || 0,
        mrr: client.mrr || 0,
        healthScore: client.health?.score || client.health_score || 0,
        churnRisk: client.churn?.risk || client.churn_risk || 'unknown',
        contactName: client.contact?.name || client.contact_name,
        csmOwner: client.csm?.owner || client.csm_owner,
        daysUntilRenewal: Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24))
      };
    })
    .filter(renewal => {
      const renewalDate = new Date(renewal.renewalDate);
      return renewalDate >= today && renewalDate <= futureDate;
    })
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

  if (typeof limit === 'number' && limit > 0) {
    return renewals.slice(0, limit);
  }
  return renewals; // full list when no limit specified
}

/**
 * Determines which analytics groups are "unlocked" based on available data
 * 
 * Analytics Unlock Matrix:
 * - Revenue Analytics: needs mrr + renewal.date
 * - Retention Analysis: needs subscribedMonths + renewal.date  
 * - Health Monitoring: needs health.score + usage.last30d
 * - Satisfaction Tracking: needs nps.score + nps.comment
 * - Contract Management: needs renewal.date + contract.value + churn.risk
 * 
 * @param {Array<CanonicalClient>} clients - Array of canonical client data
 * @returns {Set<string>} Set of unlocked analytics groups
 */
export function unlocks(clients) {
  if (!Array.isArray(clients) || clients.length === 0) {
    return new Set();
  }

  const unlockedGroups = new Set();

  // Check what percentage of clients have required fields for each analytics group
  const threshold = 0.5; // At least 50% of clients need required fields

  // Revenue Analytics: mrr + renewal.date
  const revenueReady = clients.filter(client => 
    client.mrr !== undefined && client.renewal?.date
  );
  if (revenueReady.length / clients.length >= threshold) {
    unlockedGroups.add('Revenue Analytics');
  }

  // Retention Analysis: subscribedMonths + renewal.date
  const retentionReady = clients.filter(client => 
    client.subscribedMonths !== undefined && client.renewal?.date
  );
  if (retentionReady.length / clients.length >= threshold) {
    unlockedGroups.add('Retention Analysis');
  }

  // Health Monitoring: health.score + usage.last30d
  const healthReady = clients.filter(client => 
    client.health?.score !== undefined && client.usage?.last30d !== undefined
  );
  if (healthReady.length / clients.length >= threshold) {
    unlockedGroups.add('Health Monitoring');
  }

  // Satisfaction Tracking: nps.score + nps.comment
  const satisfactionReady = clients.filter(client => 
    client.nps?.score !== undefined && client.nps?.comment
  );
  if (satisfactionReady.length / clients.length >= threshold) {
    unlockedGroups.add('Satisfaction Tracking');
  }

  // Contract Management: renewal.date + contract.value + churn.risk
  const contractReady = clients.filter(client => 
    client.renewal?.date && 
    client.contract?.value !== undefined && 
    client.churn?.risk
  );
  if (contractReady.length / clients.length >= threshold) {
    unlockedGroups.add('Contract Management');
  }

  return unlockedGroups;
}

/**
 * Formats currency value for display
 * 
 * @param {number} value - Numeric value to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
  if (value === 0) return '$0';
  if (value < 1000) return `$${value}`;
  if (value < 1000000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${(value / 1000000).toFixed(1)}M`;
}

/**
 * Formats percentage value for display
 * 
 * @param {number} value - Numeric value (0-100)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  return `${Math.round(value || 0)}%`;
}

/**
 * Gets relative date description for renewals
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Human-readable relative date
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
}