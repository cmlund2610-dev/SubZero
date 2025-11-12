/**
 * Signup Component - User Registration with Profile Information
 * 
 * Comprehensive signup form that captures:
 * - Email and password
 * - Full name, job title, department
 * - Company name, industry, and size
 * 
 * Integrates with Firebase Auth and stores profile in Firestore
 * Matches signin page design with split-screen layout
 */

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Card,
  Button,
  Input,
  Select,
  Option,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  Link,
  Divider
} from '@mui/joy';
import { 
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    jobTitle: '',
    department: 'customer-success',
    companyName: '',
    companyIndustry: '',
    companySize: '',
    isNewCompany: true // Default to creating new company
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Company industry validation
    if (!formData.companyIndustry) {
      newErrors.companyIndustry = 'Industry is required';
    }

    // Company size validation
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
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
      // Create account with profile data
      await signup(formData.email, formData.password, {
        fullName: formData.fullName,
        jobTitle: formData.jobTitle,
        department: formData.department,
        companyName: formData.companyName,
        companyIndustry: formData.companyIndustry,
        companySize: formData.companySize,
        isNewCompany: formData.isNewCompany
      });

      // Success - navigate to onboarding or dashboard
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Department options
  const departmentOptions = [
    { value: 'customer-success', label: 'Customer Success' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support' },
    { value: 'product', label: 'Product' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'operations', label: 'Operations' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'other', label: 'Other' }
  ];

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
          background: 'radial-gradient(circle at 20% 50%, rgba(67, 56, 202, 0.4), transparent 70%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3), transparent 60%)',
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
            src="/Logo White.svg"
            alt="SubZero Logo"
            sx={{
              width: 140,
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
            Start your journey with AI-powered insights and automated workflows 
            that drive exceptional customer outcomes.
          </Typography>

          {/* Feature Highlights */}
          <Stack spacing={2.5}>
            {[
              { 
                icon: '🚀', 
                title: 'Quick Onboarding', 
                desc: 'Get started in minutes with guided setup and smart defaults'
              },
              { 
                icon: '🤝', 
                title: 'Team Collaboration', 
                desc: 'Built for teams with role-based access and real-time updates'
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
                      color: '#cbd5e1'
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Social Proof */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography level="body-xs" sx={{ opacity: 0.7 }}>
              ⭐⭐⭐⭐⭐ Trusted by 500+ teams • 4.9/5 rating
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Signup Form */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1,
          overflow: 'auto'
        }}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            maxWidth: 500, 
            width: '100%', 
            p: { xs: 3, md: 4 },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            my: 2
          }}
        >
          <Stack spacing={3}>
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
                src="/Primary Logo grey.svg"
                alt="SubZero Logo"
                sx={{
                  width: 120,
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
                  background: 'linear-gradient(45deg, #4338CA 0%, #312E81 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', md: '2rem' }
                }}
              >
                Create Your Account
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
                Join SubZero to start managing your customer success
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Company Information Section */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <BusinessIcon sx={{ color: '#FF6D56' }} fontSize="small" />
                    <Typography level="title-sm" sx={{ color: '#FF6D56', fontWeight: 600 }}>
                      Company Information
                    </Typography>
                  </Stack>
                  
                  {/* Company Creation Note */}
                  <Alert 
                    color="primary" 
                    size="sm" 
                    sx={{ 
                      mb: 2, 
                      borderRadius: '8px',
                      borderColor: '#4338CA',
                      bgcolor: 'rgba(67, 56, 202, 0.05)'
                    }}
                  >
                    <Typography level="body-sm">
                      You'll create a new company account and become the admin. You can invite team members later.
                    </Typography>
                  </Alert>
                  
                  <FormControl error={!!errors.companyName}>
                    <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Company Name *</FormLabel>
                    <Input
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: errors.companyName ? 'danger.400' : '#828392',
                        '&:focus-within': {
                          borderColor: '#FF6D56',
                          boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                        }
                      }}
                    />
                    <FormHelperText sx={{ color: '#6b7280', mt: 0.5 }}>
                      This will be your company workspace name
                    </FormHelperText>
                    {errors.companyName && (
                      <FormHelperText sx={{ color: '#dc2626' }}>{errors.companyName}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl error={!!errors.companyIndustry}>
                    <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Industry *</FormLabel>
                    <Select
                      placeholder="Select your industry"
                      value={formData.companyIndustry}
                      onChange={(e, value) => handleChange('companyIndustry', value)}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: errors.companyIndustry ? 'danger.400' : '#828392',
                        '&:focus-within': {
                          borderColor: '#FF6D56',
                          boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                        }
                      }}
                    >
                      <Option value="Technology">Technology</Option>
                      <Option value="Healthcare">Healthcare</Option>
                      <Option value="Financial Services">Financial Services</Option>
                      <Option value="Education">Education</Option>
                      <Option value="Retail">Retail</Option>
                      <Option value="Manufacturing">Manufacturing</Option>
                      <Option value="Media & Entertainment">Media & Entertainment</Option>
                      <Option value="Government">Government</Option>
                      <Option value="Non-Profit">Non-Profit</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                    {errors.companyIndustry && (
                      <FormHelperText sx={{ color: '#dc2626' }}>{errors.companyIndustry}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl error={!!errors.companySize}>
                    <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Company Size *</FormLabel>
                    <Select
                      placeholder="Select your company size"
                      value={formData.companySize}
                      onChange={(e, value) => handleChange('companySize', value)}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: errors.companySize ? 'danger.400' : '#828392',
                        '&:focus-within': {
                          borderColor: '#FF6D56',
                          boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                        }
                      }}
                    >
                      <Option value="1-10 employees">1-10 employees</Option>
                      <Option value="11-50 employees">11-50 employees</Option>
                      <Option value="51-200 employees">51-200 employees</Option>
                      <Option value="201-1000 employees">201-1000 employees</Option>
                      <Option value="1000+ employees">1000+ employees</Option>
                    </Select>
                    {errors.companySize && (
                      <FormHelperText sx={{ color: '#dc2626' }}>{errors.companySize}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Personal Information Section */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <PersonIcon sx={{ color: '#FF6D56' }} fontSize="small" />
                    <Typography level="title-sm" sx={{ color: '#FF6D56', fontWeight: 600 }}>
                      Personal Information
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <FormControl error={!!errors.fullName}>
                      <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Full Name *</FormLabel>
                      <Input
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: errors.fullName ? 'danger.400' : '#828392',
                          '&:focus-within': {
                            borderColor: '#FF6D56',
                            boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                          }
                        }}
                      />
                      {errors.fullName && (
                        <FormHelperText sx={{ color: '#dc2626' }}>{errors.fullName}</FormHelperText>
                      )}
                    </FormControl>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <FormControl sx={{ flex: 1 }}>
                        <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Job Title</FormLabel>
                        <Input
                          placeholder="Customer Success Manager"
                          value={formData.jobTitle}
                          onChange={(e) => handleChange('jobTitle', e.target.value)}
                          disabled={isSubmitting}
                          sx={{
                            borderRadius: '8px',
                            border: '1.5px solid #828392',
                            '&:focus-within': {
                              borderColor: '#FF6D56',
                              boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                            }
                          }}
                        />
                      </FormControl>

                      <FormControl sx={{ flex: 1 }}>
                        <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Department</FormLabel>
                        <Select
                          value={formData.department}
                          onChange={(e, value) => handleChange('department', value)}
                          disabled={isSubmitting}
                          sx={{
                            borderRadius: '8px',
                            border: '1.5px solid #828392',
                            '&:focus-within': {
                              borderColor: '#FF6D56',
                              boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                            }
                          }}
                        >
                          {departmentOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Account Credentials Section */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <EmailIcon sx={{ color: '#FF6D56' }} fontSize="small" />
                    <Typography level="title-sm" sx={{ color: '#FF6D56', fontWeight: 600 }}>
                      Account Credentials
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <FormControl error={!!errors.email}>
                      <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Email Address *</FormLabel>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: errors.email ? 'danger.400' : '#828392',
                          '&:focus-within': {
                            borderColor: '#FF6D56',
                            boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                          }
                        }}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: '#dc2626' }}>{errors.email}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl error={!!errors.password}>
                      <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Password *</FormLabel>
                      <Input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: errors.password ? 'danger.400' : '#828392',
                          '&:focus-within': {
                            borderColor: '#FF6D56',
                            boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                          }
                        }}
                      />
                      {errors.password && (
                        <FormHelperText sx={{ color: '#dc2626' }}>{errors.password}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl error={!!errors.confirmPassword}>
                      <FormLabel sx={{ fontWeight: 600, color: '#374151' }}>Confirm Password *</FormLabel>
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: errors.confirmPassword ? 'danger.400' : '#828392',
                          '&:focus-within': {
                            borderColor: '#FF6D56',
                            boxShadow: '0 0 0 3px rgba(255, 109, 86, 0.15)'
                          }
                        }}
                      />
                      {errors.confirmPassword && (
                        <FormHelperText sx={{ color: '#dc2626' }}>{errors.confirmPassword}</FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </Box>

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
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    mt: 2,
                    '&:hover': {
                      background: '#E55F4C',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.4)'
                    },
                    '&:disabled': {
                      opacity: 0.7
                    }
                  }}
                  startDecorator={!isSubmitting && <CheckIcon />}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                {/* Sign In Link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography level="body-sm" color="neutral">
                    Already have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/signin" 
                      level="body-sm"
                      sx={{ 
                        fontWeight: 600,
                        color: '#FF6D56',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}