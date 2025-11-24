/**
 * Joy UI theme configuration for subzero
 * Clean, confident, modern, data‑driven
 * 
 * Palette:
 * - Primary Accent: #FF6D56 (Bright Coral)
 * - Neutral Gray:   #828392 (Cool Slate)
 * - Surface:        #FBFCFF (Off‑White)
 * - Text Dark:      #2E2F33
 * - Text Light:     #FFFFFF
 *
 * Components follow 12px radii, 8px spacing base, subtle shadows.
 */
import { extendTheme } from '@mui/joy/styles';

const primary = '#FF6D56';
const primaryHover = '#E55F4C'; // ~10% darker
const neutral = '#828392';
const surface = '#FBFCFF';
const textDark = '#2E2F33';
const textLight = '#FFFFFF';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#FFE8E3',
          100: '#FFD6CD',
          200: '#FFB5A7',
          300: '#FF9A88',
          400: '#FF806F',
          500: primary,
          600: primaryHover,
          700: '#CC4F41',
          800: '#A53F35',
          900: '#7F3028',
          solidBg: primary,
          solidColor: textLight,
          solidHoverBg: primaryHover,
          solidActiveBg: '#CC4F41',
          outlinedBorder: primary,
          outlinedColor: primary,
          outlinedHoverBg: '#FF6D560F',
        },
        neutral: {
          plainColor: neutral,
        },
        background: {
          body: surface,
          surface: surface,
          popup: '#FFFFFF',
        },
        text: {
          primary: textDark,
          secondary: '#49505A',
          tertiary: '#6A717D',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          500: primary,
          600: primaryHover,
          solidBg: primary,
          solidColor: textLight,
          solidHoverBg: primaryHover,
          outlinedBorder: primary,
          outlinedColor: primary,
          outlinedHoverBg: '#FF6D5626',
        },
        background: {
          body: '#0F1113',
          surface: '#171A1D',
          popup: '#1E2327',
        },
        text: {
          primary: '#F7F8FA',
          secondary: '#C6CAD1',
          tertiary: '#9AA1AB',
        },
      },
    },
  },
  radius: { 
    sm: '8px', 
    md: '12px', 
    lg: '12px',
    xl: '20px'
  },
  fontFamily: {
    body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontWeight: {
    xs: 300,
    sm: 400,
    md: 500,
    lg: 700,
    xl: 700,
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    'title-lg': {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    'body-lg': {
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
  },
  shadow: {
    xs: '0 1px 2px rgba(130,131,146,0.10)',
    sm: '0 2px 6px rgba(130,131,146,0.15)',
    md: '0 4px 10px rgba(130,131,146,0.15)',
    lg: '0 8px 20px rgba(130,131,146,0.18)',
    xl: '0 12px 30px rgba(130,131,146,0.22)',
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          transition: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          transition: 'none',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
  },
});

export default theme;
