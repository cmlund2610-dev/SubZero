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
  Security as Shield 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import ProfilePicture from '../components/ProfilePicture.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';

const Profile = ({ embedded = false }) => {
  const { user, userProfile, userCompany, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    email: user?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    department: userProfile?.department || '',
    jobTitle: userProfile?.jobTitle || ''
  });
  
  // Update form data when userProfile changes
  React.useEffect(() => {
    if (userProfile || user) {
      setFormData({
        fullName: userProfile?.fullName || '',
        email: user?.email || '',
        phoneNumber: userProfile?.phoneNumber || '',
        department: userProfile?.department || '',
        jobTitle: userProfile?.jobTitle || ''
      });
    }
  }, [userProfile, user]);

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
        <Card sx={{ maxWidth: { md: '300px' } }}>
          <CardContent>
            <Typography level="h4" sx={{ mb: 3 }}>
              Profile Picture
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <Card>
          <CardContent>
            <Typography level="h4" sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            <Stack spacing={3}>
                {/* Full Name */}
                <FormControl>
                  <FormLabel>Full Name *</FormLabel>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                {/* Email (readonly) */}
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    value={formData.email}
                    disabled
                    startDecorator={<Shield size={16} />}
                  />
                  <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
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
                  />
                </FormControl>

                <Divider />

                {/* Work Information */}
                <Typography level="title-md">Work Information</Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl>
                    <FormLabel>Department</FormLabel>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g., Engineering"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Job Title</FormLabel>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </FormControl>
                </Stack>

                {/* Department suggestions */}
                {!formData.department && (
                  <Box>
                    <Typography level="body-xs" color="neutral" sx={{ mb: 1 }}>
                      Popular departments:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {departmentOptions.slice(0, 6).map((dept) => (
                        <Chip
                          key={dept}
                          size="sm"
                          variant="outlined"
                          onClick={() => handleInputChange('department', dept)}
                          sx={{ cursor: 'pointer' }}
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
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="solid"
          color="primary"
          size="lg"
          loading={loading}
          startDecorator={<Save size={20} />}
          onClick={handleSave}
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
    <PageContainer maxWidth="1000px">
      {profileContent}
    </PageContainer>
  );
};

export default Profile;