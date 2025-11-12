/**
 * ProfilePicture Component
 * 
 * Displays user avatar with initials (no upload functionality)
 */

import React from 'react';
import {
  Avatar,
  Box,
  Typography
} from '@mui/joy';
import { useAuth } from '../context/AuthContext.jsx';

const ProfilePicture = ({ size = 'lg', showName = false, user = null }) => {
  const { user: currentUser, userProfile } = useAuth();

  // Use provided user, or userProfile (Firestore), or currentUser (Firebase Auth) as fallback
  const displayUser = user || userProfile || currentUser;

  console.log('🎭 ProfilePicture context:', {
    providedUser: user,
    userProfile: userProfile,
    currentUser: currentUser,
    displayUser: displayUser
  });

  // Get initials from user's name or email
  const getInitials = (user) => {
    console.log('🔤 Getting initials for user:', user);
    console.log('🔤 Available fields:', {
      fullName: user?.fullName,
      displayName: user?.displayName,
      email: user?.email,
      name: user?.name
    });
    
    // Try fullName first (Firestore user profile)
    if (user?.fullName) {
      const initials = user.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      console.log('✅ From fullName:', user.fullName, '→', initials);
      return initials;
    }
    
    // Try displayName second (Firebase Auth user)
    if (user?.displayName) {
      const initials = user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      console.log('✅ From displayName:', user.displayName, '→', initials);
      return initials;
    }
    
    // Try generic name field
    if (user?.name) {
      const initials = user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      console.log('✅ From name:', user.name, '→', initials);
      return initials;
    }
    
    // Fall back to email first letter
    if (user?.email) {
      const initials = user.email[0].toUpperCase();
      console.log('✅ From email:', user.email, '→', initials);
      return initials;
    }
    
    console.log('❌ No name/email found, using fallback "U"');
    return 'U';
  };

  const sizeMap = {
    sm: '2rem',
    md: '3rem', 
    lg: '4rem',
    xl: '6rem'
  };

  const fontSizeMap = {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem'
  };

  return (
    <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
      {/* Avatar with initials */}
      <Avatar
        size={size}
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
          fontSize: fontSizeMap[size],
          fontWeight: 600,
          bgcolor: 'primary.500',
          color: 'white'
        }}
      >
        {getInitials(displayUser)}
      </Avatar>

      {/* Optional name display */}
      {showName && displayUser && (
        <Typography 
          level="body-sm" 
          sx={{ 
            mt: 1, 
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {displayUser.fullName || displayUser.displayName || displayUser.email}
        </Typography>
      )}
    </Box>
  );
};

export default ProfilePicture;