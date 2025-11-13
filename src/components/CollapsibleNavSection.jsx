/**
 * CollapsibleNavSection - Expandable navigation section with child items
 * 
 * Creates an accordion-style navigation group that can be expanded/collapsed
 */

import React, { useState } from 'react';
import { Box, Typography, ListItemButton, ListItem } from '@mui/joy';
import { KeyboardArrowDown } from '@mui/icons-material';
import { navRowButtonSx, navIconBoxSx, navIconSx, navItemLabelSx } from './navStyles.js';

export default function CollapsibleNavSection({ 
  title, 
  children, 
  defaultExpanded = true,
  icon: IconComponent
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      {/* Section Header */}
      <ListItem sx={{ p: 0 }}>
        <ListItemButton 
          onClick={() => setExpanded(!expanded)} 
          sx={{
            ...navRowButtonSx,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={navIconBoxSx}>
              {IconComponent && <IconComponent sx={navIconSx} />}
            </Box>
            <Typography level="body-sm" sx={navItemLabelSx}>
              {title}
            </Typography>
          </Box>
          <KeyboardArrowDown
            sx={{
              fontSize: 18,
              color: 'text.tertiary',
              transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </ListItemButton>
      </ListItem>

      {/* Child Items - render directly as siblings in parent List */}
      {expanded && children}
    </>
  );
}
