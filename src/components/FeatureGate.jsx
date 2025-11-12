/**
 * Feature Gate Component
 * 
 * Component for conditionally rendering content based on permissions
 * Provides declarative way to control access to UI elements
 */

import React from 'react';
import { Alert, Box, Typography } from '@mui/joy';
import { 
  Lock, 
  Warning as AlertCircle 
} from '@mui/icons-material';
import usePermissions from '../hooks/usePermissions.js';

// Feature gate component
export const FeatureGate = ({ 
  permission, 
  role,
  fallback,
  children,
  showFallback = false,
  fallbackType = 'hidden' // 'hidden', 'alert', 'custom'
}) => {
  const { hasPermission, isAdmin } = usePermissions();

  // Check permission
  const hasAccess = permission ? hasPermission(permission) : true;
  
  // Check role
  const hasRole = role ? (role === 'admin' ? isAdmin : true) : true;

  // Grant access if both checks pass
  const canAccess = hasAccess && hasRole;

  if (canAccess) {
    return children;
  }

  // Handle fallback rendering
  if (!showFallback || fallbackType === 'hidden') {
    return null;
  }

  if (fallbackType === 'custom' && fallback) {
    return fallback;
  }

  if (fallbackType === 'alert') {
    return (
      <Alert 
        color="warning" 
        startDecorator={<Lock size={16} />}
        sx={{ my: 2 }}
      >
        <Typography level="body-sm">
          {permission ? 
            `You don't have permission to access this feature (${permission}).` :
            'You don\'t have the required role to access this feature.'
          }
        </Typography>
      </Alert>
    );
  }

  return null;
};

// Subscription gate component
export const SubscriptionGate = ({ 
  requiredPlan,
  feature,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { getAvailableFeatures, userCompany } = usePermissions();
  const features = getAvailableFeatures();
  const currentPlan = userCompany?.subscription?.plan || 'starter';

  // Define plan hierarchy
  const planLevels = {
    starter: 1,
    professional: 2,
    enterprise: 3
  };

  const hasRequiredPlan = planLevels[currentPlan] >= planLevels[requiredPlan];
  const hasFeature = feature ? features[feature] : hasRequiredPlan;

  if (hasFeature) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (showUpgrade) {
    return (
      <Alert 
        color="primary" 
        startDecorator={<AlertCircle size={16} />}
        sx={{ my: 2 }}
      >
        <Box>
          <Typography level="title-sm" sx={{ mb: 0.5 }}>
            Upgrade Required
          </Typography>
          <Typography level="body-sm">
            This feature requires the {requiredPlan} plan or higher. 
            {feature && ` Your current plan doesn't include ${feature}.`}
          </Typography>
        </Box>
      </Alert>
    );
  }

  return null;
};

// Admin only wrapper
export const AdminOnly = ({ children, fallback, showFallback = false }) => (
  <FeatureGate 
    role="admin" 
    fallback={fallback}
    showFallback={showFallback}
    fallbackType="alert"
  >
    {children}
  </FeatureGate>
);

// Permission wrapper
export const RequirePermission = ({ 
  permission, 
  children, 
  fallback, 
  showFallback = false 
}) => (
  <FeatureGate 
    permission={permission}
    fallback={fallback}
    showFallback={showFallback}
    fallbackType="alert"
  >
    {children}
  </FeatureGate>
);

export default FeatureGate;