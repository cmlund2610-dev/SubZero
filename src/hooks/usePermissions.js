/**
 * Permissions Hook
 * 
 * Custom hook for checking user permissions and roles
 * Provides utility functions for role-based access control
 */

import { useAuth } from '../context/AuthContext.jsx';

export const usePermissions = () => {
  const { userProfile, userCompany, isAdmin } = useAuth();

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!userProfile) return false;

    const permissions = {
      // Admin permissions
      'users.invite': isAdmin,
      'users.manage': isAdmin,
      'users.remove': isAdmin,
      'billing.view': isAdmin,
      'billing.manage': isAdmin,
      'company.settings': isAdmin,
      
      // Standard user permissions
      'profile.edit': true,
      'profile.view': true,
      'clients.view': true,
      'clients.create': true,
      'clients.edit': true,
      'analytics.view': true,
      'data.import': true,
      
      // Conditional permissions based on company settings
      'users.view': isAdmin || userCompany?.settings?.allowUserView,
      'company.view': true
    };

    return permissions[permission] || false;
  };

  // Check if user can manage another user
  const canManageUser = (targetUserId) => {
    if (!isAdmin) return false;
    if (!targetUserId) return false;
    if (targetUserId === userProfile?.uid) return false; // Can't manage self
    return true;
  };

  // Check if user can access billing features
  const canAccessBilling = () => {
    return isAdmin;
  };

  // Check if user can invite others
  const canInviteUsers = () => {
    return isAdmin && userCompany?.settings?.allowUserInvitations;
  };

  // Get role display name
  const getRoleDisplayName = (role = userProfile?.role) => {
    const roleNames = {
      admin: 'Administrator',
      standard: 'Member',
      owner: 'Company Owner'
    };
    return roleNames[role] || 'Member';
  };

  // Check if user is within company limits
  const isWithinUserLimits = () => {
    if (!userCompany) return false;
    const currentUsers = userCompany.allUsers?.length || 0;
    const maxUsers = userCompany.subscription?.maxUsers || 25;
    return currentUsers < maxUsers;
  };

  // Get available features based on subscription
  const getAvailableFeatures = () => {
    const subscription = userCompany?.subscription || {};
    
    const features = {
      clientsLimit: subscription.clientsLimit || 100,
      storageLimit: subscription.storageLimit || 1, // GB
      apiCallsLimit: subscription.apiCallsLimit || 1000,
      advancedAnalytics: subscription.plan === 'professional' || subscription.plan === 'enterprise',
      customIntegrations: subscription.plan === 'enterprise',
      prioritySupport: subscription.plan === 'professional' || subscription.plan === 'enterprise',
      unlimitedClients: subscription.plan === 'professional' || subscription.plan === 'enterprise'
    };

    return features;
  };

  return {
    hasPermission,
    canManageUser,
    canAccessBilling,
    canInviteUsers,
    getRoleDisplayName,
    isWithinUserLimits,
    getAvailableFeatures,
    
    // Direct access to auth data
    userProfile,
    userCompany,
    isAdmin,
    role: userProfile?.role,
    companyId: userProfile?.companyId
  };
};

export default usePermissions;