/**
 * Authentication Context and Provider
 * 
 * Manages user authentication state, profile data, and auth operations
 * Integrates Firebase Auth with Firestore for user profiles
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  collection
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase.js';

const AuthContext = createContext({});

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userCompany, setUserCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password + profile data
  const signup = async (email, password, profileData) => {
    console.log('🔵 Signup function called with:', { email, profileData });
    try {
      setError(null);
      setLoading(true);

      console.log('🔵 Creating user account...');
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ User account created:', user.uid);

      // Update the user's display name
      await updateProfile(user, {
        displayName: profileData.fullName
      });
      console.log('✅ User display name updated');

      // Create or join company
      let companyId;
      let companyData;
      
      console.log('🔵 Creating company document...');
      if (profileData.isNewCompany) {
        // Create new company with current user as admin
        const companyRef = doc(collection(db, 'companies'));
        companyId = companyRef.id;
        console.log('🔵 Company ID generated:', companyId);
        
        companyData = {
          id: companyId,
          name: profileData.companyName,
          industry: profileData.companyIndustry || '',
          size: profileData.companySize || '',
          adminUsers: [user.uid],
          standardUsers: [],
          allUsers: [user.uid],
          settings: {
            allowUserInvitations: true,
            requireAdminApproval: false
          },
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          updatedAt: serverTimestamp()
        };
        
        console.log('🔵 Saving company data:', companyData);
        try {
          await setDoc(companyRef, companyData);
          console.log('✅ Company document saved');
        } catch (error) {
          console.error('❌ Failed to save company document:', error);
          throw new Error('Company creation failed');
        }
      } else {
        // Join existing company (would need invitation logic here)
        companyId = profileData.companyId;
        // For now, we'll create new companies for all signups
      }

      console.log('🔵 Creating user profile document...');
      // Save user profile data to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const completeProfile = {
        uid: user.uid,
        email: user.email,
        fullName: profileData.fullName,
        jobTitle: profileData.jobTitle || '',
        department: profileData.department || 'customer-success',
        companyId: companyId,
        role: profileData.isNewCompany ? 'admin' : 'standard',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('🔵 Saving user profile:', completeProfile);
      try {
        await setDoc(userDocRef, completeProfile);
        console.log('✅ User profile saved');
      } catch (error) {
        console.error('❌ Failed to save user profile:', error);
        throw new Error('User profile creation failed');
      }
      
      setUserProfile(completeProfile);
      setUserCompany(companyData);

      console.log('✅ Signup complete successfully');
      return { user, profile: completeProfile, company: companyData };
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Signin error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      setLoading(true);

      if (!currentUser) throw new Error('No user logged in');

      // Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userDocRef, updateData);

      // Update Firebase Auth profile if displayName or photoURL is updated
      const authUpdates = {};
      if (updates.fullName && updates.fullName !== currentUser.displayName) {
        authUpdates.displayName = updates.fullName;
      }
      if (updates.photoURL && updates.photoURL !== currentUser.photoURL) {
        authUpdates.photoURL = updates.photoURL;
      }

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(currentUser, authUpdates);
      }

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updateData }));

      return updateData;
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = useCallback(async (uid) => {
    console.log('🔵 loadUserProfile called for:', uid);
    try {
      const userDocRef = doc(db, 'users', uid);
      console.log('🔵 Getting user document from Firestore...');
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profile = userDoc.data();
        console.log('✅ User profile loaded:', profile);
        setUserProfile(profile);
        
        // Load company data if user has a companyId
        if (profile.companyId) {
          console.log('🔵 Loading company data for:', profile.companyId);
          await loadCompanyData(profile.companyId);
        }
        
        return profile;
      } else {
        console.warn('⚠️ No user profile found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      setError(error.message);
      return null;
    }
  }, []);

  // Load company data from Firestore
  const loadCompanyData = async (companyId) => {
    try {
      const companyDocRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyDocRef);
      
      if (companyDoc.exists()) {
        const company = companyDoc.data();
        setUserCompany(company);
        return company;
      } else {
        console.warn('No company found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      return null;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔵 Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      try {
        setCurrentUser(user);
        
        if (user) {
          // Load user profile data from Firestore
          console.log('🔵 Loading user profile for:', user.uid);
          await loadUserProfile(user.uid);
        } else {
          setUserProfile(null);
          setUserCompany(null);
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [loadUserProfile]);

  // Context value
  const value = {
    currentUser,
    userProfile,
    userCompany,
    loading,
    error,
    signup,
    signin,
    logout,
    updateUserProfile,
    loadUserProfile,
    loadCompanyData,
    // Helper computed properties
    isAuthenticated: !!currentUser,
    isProfileLoaded: !!userProfile,
    isCompanyLoaded: !!userCompany,
    isAdmin: userProfile?.role === 'admin' || (userCompany?.adminUsers && currentUser && userCompany.adminUsers.includes(currentUser.uid)),
    companyName: userCompany?.name
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Refactored to ensure only components are exported for fast refresh compatibility.