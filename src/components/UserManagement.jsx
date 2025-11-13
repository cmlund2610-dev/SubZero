/**
 * User Management Component
 * 
 * Admin interface for managing company users:
 * - View all company users
 * - Invite new users via email
 * - Assign roles (admin/standard)
 * - Remove users from company
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Input,
  Select,
  Option,
  Table,
  Sheet,
  Avatar,
  Chip,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Stack,
  Alert,
  Divider,
  Grid
} from '@mui/joy';
import {
  PersonAdd as UserPlus,
  People as Users,
  Email as Mail,
  Security as Shield,
  PersonOff as UserX,
  Star as Crown,
  Settings,
  PersonOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import ProfilePicture from './ProfilePicture.jsx';

const UserManagement = () => {
  const { userProfile, userCompany, isAdmin, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Invitation modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'standard'
  });
  const [inviteLoading, setInviteLoading] = useState(false);

  // Load company users
  const loadUsers = async () => {
    console.log('🔍 loadUsers called');
    console.log('🔍 userCompany:', userCompany);
    
    if (!userCompany?.id) {
      console.warn('⚠️ No userCompany.id available');
      setError('No company information available');
      return;
    }

    try {
      console.log('🔵 Loading users for company:', userCompany.id);
      setLoading(true);
      setError(''); // Clear previous errors
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('companyId', '==', userCompany.id));
      console.log('🔵 Executing Firestore query...');
      
      const querySnapshot = await getDocs(q);
      console.log('🔵 Query result size:', querySnapshot.size);
      
      const usersList = [];
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        console.log('🔍 Found user:', userData);
        usersList.push(userData);
      });

      // Sort users: admins first, then by name
      usersList.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (b.role === 'admin' && a.role !== 'admin') return 1;
        return (a.fullName || '').localeCompare(b.fullName || '');
      });

      console.log('✅ Users loaded successfully:', usersList.length, 'users');
      setUsers(usersList);
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [userCompany?.id]);

  // Handle user role change
  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin || !userCompany) return;

    try {
      const userRef = doc(db, 'users', userId);
      const companyRef = doc(db, 'companies', userCompany.id);
      
      // Update user role
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      });

      // Update company admin/standard user lists
      if (newRole === 'admin') {
        await updateDoc(companyRef, {
          adminUsers: arrayUnion(userId),
          standardUsers: arrayRemove(userId),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(companyRef, {
          standardUsers: arrayUnion(userId),
          adminUsers: arrayRemove(userId),
          updatedAt: serverTimestamp()
        });
      }

      setSuccess(`User role updated to ${newRole}`);
      loadUsers(); // Reload users
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  // Handle user removal
  const handleRemoveUser = async (userId) => {
    if (!isAdmin || !userCompany || userId === currentUser.uid) return;

    if (!confirm('Are you sure you want to remove this user from the company?')) {
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const companyRef = doc(db, 'companies', userCompany.id);
      const user = users.find(u => u.id === userId);
      
      // Remove user from company lists
      await updateDoc(companyRef, {
        adminUsers: arrayRemove(userId),
        standardUsers: arrayRemove(userId),
        allUsers: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });

      // Update user to remove company association
      await updateDoc(userRef, {
        companyId: null,
        role: null,
        removedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSuccess('User removed from company');
      loadUsers();
    } catch (err) {
      console.error('Error removing user:', err);
      setError('Failed to remove user');
    }
  };

  // Handle invitation
  const handleInviteUser = async () => {
    if (!isAdmin || !userCompany) return;

    if (!inviteForm.email.trim()) {
      setError('Email is required');
      return;
    }

    setInviteLoading(true);
    setError('');

    try {
      // Create invitation record (in a real app, you'd send an actual email)
      const inviteRef = doc(collection(db, 'invitations'));
      const invitation = {
        id: inviteRef.id,
        email: inviteForm.email.toLowerCase().trim(),
        companyId: userCompany.id,
        companyName: userCompany.name,
        role: inviteForm.role,
        invitedBy: currentUser.uid,
        invitedByName: userProfile.fullName,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await setDoc(inviteRef, invitation);

      setSuccess(`Invitation sent to ${inviteForm.email}`);
      setInviteForm({ email: '', role: 'standard' });
      setShowInviteModal(false);

      // In a real app, you would send an actual email here
      console.log('Invitation created:', invitation);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert color="warning">
          <Typography>Only company administrators can access user management.</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography level="h2" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <PersonOutlined sx={{ fontSize: 32 }} />
              User Management
            </Typography>
            <Typography level="body-lg" color="neutral">
              Manage {userCompany?.name} team members
            </Typography>
          </Box>
          
          <Button
            variant="solid"
            color="primary"
            size="lg"
            startDecorator={<UserPlus size={20} />}
            onClick={() => setShowInviteModal(true)}
          >
            Invite User
          </Button>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography level="h3" color="primary">
                  {users.length}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography level="h3" color="success">
                  {users.filter(u => u.role === 'admin').length}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Admins
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography level="h3" color="neutral">
                  {users.filter(u => u.role === 'standard').length}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Settings size={20} />
            Company Members
          </Typography>

          {/* Error State */}
          {error && (
            <Alert color="danger" sx={{ mb: 2 }}>
              <Typography level="title-sm">Error loading users</Typography>
              <Typography level="body-sm">{error}</Typography>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Alert color="neutral" sx={{ mb: 2 }}>
              <Typography level="body-sm">Loading users...</Typography>
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <Alert color="primary" sx={{ mb: 2 }}>
              <Stack spacing={1}>
                <Typography level="title-sm">No team members yet</Typography>
                <Typography level="body-sm">
                  You're the first user in your company! Use the "Invite User" button to add team members.
                </Typography>
              </Stack>
            </Alert>
          )}

          {/* Users Table - only show if we have users */}
          {!loading && !error && users.length > 0 && (
            <Sheet sx={{ overflow: 'auto' }}>
              <Table hoverRow>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <ProfilePicture 
                        size="sm" 
                        user={user}
                      />
                    </td>
                    <td>
                      <Stack spacing={0.5}>
                        <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                          {user.fullName}
                          {user.id === currentUser.uid && (
                            <Chip size="sm" variant="soft" sx={{ ml: 1 }}>You</Chip>
                          )}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {user.jobTitle}
                        </Typography>
                      </Stack>
                    </td>
                    <td>
                      <Typography level="body-sm">{user.email}</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm" sx={{ textTransform: 'capitalize' }}>
                        {user.department?.replace('-', ' ')}
                      </Typography>
                    </td>
                    <td>
                      <Select
                        value={user.role}
                        onChange={(e, value) => handleRoleChange(user.id, value)}
                        disabled={user.id === currentUser.uid}
                        size="sm"
                      >
                        <Option value="standard">Member</Option>
                        <Option value="admin">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Crown size={14} />
                            <span>Admin</span>
                          </Stack>
                        </Option>
                      </Select>
                    </td>
                    <td>
                      <Typography level="body-xs" color="neutral">
                        {user.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                      </Typography>
                    </td>
                    <td>
                      {user.id !== currentUser.uid && (
                        <IconButton
                          size="sm"
                          color="danger"
                          variant="outlined"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <UserX size={16} />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
          )}
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h3" sx={{ mb: 2 }}>
            Invite Team Member
          </Typography>
          
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                startDecorator={<Mail size={16} />}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                value={inviteForm.role}
                onChange={(e, value) => setInviteForm(prev => ({ ...prev, role: value }))}
              >
                <Option value="standard">Member</Option>
                <Option value="admin">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Crown size={14} />
                    <span>Admin</span>
                  </Stack>
                </Option>
              </Select>
            </FormControl>

            <Alert color="primary" size="sm">
              <Typography level="body-sm">
                The invited user will be able to access all {userCompany?.name} data and features based on their role.
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="primary"
                loading={inviteLoading}
                onClick={handleInviteUser}
              >
                Send Invitation
              </Button>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* Success/Error Messages */}
      {success && (
        <Alert color="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert color="danger" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default UserManagement;