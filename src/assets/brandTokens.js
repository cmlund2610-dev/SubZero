/**
 * BeeHive Brand Style Guide
 * 
 * This file contains all brand guidelines, colors, typography, gradients,
 * spacing, and component styles for consistent design across the application.
 * 
 * Last updated: November 9, 2025
 */

/* ========================================
   🎨 COLOR PALETTE
======================================== */

export const BrandColors = {
  // Primary Brand Colors
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#4338CA',  // Main brand color
    600: '#3730A3',
    700: '#312E81',
    800: '#2D1B69',
    900: '#1E1B4B',
  },

  // Secondary/Accent Colors
  secondary: {
    purple: '#8B5CF6',
    cyan: '#06B6D4', 
    emerald: '#10B981',
    orange: '#F59E0B',
    rose: '#F43F5E',
  },

  // Neutral Colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    light: '#fbfcfe',
    surface: '#ffffff',
    popup: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
};

/* ========================================
   🌈 GRADIENTS
======================================== */

export const BrandGradients = {
  // Primary Brand Gradients
  primary: 'linear-gradient(45deg, #4338CA 0%, #8B5CF6 100%)',
  primaryDark: 'linear-gradient(45deg, #3730A3 0%, #7C3AED 100%)',
  
  // Background Gradients
  hero: 'linear-gradient(135deg, #4338CA 0%, #312E81 50%, #1E1B4B 100%)',
  subtle: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  
  // Text Gradients
  textPrimary: 'linear-gradient(45deg, #4338CA 0%, #312E81 100%)',
  textLight: 'linear-gradient(45deg, #ffffff 0%, #f1f5f9 100%)',
  
  // Component Gradients
  card: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
  glass: 'rgba(255, 255, 255, 0.1)',
  
  // Feature Accents
  analytics: 'linear-gradient(45deg, #8B5CF6, #ffffff)',
  automation: 'linear-gradient(45deg, #06B6D4, #ffffff)',
  intelligence: 'linear-gradient(45deg, #10B981, #ffffff)',
};

/* ========================================
   ✍️ TYPOGRAPHY
======================================== */

export const BrandTypography = {
  // Font Families
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font Sizes (in rem)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
    wider: '0.02em',
  }
};

/* ========================================
   📐 SPACING & SIZING
======================================== */

export const BrandSpacing = {
  // Spacing Scale (in rem)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  // Container Max Widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

/* ========================================
   🎭 SHADOWS & EFFECTS
======================================== */

export const BrandEffects = {
  // Box Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Brand-specific shadows
    primary: '0 8px 16px rgba(67, 56, 202, 0.3)',
    primaryHover: '0 12px 24px rgba(67, 56, 202, 0.4)',
  },

  // Backdrop Filters
  backdrop: {
    blur: 'blur(20px)',
    blurMd: 'blur(12px)',
    blurSm: 'blur(4px)',
  },

  // Transitions
  transition: {
    fast: 'all 0.15s ease-in-out',
    base: 'all 0.2s ease-in-out', 
    slow: 'all 0.3s ease-in-out',
  }
};

/* ========================================
   🧩 COMPONENT STYLES
======================================== */

export const BrandComponents = {
  // Button Styles
  button: {
    primary: {
      background: BrandGradients.primary,
      color: '#ffffff',
      fontWeight: BrandTypography.fontWeight.bold,
      borderRadius: BrandSpacing.borderRadius.md,
      boxShadow: BrandEffects.shadow.primary,
      transition: BrandEffects.transition.base,
      hover: {
        background: BrandGradients.primaryDark,
        boxShadow: BrandEffects.shadow.primaryHover,
        transform: 'translateY(-2px)',
      }
    },
    
    secondary: {
      border: `2px solid ${BrandColors.primary[500]}`,
      color: BrandColors.primary[500],
      background: 'transparent',
      fontWeight: BrandTypography.fontWeight.semibold,
      borderRadius: BrandSpacing.borderRadius.md,
      transition: BrandEffects.transition.base,
      hover: {
        background: `rgba(67, 56, 202, 0.05)`,
        transform: 'translateY(-1px)',
      }
    }
  },

  // Input Styles
  input: {
    base: {
      border: `2px solid ${BrandColors.neutral[200]}`,
      borderRadius: BrandSpacing.borderRadius.md,
      background: '#fafafa',
      transition: BrandEffects.transition.base,
      focus: {
        borderColor: BrandColors.primary[500],
        background: '#ffffff',
        boxShadow: '0 0 0 3px rgba(67, 56, 202, 0.1)',
      }
    }
  },

  // Card Styles
  card: {
    base: {
      background: '#ffffff',
      borderRadius: BrandSpacing.borderRadius.lg,
      boxShadow: BrandEffects.shadow.md,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    glass: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: BrandEffects.backdrop.blur,
      borderRadius: BrandSpacing.borderRadius.xl,
      boxShadow: BrandEffects.shadow['2xl'],
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }
  }
};

/* ========================================
   📱 RESPONSIVE BREAKPOINTS
======================================== */

export const BrandBreakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};

/* ========================================
   🎯 USAGE EXAMPLES & UTILITIES
======================================== */

// CSS-in-JS utility functions
export const brandUtils = {
  // Apply brand gradient to text
  gradientText: (gradient = BrandGradients.textPrimary) => ({
    background: gradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),

  // Glassmorphism effect
  glass: (opacity = 0.98) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: BrandEffects.backdrop.blur,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }),

  // Primary button with hover states
  primaryButton: {
    ...BrandComponents.button.primary,
    '&:hover': BrandComponents.button.primary.hover,
  },

  // Secondary button with hover states
  secondaryButton: {
    ...BrandComponents.button.secondary,
    '&:hover': BrandComponents.button.secondary.hover,
  },

  // Focus states for inputs
  inputFocus: {
    ...BrandComponents.input.base,
    '&:focus-within': BrandComponents.input.base.focus,
  }
};

/* ========================================
   📋 DESIGN TOKENS SUMMARY
======================================== */

export const BrandTokens = {
  colors: BrandColors,
  gradients: BrandGradients,
  typography: BrandTypography,
  spacing: BrandSpacing,
  effects: BrandEffects,
  components: BrandComponents,
  breakpoints: BrandBreakpoints,
  utils: brandUtils,
};

export default BrandTokens;