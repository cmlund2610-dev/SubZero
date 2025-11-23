/**
 * ClientDetail Page - Individual client overview with tabbed interface
 * 
 * Shows detailed information about a specific client with tabs:
 * Overview, Usage, Notes, Tasks (all placeholders for now)
 * 
 * Uses useParams to get client ID from URL.
 * To integrate with data: fetch client data based on ID and populate tabs.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanel,
  Card,
  Chip,
  Button,
  Grid,
  Textarea,
  Input,
  Checkbox,
  Select,
  Option,
  List,
  ListItem,
  Avatar,
  CircularProgress
} from '@mui/joy';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getClient,
  addClientNote,
  getClientNotes,
  deleteClientNote,
  addClientTask,
  getClientTasks,
  updateClientTask,
  deleteClientTask
} from '../lib/clientData.js';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userCompany } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load client data from Firestore
  useEffect(() => {
    loadClient();
  }, [id, userCompany]);

  const loadClient = async () => {
    if (!userCompany?.id || !id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const clientData = await getClient(userCompany.id, id);
      setClient(clientData);
    } catch (error) {
      console.error('Error loading client:', error);
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, minHeight: '60vh' }}>
        <CircularProgress size="sm" />
      </Box>
    );
  }

  if (!client) {
    return (
      <Box>
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </Button>
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography level="h2" sx={{ mb: 2 }}>Client Not Found</Typography>
          <Typography level="body-md" color="neutral">
            The client you're looking for doesn't exist or may have been removed.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Back button and header */}
      <Stack spacing={3}>
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </Button>

        {/* Client header info */}
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={1}>
              <Typography level="h1" sx={{ fontWeight: 700 }}>
                {client.company?.name || 'Unknown Company'}
              </Typography>
              <Typography level="body-md" color="neutral">
                {client.contact?.name || 'N/A'} • {client.contact?.email || 'N/A'}
              </Typography>
              <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'neutral.400' }}>
                ID: {client.client?.id || client.id}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip 
                variant="soft" 
                color="primary"
                size="lg"
              >
                {client.subscribedMonths || 'Unknown'} months
              </Chip>
              <Chip 
                variant="soft" 
                color="success"
                size="lg"
              >
                Active Client
              </Chip>
            </Stack>
          </Stack>

          {/* Key metrics */}
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">MRR</Typography>
                <Typography level="h3" color="primary">
                  {formatCurrency(client.mrr)}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Lifetime Value</Typography>
                <Typography level="h3">
                  {formatCurrency(client.ltv)}
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Contract End</Typography>
                <Typography level="h3">{formatDate(client.contract?.endDate)}</Typography>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography level="body-sm" color="neutral">Renewal Date</Typography>
                <Typography level="h3">{formatDate(client.renewal?.date)}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>

        {/* Tabbed interface */}
        <Tabs defaultValue={0} sx={{ backgroundColor: 'transparent' }}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Notes</Tab>
            <Tab>Tasks</Tab>
          </TabList>
          <TabPanel value={0}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography level="title-lg">Client Overview</Typography>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Company Information</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Client ID</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          {client.client?.id || client.id}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Company Name</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.company?.name || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Primary Contact</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.contact?.name || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contact Email</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.contact?.email || 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Imported</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.importedAt ? formatDate(client.importedAt) : 'N/A'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
          <TabPanel value={1}>
            <NotesSection client={client} />
          </TabPanel>
          <TabPanel value={2}>
            <TasksSection client={client} />
          </TabPanel>
        </Tabs>
      </Stack>
    </Box>
  );
}

