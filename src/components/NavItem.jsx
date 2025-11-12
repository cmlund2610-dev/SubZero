/**
 * NavItem - Navigation link wrapper with Joy UI styling
 * 
 * Wraps NavLink with Joy UI ListItemButton for consistent navigation styling.
 * Automatically highlights active routes and provides hover effects.
 * 
 * @param {Object} props Component props
 * @param {string} props.to - Route path to navigate to
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {React.ReactNode} props.children - Link text content
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemButton, Typography, Box } from '@mui/joy';
import { navRowButtonSx, navIconBoxSx, navIconSx, navItemLabelSx } from './navStyles.js';

export default function NavItem({ to, icon, children }) {
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        component={NavLink}
        to={to}
        sx={navRowButtonSx}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={navIconBoxSx}>
            {icon && React.cloneElement(icon, { sx: navIconSx })}
          </Box>
          <Typography level="body-sm" sx={navItemLabelSx}>
            {children}
          </Typography>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}