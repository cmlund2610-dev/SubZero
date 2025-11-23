import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Card, Avatar, Button } from '@mui/joy';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DomainRounded } from '@mui/icons-material';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import { PieChart, Pie, ResponsiveContainer, Legend } from 'recharts';

export default function CompanyOverview() {
  const { userProfile } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [standardUsers, setStandardUsers] = useState([]);
  const [allowUserInvitations, setAllowUserInvitations] = useState(false);
  const [requireAdminApproval, setRequireAdminApproval] = useState(false);
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(false);
  const [enableDataEncryption, setEnableDataEncryption] = useState(false);
  const [dataStorage, setDataStorage] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!userProfile?.companyId) return;

      try {
        const companyDocRef = doc(db, 'companies', userProfile.companyId);
        const companyDoc = await getDoc(companyDocRef);
        if (companyDoc.exists()) {
          setCompanyData(companyDoc.data());
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    const fetchUsers = async () => {
      if (!userProfile?.companyId) return;

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('companyId', '==', userProfile.companyId));
        const querySnapshot = await getDocs(q);

        const admins = [];
        const standards = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.role === 'admin') {
            admins.push(userData);
          } else {
            standards.push(userData);
          }
        });

        setAdminUsers(admins);
        setStandardUsers(standards);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchDataStorage = async () => {
      try {
        const companyDocRef = doc(db, 'companies', userProfile.companyId);
        const companyDoc = await getDoc(companyDocRef);

        if (companyDoc.exists()) {
          const companyData = companyDoc.data();

          const clientDataSize = companyData.clientDataSize || 0;
          const tasksDataSize = companyData.tasksDataSize || 0;
          const notesDataSize = companyData.notesDataSize || 0;

          setDataStorage([
            { name: 'Client Data', value: clientDataSize },
            { name: 'Tasks', value: tasksDataSize },
            { name: 'Notes', value: notesDataSize },
          ]);
        } else {
          const clientsRef = collection(db, 'clients');
          const clientsSnapshot = await getDocs(query(clientsRef, where('companyId', '==', userProfile.companyId)));

          const clientDataSize = clientsSnapshot.docs.reduce((acc, doc) => acc + (doc.data().size || 0), 0);

          const companyDocRef = doc(db, 'companies', userProfile.companyId);
          await updateDoc(companyDocRef, {
            clientDataSize,
          });

          setDataStorage([
            { name: 'Client Data', value: clientDataSize },
            { name: 'Tasks', value: 0 },
            { name: 'Notes', value: 0 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data storage:', error);
      }
    };

    const updateCompanyUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('companyId', '==', userProfile.companyId));
        const querySnapshot = await getDocs(q);

        const adminUsers = [];
        const allUsers = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          allUsers.push(doc.id);
          if (userData.role === 'admin') {
            adminUsers.push(doc.id);
          }
        });

        const companyDocRef = doc(db, 'companies', userProfile.companyId);
        await updateDoc(companyDocRef, {
          adminUsers: adminUsers.length,
          allUsers: allUsers.length,
        });
      } catch (error) {
        console.error('Error updating company users:', error);
      }
    };

    fetchCompanyData();
    fetchUsers();
    fetchDataStorage();
    updateCompanyUsers();
  }, [userProfile?.companyId]);

  if (!companyData) {
    return <Typography level="body-md">Loading company information...</Typography>;
  }

  return (
    <PageContainer sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <PageHeader
        title={companyData.name}
        description="View and manage your company details"
        icon={DomainRounded}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3, maxWidth: '1200px', mx: 'auto' }}>
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Company Information
            </Typography>
            <Stack spacing={1}>
              <Typography level="body-md">Industry: {companyData.industry || 'Not specified'}</Typography>
              <Typography level="body-md">Company Size: {companyData.size || 'Not specified'}</Typography>
              <Typography level="body-md">Created At: {new Date(companyData.createdAt?.seconds * 1000).toLocaleDateString() || 'Not available'}</Typography>
              <Typography level="body-md">Company ID: {companyData.id || 'Not available'}</Typography>
              <Typography level="body-md">Admin Count: {adminUsers.length}</Typography>
              <Typography level="body-md">Standard User Count: {standardUsers.length}</Typography>
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Data Storage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataStorage}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={(entry) => `${entry.name}: ${entry.value} GB`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={1}>
              <Typography level="body-md">Total Storage: 10 GB</Typography>
              <Typography level="body-md">Backup Frequency: Daily</Typography>
            </Stack>
          </Card>
        </Stack>

        <Stack spacing={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Users
            </Typography>
            <Stack spacing={1}>
              {adminUsers.concat(standardUsers).map((user) => (
                <Box key={user.uid} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={user.profilePicture} alt={user.fullName} />
                  <Typography level="body-md">{user.fullName} ({user.email}) - {user.role}</Typography>
                </Box>
              ))}
            </Stack>
            <Button variant="solid" color="primary" sx={{ width: 'fit-content', ml: 'auto', display: 'block' }} onClick={() => navigateToUsersPage()}>Manage Users</Button>
          </Card>
        </Stack>
      </Box>
    </PageContainer>
  );
}

function navigateToUsersPage() {
  window.location.href = '/users';
}