// ---- Notes Section Component ----
function NotesSection({ client }) {
  const { userProfile, userCompany } = useAuth();
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load notes from Firestore
  useEffect(() => {
    const loadNotes = async () => {
      if (!userCompany?.id) return;
      
      try {
        setLoading(true);
        const fetchedNotes = await getClientNotes(userCompany.id, client.id);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [client.id, userCompany?.id]);

  const addNote = async () => {
    if (!draft.trim() || !userCompany?.id) return;
    
    setSaving(true);
    try {
      const noteData = {
        text: draft.trim(),
        createdBy: userProfile?.uid || 'unknown',
        createdByName: userProfile?.fullName || 'Unknown User'
      };
      
      const newNote = await addClientNote(userCompany.id, client.id, noteData);
      setNotes([newNote, ...notes]);
      setDraft('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!userCompany?.id) return;
    
    try {
      await deleteClientNote(userCompany.id, client.id, noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  return (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Typography level="title-lg">Notes & Communications</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={5}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2}>
              <Typography level="title-md">Add Note</Typography>
              <Textarea
                minRows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Meeting summary, observation, next steps..."
              />
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button variant="outlined" color="neutral" onClick={() => setDraft('')} disabled={saving}>Clear</Button>
                <Button variant="solid" color="primary" onClick={addNote} loading={saving} disabled={!draft.trim()}>
                  Save Note
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Card variant="outlined" sx={{ p: 3 }}>
            {notes.length > 0 ? (
              notes.map(note => (
                <Stack key={note.id} spacing={1}>
                  <Typography level="body-md">{note.text}</Typography>
                  <Typography level="body-sm" color="neutral">{note.createdByName}</Typography>
                </Stack>
              ))
            ) : (
              <Typography level="body-md" color="neutral">No notes available.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      <Typography level="title-lg">Tasks</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={5}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2}>
              <Typography level="title-md">Add Task</Typography>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button variant="outlined" color="neutral" onClick={() => setTitle('')} disabled={saving}>Clear</Button>
                <Button variant="solid" color="primary" onClick={addTask} loading={saving} disabled={!title.trim()}>
                  Save Task
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Card variant="outlined" sx={{ p: 3 }}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <Stack key={task.id} spacing={1}>
                  <Typography level="body-md">{task.title}</Typography>
                  <Typography level="body-sm" color="neutral">{task.createdByName}</Typography>
                </Stack>
              ))
            ) : (
              <Typography level="body-md" color="neutral">No tasks available.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ---- Tasks Section Component ----
function TasksSection({ client }) {
  const { userProfile, userCompany } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load tasks from Firestore
  useEffect(() => {
    const loadTasks = async () => {
      if (!userCompany?.id) return;
      
      try {
        setLoading(true);
        const fetchedTasks = await getClientTasks(userCompany.id, client.id);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [client.id, userCompany?.id]);

  const addTask = async () => {
    if (!title.trim() || !userCompany?.id) return;
    
    setSaving(true);
    try {
      const taskData = {
        title: title.trim(),
        dueDate,
        priority,
        completed: false,
        createdBy: userProfile?.uid || 'unknown',
        createdByName: userProfile?.fullName || 'Unknown User'
      };
      
      const newTask = await addClientTask(userCompany.id, client.id, taskData);
      setTasks([...tasks, newTask]);
      setTitle('');
      setDueDate('');
      setPriority('normal');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (taskId) => {
    if (!userCompany?.id) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      await updateClientTask(userCompany.id, client.id, taskId, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    if (!userCompany?.id) return;
    
    try {
      await deleteClientTask(userCompany.id, client.id, taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const priorities = {
    low: { label: 'Low', color: 'neutral' },
    normal: { label: 'Normal', color: 'primary' },
    high: { label: 'High', color: 'warning' },
    critical: { label: 'Critical', color: 'danger' }
  };

  const openTasks = tasks.filter(t => !t.completed).sort((a,b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
  const completedTasks = tasks.filter(t => t.completed).sort((a,b) => b.createdAt - a.createdAt);

  return (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Typography level="title-lg">Tasks & Follow-ups</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={5}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography level="title-md">Add Task</Typography>
              <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Stack direction="row" spacing={2}>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} sx={{ flex: 1 }} />
                <Select value={priority} onChange={(e, val) => setPriority(val)} sx={{ minWidth: 140 }}>
                  <Option value="low">Low</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button 
                  variant="outlined" 
                  color="neutral" 
                  onClick={() => { setTitle(''); setDueDate(''); setPriority('normal'); }}
                  disabled={saving}
                >
                  Clear
                </Button>
                <Button 
                  variant="solid" 
                  color="primary" 
                  onClick={addTask}
                  loading={saving}
                  disabled={!title.trim()}
                >
                  Add Task
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Stack spacing={2}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography level="title-md">Open Tasks ({openTasks.length})</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : openTasks.length === 0 ? (
                  <Typography level="body-sm" color="neutral">No open tasks.</Typography>
                ) : (
                <List sx={{ p: 0, gap: 1 }}>
                  {openTasks.map(task => (
                    <ListItem key={task.id} sx={{ alignItems: 'flex-start' }}>
                      <Card variant="soft" sx={{ flex: 1, p: 2 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                              <Typography level="body-sm" sx={{ fontWeight: 600 }}>{task.title}</Typography>
                            </Stack>
                            <Chip size="sm" variant="soft" color={priorities[task.priority].color}>{priorities[task.priority].label}</Chip>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack spacing={0.5}>
                              <Typography level="body-xs" color="neutral">
                                {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
                              </Typography>
                              <Typography level="body-xs" color="neutral" sx={{ fontWeight: 600 }}>
                                Created by {task.createdByName || 'Unknown User'}
                              </Typography>
                            </Stack>
                            <Button size="sm" variant="outlined" color="danger" onClick={() => deleteTask(task.id)}>Delete</Button>
                          </Stack>
                        </Stack>
                      </Card>
                    </ListItem>
                  ))}
                </List>
                )}
              </Stack>
            </Card>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography level="title-md">Completed ({completedTasks.length})</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : completedTasks.length === 0 ? (
                  <Typography level="body-sm" color="neutral">No completed tasks yet.</Typography>
                ) : (
                <List sx={{ p: 0, gap: 1 }}>
                  {completedTasks.map(task => (
                    <ListItem key={task.id} sx={{ alignItems: 'flex-start' }}>
                      <Card variant="outlined" sx={{ flex: 1, p: 2, opacity: 0.7 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                              <Typography level="body-sm" sx={{ textDecoration: 'line-through' }}>{task.title}</Typography>
                            </Stack>
                            <Chip size="sm" variant="outlined" color={priorities[task.priority].color}>{priorities[task.priority].label}</Chip>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack spacing={0.5}>
                              <Typography level="body-xs" color="neutral">
                                Completed {new Date(task.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography level="body-xs" color="neutral" sx={{ fontWeight: 600 }}>
                                Created by {task.createdByName || 'Unknown User'}
                              </Typography>
                            </Stack>
                            <Button size="sm" variant="outlined" color="danger" onClick={() => deleteTask(task.id)}>Delete</Button>
                          </Stack>
                        </Stack>
                      </Card>
                    </ListItem>
                  ))}
                </List>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}