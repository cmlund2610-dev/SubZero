/**
 * Signin Component - User Authentication
 * 
 * Simple, clean sign-in form with email/password authentication
 * Includes error handling and navigation to signup
 */

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Card,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  Link,
  Divider,
  Checkbox
} from '@mui/joy';
import { 
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signin, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path or default to home
  const from = location.state?.from?.pathname || '/';

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await signin(formData.email, formData.password);
      
      // Success - redirect to intended page or home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Signin failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        position: 'relative',
        background: 'linear-gradient(135deg, #FBFCFF 0%, #EDEFF5 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 109, 86, 0.08), transparent 70%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 109, 86, 0.05), transparent 60%)',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none'
        }
      }}
    >
      {/* Left side - Branding and Value Proposition */}
      <Box 
        sx={{ 
          flex: { xs: 0, lg: 1 },
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          color: 'white',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ maxWidth: 480, textAlign: 'center' }}>
          {/* Brand Logo */}
          <Box
            component="img"
            src="/Primary Logo grey : orange.svg"
            alt="subzero Logo"
            sx={{
              width: 180,
              height: 'auto',
              mb: 4,
              opacity: 0.95
            }}
          />
          
          {/* Value Proposition */}
          <Typography 
            level="h1" 
            sx={{ 
              mb: 3,
              fontSize: { lg: '2.5rem', xl: '3rem' },
              fontWeight: 700,
              color: '#2E2F33',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            Precision in Data.
            <br /> Clarity in Design.
          </Typography>
          
          <Typography 
            level="title-lg" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontSize: '1.125rem',
              lineHeight: 1.4,
              color: '#49505A',
              fontWeight: 400
            }}
          >
            AI-powered insights, automated workflows, and predictive analytics 
            that drive retention and growth.
          </Typography>

          {/* Feature Highlights - More Compact */}
          <Stack spacing={2.5}>
            {[
              { 
                icon: '📊', 
                title: 'Predictive Analytics', 
                desc: 'AI algorithms identify at-risk customers and growth opportunities'
              },
              { 
                icon: '⚡', 
                title: 'Automated Workflows', 
                desc: 'Intelligent automation for onboarding and renewals'
              }
            ].map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2.5,
                  textAlign: 'left',
                  p: 2.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', minWidth: 'auto' }}>
                  {feature.icon}
                </Typography>
                <Box>
                  <Typography 
                    level="title-sm" 
                    sx={{ 
                      mb: 0.5, 
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    level="body-xs" 
                    sx={{ 
                      opacity: 0.85,
                      lineHeight: 1.4,
                      color: '#6A717D'
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Social Proof - Simplified */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography level="body-xs" sx={{ opacity: 0.7 }}>
              ⭐⭐⭐⭐⭐ Trusted by 500+ teams • 4.9/5 rating
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Signin Form */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            maxWidth: 420, 
            width: '100%', 
            p: { xs: 3, md: 4 },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px'
          }}
        >
          <Stack spacing={4}>
            {/* Mobile Logo */}
            <Box 
              sx={{ 
                display: { xs: 'block', lg: 'none' },
                textAlign: 'center',
                mb: 2
              }}
            >
              <Box
                component="img"
                src="/Primary Logo grey : orange.svg"
                alt="subzero Logo"
                sx={{
                  width: 140,
                  height: 'auto'
                }}
              />
            </Box>

            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                level="h2" 
                sx={{ 
                  mb: 1,
                    color: '#2E2F33',
                    fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2rem' }
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                level="body-md" 
                color="neutral" 
                sx={{ 
                  opacity: 0.7,
                  fontSize: '1rem',
                  color: '#5a6169'
                }}
              >
                Sign in to continue with subzero insights
              </Typography>
            </Box>

            {/* Error Alert */}
            {authError && (
              <Alert 
                color="danger" 
                variant="soft"
                sx={{ 
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'danger.200',
                  bgcolor: '#fef2f2',
                  color: '#dc2626'
                }}
              >
                {authError}
              </Alert>
            )}

            {/* Signin Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl error={!!errors.email}>
                  <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Email Address</FormLabel>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isSubmitting}
                    startDecorator={<EmailIcon sx={{ color: '#FF6D56' }} />}
                    sx={{
                      borderRadius: '12px',
                      border: '1px solid #828392',
                      bgcolor: '#FBFCFF',
                      '&:hover': {
                        borderColor: '#FF6D56',
                        bgcolor: '#FFFFFF'
                      },
                      '&:focus-within': {
                        borderColor: '#FF6D56',
                        bgcolor: '#ffffff',
                        boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)',
                      }
                    }}
                  />
                  {errors.email && (
                    <FormHelperText>{errors.email}</FormHelperText>
                  )}
                </FormControl>

                <FormControl error={!!errors.password}>
                  <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    disabled={isSubmitting}
                    startDecorator={<LockIcon sx={{ color: '#FF6D56' }} />}
                    sx={{
                      borderRadius: '12px',
                      border: '1px solid #828392',
                      bgcolor: '#FBFCFF',
                      '&:hover': {
                        borderColor: '#FF6D56',
                        bgcolor: '#FFFFFF'
                      },
                      '&:focus-within': {
                        borderColor: '#FF6D56',
                        bgcolor: '#ffffff',
                        boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)',
                      }
                    }}
                  />
                  {errors.password && (
                    <FormHelperText>{errors.password}</FormHelperText>
                  )}
                </FormControl>

                {/* Remember Me & Forgot Password */}
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                >
                  <Checkbox
                    size="sm"
                    label="Remember me"
                    checked={formData.rememberMe}
                    onChange={(e) => handleChange('rememberMe', e.target.checked)}
                    sx={{ 
                      '& .MuiCheckbox-checkbox': { 
                        borderRadius: '6px',
                        '&:hover': {
                          bgcolor: 'rgba(255, 109, 86, 0.1)'
                        }
                      },
                        color: '#2E2F33'
                    }}
                  />
                  <Link 
                    component={RouterLink} 
                    to="#" 
                    level="body-sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Forgot password functionality coming soon!');
                    }}
                    sx={{ 
                      fontWeight: 600,
                      color: '#FF6D56',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#E55F4C'
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Stack>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  sx={{
                    background: '#FF6D56',
                    color: 'white',
                    borderRadius: '12px',
                    py: 1.75,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(255, 109, 86, 0.3)',
                    border: 'none',
                    textTransform: 'none',
                    '&:hover': {
                      background: '#E55F4C',
                      boxShadow: '0 8px 20px rgba(130,131,146,0.18)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  startDecorator={!isSubmitting && <LoginIcon />}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In to subzero'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography 
                    level="body-xs" 
                    color="neutral" 
                    sx={{ 
                      px: 2,
                      color: '#49505A',
                      fontWeight: 500
                    }}
                  >
                    New to subzero?
                  </Typography>
                </Divider>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="outlined"
                    size="lg"
                    sx={{
                      borderRadius: '12px',
                      borderColor: '#828392',
                      color: '#2E2F33',
                      fontWeight: 600,
                      width: '100%',
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      border: '2px solid #828392',
                      bgcolor: 'transparent',
                      '&:hover': {
                        borderColor: '#FF6D56',
                        bgcolor: 'rgba(255, 109, 86, 0.05)',
                        color: '#FF6D56',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(255, 109, 86, 0.2)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Create Your Free Account
                  </Button>
                </Box>

                {/* Social Proof */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography 
                    level="body-xs" 
                    sx={{ 
                      mb: 2,
                      color: '#6b7280',
                      fontWeight: 500
                    }}
                  >
                    Trusted by customer success teams worldwide
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 109, 86, 0.1)',
                        border: '1px solid rgba(255, 109, 86, 0.2)'
                      }}
                    >
                      <Typography sx={{ fontSize: '1rem' }}>⭐</Typography>
                      <Typography 
                        level="body-xs" 
                        sx={{ 
                          color: '#FF6D56',
                          fontWeight: 600
                        }}
                      >
                        4.9/5 rating
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}