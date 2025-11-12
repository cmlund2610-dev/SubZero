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
import { ListItem, ListItemButton, ListItemDecorator, Typography } from '@mui/joy';

export default function NavItem({ to, icon, children }) {
  return (
    <ListItem>
      <ListItemButton
        component={NavLink}
        to={to}
        sx={({ vars }) => ({
          borderRadius: 'md',
          '&.active': {
            bgcolor: 'primary.softBg',
            color: 'primary.softColor',
            fontWeight: 600,
            '& .MuiListItemDecorator-root': {
              color: 'inherit'
            }
          },
          '&:hover': {
            bgcolor: 'background.level1'
          }
        })}
      >
        <ListItemDecorator sx={{ color: 'neutral.500' }}>
          {icon}
        </ListItemDecorator>
        <Typography level="body-sm" sx={{ fontWeight: 500 }}>
          {children}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}