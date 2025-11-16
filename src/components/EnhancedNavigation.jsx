/**
 * Enhanced Navigation System - Breadcrumbs and contextual navigation
 * 
 * Provides better navigation experience with breadcrumbs, contextual links,
 * and improved information architecture.
 */

import React from 'react';
import { 
  Box, 
  Breadcrumbs, 
  Link, 
  Typography, 
  Chip,
  Stack,
  Button
} from '@mui/joy';
import { 
  Home as HomeIcon, 
  ChevronRight,
  ArrowBack
} from '@mui/icons-material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';

// Navigation structure definition
const NAVIGATION_STRUCTURE = {
  '/': { 
    label: 'Dashboard', 
    icon: <HomeIcon sx={{ fontSize: '1rem' }} />,
    parent: null 
  },
  '/clients': { 
    label: 'Clients', 
    parent: '/',
    actions: [
      { label: 'Import Data', path: '/data', variant: 'outlined' }
    ]
  },
  '/clients/:id': { 
    label: 'Client Details', 
    parent: '/clients',
    dynamic: true
  },
  '/renewals': { 
    label: 'Contract Renewals', 
    parent: '/',
    actions: [
      { label: 'View Clients', path: '/clients', variant: 'outlined' }
    ]
  },
  '/analytics': { 
    label: 'Analytics', 
    parent: '/',
    actions: [
      { label: 'Add Widget', action: 'add_widget', variant: 'solid' }
    ]
  },
  '/data': { 
    label: 'Data Import', 
    parent: '/',
    description: 'Import client data from CSV or JSON files'
  },
  '/account': { 
    label: 'Account Settings', 
    parent: '/',
    description: 'Manage your profile and preferences'
  }
};

// Get breadcrumb trail for current path
function getBreadcrumbTrail(pathname) {
  const trail = [];
  let currentPath = pathname;
  
  // Handle dynamic routes like /clients/:id
  if (pathname.startsWith('/clients/') && pathname !== '/clients') {
    currentPath = '/clients/:id';
  }
  
  while (currentPath && NAVIGATION_STRUCTURE[currentPath]) {
    const navItem = NAVIGATION_STRUCTURE[currentPath];
    trail.unshift({
      path: currentPath === '/clients/:id' ? pathname : currentPath,
      label: navItem.label,
      icon: navItem.icon,
      isDynamic: navItem.dynamic
    });
    currentPath = navItem.parent;
  }
  
  return trail;
}

