/**
 * Profile Page Component
 * 
 * User profile management including profile picture, personal info, and preferences
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Alert,
  Chip,
  Stack
} from '@mui/joy';
import { 
  Save, 
  Person as User, 
  Lock,
  Email,
  Phone,
  Work,
  Badge
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import ProfilePicture from '../components/ProfilePicture.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

const Profile = ({ embedded = false }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    email: currentUser?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    department: userProfile?.department || '',
    jobTitle: userProfile?.jobTitle || ''
  });
  
  // Update form data when userProfile changes
  React.useEffect(() => {
    if (userProfile || currentUser) {
      setFormData({
        fullName: userProfile?.fullName || '',
        email: currentUser?.email || '',
        phoneNumber: userProfile?.phoneNumber || '',
        department: userProfile?.department || '',
        jobTitle: userProfile?.jobTitle || ''
      });
    }
  }, [userProfile, currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        department: formData.department.trim(),
        jobTitle: formData.jobTitle.trim()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = [
    'Engineering', 'Marketing', 'Sales', 'Design', 'Product', 'Operations', 
    'HR', 'Finance', 'Customer Success', 'Legal', 'Other'
  ];

  const profileContent = (
    <Stack spacing={3}>
      {!embedded && (
        <PageHeader
          title="Profile Settings"
          description="Manage your personal information and preferences"
          icon={User}
        />
      )}

      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3}
        sx={{ '& > *': { flex: 1 } }}
      >
        {/* Profile Picture Section */}
        <Card 
          variant="outlined"
          sx={{ 
            maxWidth: { md: '350px' },
            background: 'linear-gradient(135deg, rgba(255, 109, 86, 0.05) 0%, rgba(255, 109, 86, 0.02) 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent>
            <Typography level="title-lg" sx={{ mb: 3, fontWeight: 600 }}>
              Profile Picture
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <ProfilePicture 
                size="xl" 
                showName={true}
                user={userProfile}
              />

              <Typography level="body-sm" color="neutral" sx={{ mt: 2, textAlign: 'center' }}>
                Your avatar displays your initials
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <Card variant="outlined">
          <CardContent>
            <Typography level="title-lg" sx={{ mb: 3, fontWeight: 600 }}>
              Personal Information
            </Typography>

            <Stack spacing={2.5}>
                {/* Full Name */}
                <FormControl>
                  <FormLabel>Full Name *</FormLabel>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    startDecorator={<User sx={{ fontSize: 18, color: 'neutral.500' }} />}
                    size="lg"
                  />
                </FormControl>

                {/* Email (readonly) */}
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    value={formData.email}
                    disabled
                    startDecorator={<Email sx={{ fontSize: 18, color: 'neutral.500' }} />}
                    endDecorator={
                      <Chip 
                        size="sm" 
                        variant="soft" 
                        color="neutral"
                        startDecorator={<Lock sx={{ fontSize: 14 }} />}
                      >
                        Protected
                      </Chip>
                    }
                    size="lg"
                    sx={{
                      '& .MuiInput-input': {
                        color: 'text.primary'
                      }
                    }}
                  />
                  <Typography level="body-xs" color="neutral" sx={{ mt: 0.5, ml: 0.5 }}>
                    Email address cannot be changed
                  </Typography>
                </FormControl>

                {/* Phone Number */}
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    startDecorator={<Phone sx={{ fontSize: 18, color: 'neutral.500' }} />}
                    size="lg"
                  />
                </FormControl>

                <Divider sx={{ my: 1 }} />

                {/* Work Information */}
                <Typography level="title-md" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work sx={{ fontSize: 20 }} />
                  Work Information
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>Department</FormLabel>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g., sales"
                      startDecorator={<Work sx={{ fontSize: 18, color: 'neutral.500' }} />}
                      size="lg"
                    />
                  </FormControl>
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>Job Title</FormLabel>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="e.g., Sales Supporter"
                      startDecorator={<Badge sx={{ fontSize: 18, color: 'neutral.500' }} />}
                      size="lg"
                    />
                  </FormControl>
                </Stack>

                {/* Department suggestions */}
                {!formData.department && (
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.level1', 
                    borderRadius: 'sm',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography level="body-xs" color="neutral" sx={{ mb: 1, fontWeight: 600 }}>
                      Popular departments:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {departmentOptions.slice(0, 6).map((dept) => (
                        <Chip
                          key={dept}
                          size="sm"
                          variant="soft"
                          color="neutral"
                          onClick={() => handleInputChange('department', dept)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.softHoverBg'
                            }
                          }}
                        >
                          {dept}
                        </Chip>
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
      </Stack>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="solid"
          color="primary"
          size="lg"
          loading={loading}
          startDecorator={<Save />}
          onClick={handleSave}
          sx={{
            minWidth: '160px',
            fontWeight: 600
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert color="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert color="danger" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Stack>
  );

  if (embedded) {
    return profileContent;
  }

  return (
    <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {profileContent}
    </PageContainer>
  );
};

export default Profile;