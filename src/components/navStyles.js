// Shared navigation styles to ensure consistent spacing and alignment
export const NAV_ICON_SIZE = 18;
export const NAV_ICON_BOX_WIDTH = 24; // fixed width so labels align across rows

export const navRowButtonSx = {
  px: 2,
  py: 1,
  borderRadius: 'sm',
  alignItems: 'center',
  minHeight: 40, // enforce consistent row height
  '&:hover': { bgcolor: 'background.level1' },
  '&.active': {
    bgcolor: 'primary.softBg',
    color: 'primary.softColor',
    fontWeight: 600,
  },
};

export const navIconBoxSx = {
  width: NAV_ICON_BOX_WIDTH,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const navIconSx = { fontSize: NAV_ICON_SIZE, color: 'text.tertiary' };

export const navItemLabelSx = { fontWeight: 500 };

export const sectionLabelProps = {
  level: 'body-xs',
  sx: {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'text.tertiary',
    fontSize: '0.6875rem',
  },
};
