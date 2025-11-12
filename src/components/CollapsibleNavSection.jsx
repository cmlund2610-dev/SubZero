/**
 * CollapsibleNavSection - Expandable navigation section with child items
 * 
 * Creates an accordion-style navigation group that can be expanded/collapsed
 */

import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemContent } from '@mui/joy';
import { KeyboardArrowDown } from '@mui/icons-material';
import NavItem from './NavItem.jsx';

export default function CollapsibleNavSection({ 
  title, 
  children, 
  defaultExpanded = true 
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 1 }}>
      {/* Section Header */}
      <ListItemButton
        onClick={() => setExpanded(!expanded)}
        sx={{
          px: 2,
          py: 1,
          borderRadius: 'sm',
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
      >
        <ListItemContent>
          <Typography
            level="body-xs"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.tertiary',
              fontSize: '0.6875rem',
            }}
          >
            {title}
          </Typography>
        </ListItemContent>
        <KeyboardArrowDown
          sx={{
            fontSize: 18,
            color: 'text.tertiary',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </ListItemButton>

      {/* Child Items */}
      {expanded && (
        <List
          sx={{
            gap: 0.5,
            mt: 0.5,
            '--List-nestedInsetStart': '0px',
            '--ListItem-paddingY': '8px',
          }}
        >
          {children}
        </List>
      )}
    </Box>
  );
}
