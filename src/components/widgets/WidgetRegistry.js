/**
 * Widget Registry - Central management for analytics widgets
 * 
 * Manages available widgets, their metadata, and provides utilities 
 * for dynamic widget loading and configuration.
 */

// Widget metadata registry
export const WIDGET_REGISTRY = {
  mrrTrend: {
    id: 'mrrTrend',
    name: 'MRR Trend',
    description: 'Monthly Recurring Revenue over time',
    category: 'Revenue',
    size: { width: 2, height: 1 }, // Grid units
    minData: 2, // Minimum data points needed
    icon: 'TrendingUp',
    component: () => import('./MRRTrendWidget.jsx')
  },

  healthDistribution: {
    id: 'healthDistribution',
    name: 'Health Score Distribution',
    description: 'Distribution of client health scores',
    category: 'Health',
    size: { width: 1, height: 1 },
    minData: 5,
    icon: 'DonutLarge',
    component: () => import('./HealthDistributionWidget.jsx')
  },

  churnRisk: {
    id: 'churnRisk',
    name: 'Churn Risk Analysis',
    description: 'Clients at risk of churning',
    category: 'Risk',
    size: { width: 2, height: 1 },
    minData: 1,
    icon: 'Warning',
    component: () => import('./ChurnRiskWidget.jsx')
  },

  userGrowth: {
    id: 'userGrowth',
    name: 'User Growth',
    description: 'Active user growth over time',
    category: 'Growth',
    size: { width: 2, height: 1 },
    minData: 3,
    icon: 'PeopleAlt',
    component: () => import('./UserGrowthWidget.jsx')
  },

  contractPipeline: {
    id: 'contractPipeline',
    name: 'Contract Pipeline',
    description: 'Upcoming renewals and contract values',
    category: 'Revenue',
    size: { width: 1, height: 2 },
    minData: 1,
    icon: 'Assignment',
    component: () => import('./ContractPipelineWidget.jsx')
  },

  featureUsage: {
    id: 'featureUsage',
    name: 'Feature Usage',
    description: 'Most popular features across clients',
    category: 'Usage',
    size: { width: 1, height: 1 },
    minData: 3,
    icon: 'BarChart',
    component: () => import('./FeatureUsageWidget.jsx')
  },

  npsScore: {
    id: 'npsScore',
    name: 'NPS Score Trend',
    description: 'Net Promoter Score over time',
    category: 'Satisfaction',
    size: { width: 2, height: 1 },
    minData: 2,
    icon: 'ThumbUp',
    component: () => import('./NPSScoreWidget.jsx')
  },

  revenueMetrics: {
    id: 'revenueMetrics',
    name: 'Revenue Metrics',
    description: 'Key revenue indicators and trends',
    category: 'Revenue',
    size: { width: 1, height: 1 },
    minData: 1,
    icon: 'AttachMoney',
    component: () => import('./RevenueMetricsWidget.jsx')
  }
};

/**
 * Get widgets by category
 */
export function getWidgetsByCategory() {
  const categories = {};
  
  Object.values(WIDGET_REGISTRY).forEach(widget => {
    if (!categories[widget.category]) {
      categories[widget.category] = [];
    }
    categories[widget.category].push(widget);
  });
  
  return categories;
}

/**
 * Get available widgets based on data availability
 */
export function getAvailableWidgets(clientData = []) {
  const dataCount = clientData.length;
  
  return Object.values(WIDGET_REGISTRY).filter(widget => {
    return dataCount >= widget.minData;
  });
}

/**
 * Check if a widget can be displayed
 */
export function canDisplayWidget(widgetId, clientData = []) {
  const widget = WIDGET_REGISTRY[widgetId];
  if (!widget) return false;
  
  return clientData.length >= widget.minData;
}

/**
 * Get widget metadata
 */
export function getWidget(widgetId) {
  return WIDGET_REGISTRY[widgetId] || null;
}

/**
 * Get all widget IDs
 */
export function getAllWidgetIds() {
  return Object.keys(WIDGET_REGISTRY);
}

/**
 * Calculate grid layout for widgets
 */
export function calculateGridLayout(enabledWidgets, containerWidth = 12) {
  const layout = [];
  let currentRow = 0;
  let currentCol = 0;
  
  enabledWidgets.forEach((widgetId, index) => {
    const widget = getWidget(widgetId);
    if (!widget) return;
    
    const { width, height } = widget.size;
    
    // Check if widget fits in current row
    if (currentCol + width > containerWidth) {
      currentRow += 1;
      currentCol = 0;
    }
    
    layout.push({
      i: widgetId,
      x: currentCol,
      y: currentRow,
      w: width,
      h: height,
      minW: width,
      minH: height
    });
    
    currentCol += width;
  });
  
  return layout;
}