// Main breadcrumb component
export default function EnhancedBreadcrumbs() {
  const location = useLocation();
  const trail = getBreadcrumbTrail(location.pathname);
  
  if (trail.length <= 1) return null; // Don't show for single-level pages

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<ChevronRight sx={{ fontSize: '1rem' }} />}
        sx={{
          '--Breadcrumbs-gap': '8px',
          '--Breadcrumbs-separator-margin': '0 4px',
        }}
      >
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={item.path}
                level="body-sm"
                sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          }
          
          return (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              level="body-sm"
              sx={{
                textDecoration: 'none',
                color: 'neutral.500',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: 'primary.500',
                  textDecoration: 'none'
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

// Page header with contextual actions
export function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = false, 
  customActions = [],
  badges = [] 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentNav = NAVIGATION_STRUCTURE[location.pathname];

  const handleBack = () => {
    if (currentNav?.parent) {
      navigate(currentNav.parent);
    } else {
      navigate(-1);
    }
  };

  const actions = customActions.length > 0 
    ? customActions 
    : currentNav?.actions || [];

  return (
    <Box sx={{ mb: 4 }}>
      <EnhancedBreadcrumbs />
      
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={2}>
          {/* Back button + Title */}
          <Stack direction="row" alignItems="center" spacing={2}>
            {showBackButton && (
              <Button
                variant="outlined"
                size="sm"
                startDecorator={<ArrowBack />}
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography level="h2" sx={{ mb: 0 }}>
                  {title}
                </Typography>
                {badges.map((badge, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    variant="soft"
                    color={badge.color || 'primary'}
                    startDecorator={badge.icon}
                  >
                    {badge.label}
                  </Chip>
                ))}
              </Stack>
              
              {(subtitle || currentNav?.description) && (
                <Typography level="body-md" color="neutral">
                  {subtitle || currentNav.description}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Contextual actions */}
        {actions.length > 0 && (
          <Stack direction="row" spacing={1}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outlined'}
                color={action.color || 'primary'}
                size="sm"
                startDecorator={action.icon}
                onClick={action.action ? () => window.dispatchEvent(new CustomEvent(action.action)) : () => navigate(action.path)}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// Quick navigation component for related pages
export function QuickNavigation({ currentPage }) {
  const navigate = useNavigate();
  
  const getRelatedPages = (page) => {
    switch (page) {
      case 'dashboard':
        return [
          { label: 'View Clients', path: '/clients', icon: '👥' },
          { label: 'Check Renewals', path: '/renewals', icon: '📝' },
          { label: 'Analytics', path: '/analytics', icon: '📊' }
        ];
      case 'clients':
        return [
          { label: 'Dashboard', path: '/', icon: '🏠' },
          { label: 'Import Data', path: '/data', icon: '📤' },
          { label: 'Analytics', path: '/analytics', icon: '📊' }
        ];
      case 'renewals':
        return [
          { label: 'Dashboard', path: '/', icon: '🏠' },
          { label: 'View Clients', path: '/clients', icon: '👥' },
          { label: 'Analytics', path: '/analytics', icon: '📊' }
        ];
      case 'analytics':
        return [
          { label: 'Dashboard', path: '/', icon: '🏠' },
          { label: 'View Clients', path: '/clients', icon: '👥' },
          { label: 'Import Data', path: '/data', icon: '📤' }
        ];
      default:
        return [];
    }
  };

  const relatedPages = getRelatedPages(currentPage);
  
  if (relatedPages.length === 0) return null;

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: 'background.level1', borderRadius: 'md' }}>
      <Typography level="body-sm" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Navigation
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {relatedPages.map((page, index) => (
          <Button
            key={index}
            variant="outlined"
            size="sm"
            color="neutral"
            onClick={() => navigate(page.path)}
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.75rem'
            }}
          >
            {page.icon} {page.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

// Context-aware navigation suggestions
export function NavigationSuggestions({ clients = [], hasWidgets = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getSuggestions = () => {
    const suggestions = [];
    
    // Context-based suggestions
    if (location.pathname === '/' && clients.length > 0) {
      suggestions.push({
        title: 'Dive Deeper into Your Data',
        items: [
          { label: 'Analyze Client Health', path: '/clients', description: 'Review individual client scores' },
          { label: 'Track Renewals', path: '/renewals', description: 'Monitor upcoming contract renewals' }
        ]
      });
    }
    
    if (location.pathname === '/clients' && !hasWidgets) {
      suggestions.push({
        title: 'Enhance Your Analysis',
        items: [
          { label: 'Create Analytics Dashboard', path: '/analytics', description: 'Add widgets for deeper insights' }
        ]
      });
    }
    
    if (location.pathname === '/analytics' && clients.length === 0) {
      suggestions.push({
        title: 'Get Started',
        items: [
          { label: 'Import Client Data', path: '/data', description: 'Add data to power your analytics' }
        ]
      });
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions();
  
  if (suggestions.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      {suggestions.map((section, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: 3 }}>
          <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1.5 }}>
            💡 {section.title}
          </Typography>
          <Stack spacing={1}>
            {section.items.map((item, itemIndex) => (
              <Button
                key={itemIndex}
                variant="outlined"
                color="neutral"
                size="sm"
                onClick={() => navigate(item.path)}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  p: 2,
                  height: 'auto'
                }}
              >
                <Stack spacing={0.5}>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    {item.description}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}