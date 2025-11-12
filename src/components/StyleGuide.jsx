/**
 * SubZero Brand Style Guide - Visual Component
 * 
 * Interactive style guide showcasing all brand elements
 * Access at /styleguide route for reference
 */

import React from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Grid, 
  Card, 
  Button,
  Input,
  Chip,
  Divider
} from '@mui/joy';
import { BrandTokens } from '../assets/brandTokens.js';

export default function StyleGuide() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          level="h1" 
          sx={{ 
            mb: 2,
            ...BrandTokens.utils.gradientText(),
            fontSize: '3rem',
            fontWeight: 800
          }}
        >
          SubZero Brand Style Guide
        </Typography>
        <Typography level="body-lg" color="neutral">
          Design system and brand guidelines for consistent UI/UX
        </Typography>
      </Box>

      <Stack spacing={6}>
        {/* Logo & Assets Section */}
        <Section title="🎯 Logo & Brand Assets">
          <Grid container spacing={4}>
            {/* White Logo for Dark Backgrounds */}
            <Grid xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #4338CA, #7C3AED)',
                  color: 'white'
                }}
              >
                <Typography level="title-md" sx={{ mb: 3, color: 'white' }}>
                  White Logo (Dark Backgrounds)
                </Typography>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/Logo White.svg" 
                    alt="SubZero White Logo" 
                    style={{ 
                      maxWidth: '200px',
                      height: 'auto'
                    }}
                  />
                </Box>
                <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Use on dark or colored backgrounds for optimal contrast
                </Typography>
              </Card>
            </Grid>

            {/* Primary/Colored Logo for Light Backgrounds */}
            <Grid xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: 'white',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography level="title-md" sx={{ mb: 3 }}>
                  Colored Logo (Light Backgrounds)
                </Typography>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/Primary Logo grey.svg" 
                    alt="SubZero Colored Logo" 
                    style={{ 
                      maxWidth: '200px',
                      height: 'auto'
                    }}
                  />
                </Box>
                <Typography level="body-sm" color="neutral">
                  Use on light backgrounds and white surfaces
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Section>

        {/* Colors Section */}
        <Section title="🎨 Colors">
          <Grid container spacing={3}>
            {/* Primary Colors */}
            <Grid xs={12} md={6}>
              <Typography level="title-md" sx={{ mb: 2 }}>Primary Brand Colors</Typography>
              <Stack spacing={1}>
                {Object.entries(BrandTokens.colors.primary).map(([shade, color]) => (
                  <Box key={shade} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: color, 
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                    <Box>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        primary.{shade}
                      </Typography>
                      <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.500' }}>
                        {color}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Secondary Colors */}
            <Grid xs={12} md={6}>
              <Typography level="title-md" sx={{ mb: 2 }}>Secondary/Accent Colors</Typography>
              <Stack spacing={1}>
                {Object.entries(BrandTokens.colors.secondary).map(([name, color]) => (
                  <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: color, 
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                    <Box>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {name}
                      </Typography>
                      <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.500' }}>
                        {color}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Section>

        {/* Gradients Section */}
        <Section title="🌈 Gradients">
          <Grid container spacing={3}>
            {Object.entries(BrandTokens.gradients).map(([name, gradient]) => (
              <Grid key={name} xs={12} sm={6} md={4}>
                <Card sx={{ p: 2 }}>
                  <Box 
                    sx={{ 
                      height: 80, 
                      background: gradient,
                      borderRadius: 1,
                      mb: 2
                    }} 
                  />
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    {name}
                  </Typography>
                  <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.500' }}>
                    {gradient}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        {/* Typography Section */}
        <Section title="✍️ Typography">
          <Stack spacing={3}>
            <Box>
              <Typography level="title-md" sx={{ mb: 2 }}>Font Sizes</Typography>
              <Stack spacing={2}>
                {Object.entries(BrandTokens.typography.fontSize).map(([size, value]) => (
                  <Box key={size} sx={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                    <Typography 
                      sx={{ 
                        fontSize: value,
                        fontWeight: 600,
                        minWidth: 120
                      }}
                    >
                      Aa Sample
                    </Typography>
                    <Box>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {size}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
                        {value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography level="title-md" sx={{ mb: 2 }}>Font Weights</Typography>
              <Stack spacing={1}>
                {Object.entries(BrandTokens.typography.fontWeight).map(([weight, value]) => (
                  <Typography 
                    key={weight}
                    sx={{ fontWeight: value }}
                    level="body-md"
                  >
                    {weight} ({value}) - The quick brown fox jumps over the lazy dog
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Section>

        {/* Components Section */}
        <Section title="🧩 Components">
          <Grid container spacing={3}>
            {/* Buttons */}
            <Grid xs={12} md={6}>
              <Typography level="title-md" sx={{ mb: 2 }}>Buttons</Typography>
              <Stack spacing={2}>
                <Button 
                  size="lg"
                  sx={BrandTokens.utils.primaryButton}
                >
                  Primary Button
                </Button>
                <Button 
                  variant="outlined"
                  size="lg"
                  sx={BrandTokens.utils.secondaryButton}
                >
                  Secondary Button
                </Button>
                <Button 
                  variant="soft"
                  size="lg"
                  color="neutral"
                >
                  Soft Button
                </Button>
              </Stack>
            </Grid>

            {/* Inputs */}
            <Grid xs={12} md={6}>
              <Typography level="title-md" sx={{ mb: 2 }}>Form Elements</Typography>
              <Stack spacing={2}>
                <Input 
                  placeholder="Email address"
                  sx={BrandTokens.utils.inputFocus}
                />
                <Input 
                  type="password"
                  placeholder="Password"
                  sx={BrandTokens.utils.inputFocus}
                />
                <Stack direction="row" spacing={1}>
                  <Chip variant="soft" color="primary">Primary Chip</Chip>
                  <Chip variant="outlined" color="primary">Outlined Chip</Chip>
                  <Chip variant="solid" color="primary">Solid Chip</Chip>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Section>

        {/* Cards Section */}
        <Section title="🃏 Cards">
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={BrandTokens.components.card.base}>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Standard Card
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Basic card with standard styling and shadow effects.
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card sx={BrandTokens.components.card.glass}>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Glass Card
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Glassmorphism card with backdrop blur and transparency.
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card 
                sx={{ 
                  ...BrandTokens.components.card.base,
                  background: BrandTokens.gradients.card,
                  border: `1px solid ${BrandTokens.colors.primary[200]}`
                }}
              >
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Gradient Card
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Card with brand gradient background and colored border.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Section>

        {/* Spacing Section */}
        <Section title="📐 Spacing">
          <Typography level="body-md" sx={{ mb: 3 }}>
            Consistent spacing scale based on 4px increments (0.25rem)
          </Typography>
          <Stack spacing={2}>
            {Object.entries(BrandTokens.spacing.spacing).slice(0, 12).map(([space, value]) => (
              <Box key={space} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    width: value,
                    height: '20px',
                    bgcolor: 'primary.500',
                    borderRadius: 1,
                    minWidth: '4px'
                  }} 
                />
                <Typography level="body-sm" sx={{ fontFamily: 'monospace' }}>
                  spacing.{space} = {value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Section>

        {/* Usage Examples */}
        <Section title="💡 Usage Examples">
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography 
                  level="h3" 
                  sx={{ 
                    ...BrandTokens.utils.gradientText(),
                    mb: 2
                  }}
                >
                  Gradient Text Example
                </Typography>
                <Typography level="body-md" color="neutral">
                  Use gradient text for headings and important elements to reinforce brand identity.
                </Typography>
              </Card>
            </Grid>

            <Grid xs={12} md={6}>
              <Card 
                sx={{
                  ...BrandTokens.utils.glass(),
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1), rgba(139, 92, 246, 0.1))'
                }}
              >
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  Glassmorphism Example
                </Typography>
                <Typography level="body-md" color="neutral">
                  Modern glass effect with backdrop blur and subtle transparency.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Section>
      </Stack>
    </Box>
  );
}

// Helper component for sections
function Section({ title, children }) {
  return (
    <Box>
      <Typography 
        level="h2" 
        sx={{ 
          mb: 3,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'primary.600'
        }}
      >
        {title}
      </Typography>
      {children}
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}