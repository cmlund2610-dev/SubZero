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
  Avatar
} from '@mui/joy';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ImportedData } from '../lib/persist.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get real client data from localStorage
  const clients = ImportedData.getClients();
  const client = clients.find(c => c.id === id);

  // If client not found, show not found message
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

  return (
    <Box>
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
                {client.subscribedMonths || 0} months
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
              
              {/* Company Information */}
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

              {/* Contract Information */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Contract Details</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contract Start Date</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.contract?.startDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Contract End Date</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.contract?.endDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Next Renewal</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {formatDate(client.renewal?.date)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Subscription Duration</Typography>
                        <Typography level="body-md" sx={{ fontWeight: 500 }}>
                          {client.subscribedMonths || 0} months
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>

              {/* Financial Information */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography level="title-md">Financial Metrics</Typography>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Monthly Recurring Revenue</Typography>
                        <Typography level="h4" color="primary">
                          {formatCurrency(client.mrr)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" color="neutral">Lifetime Value</Typography>
                        <Typography level="h4" color="success">
                          {formatCurrency(client.ltv)}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Stack>
          </TabPanel>
          
          {/* Notes Tab */}
          <TabPanel value={1}>
            <NotesSection client={client} />
          </TabPanel>
          {/* Tasks Tab */}
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
  const { userProfile } = useAuth();
  const storageKey = `subzero_client_notes_${client.id}`;
  const [notes, setNotes] = useState([]); // {id, text, createdAt, createdBy, createdByName}
  const [draft, setDraft] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setNotes(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load notes', e);
    }
  }, [storageKey]);

  const persist = (next) => {
    setNotes(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addNote = () => {
    if (!draft.trim()) return;
    const next = [
      { 
        id: crypto.randomUUID(), 
        text: draft.trim(), 
        createdAt: Date.now(),
        createdBy: userProfile?.id || 'unknown',
        createdByName: userProfile?.fullName || 'Unknown User'
      },
      ...notes
    ];
    persist(next);
    setDraft('');
  };

  const deleteNote = (id) => {
    persist(notes.filter(n => n.id !== id));
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
                <Button variant="outlined" color="neutral" onClick={() => setDraft('')}>Clear</Button>
                <Button variant="solid" color="primary" onClick={addNote}>Save Note</Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography level="title-md">Recent Notes</Typography>
              {notes.length === 0 && (
                <Typography level="body-sm" color="neutral">No notes yet.</Typography>
              )}
              <List sx={{ p: 0, gap: 1 }}>
                {notes.map(note => (
                  <ListItem key={note.id} sx={{ alignItems: 'flex-start' }}>
                    <Card variant="soft" sx={{ flex: 1, p: 2 }}>
                      <Stack spacing={1}>
                        <Typography level="body-sm" sx={{ whiteSpace: 'pre-line' }}>{note.text}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack spacing={0.5}>
                            <Typography level="body-xs" color="neutral" sx={{ fontWeight: 600 }}>
                              {note.createdByName || 'Unknown User'}
                            </Typography>
                            <Typography level="body-xs" color="neutral">
                              {new Date(note.createdAt).toLocaleString()}
                            </Typography>
                          </Stack>
                          <Button size="sm" variant="outlined" color="danger" onClick={() => deleteNote(note.id)}>Delete</Button>
                        </Stack>
                      </Stack>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

// ---- Tasks Section Component ----
function TasksSection({ client }) {
  const { userProfile } = useAuth();
  const storageKey = `subzero_client_tasks_${client.id}`;
  const [tasks, setTasks] = useState([]); // {id, title, dueDate, priority, completed, createdAt, createdBy, createdByName}
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load tasks', e);
    }
  }, [storageKey]);

  const persist = (next) => {
    setTasks(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addTask = () => {
    if (!title.trim()) return;
    const next = [
      ...tasks,
      { 
        id: crypto.randomUUID(), 
        title: title.trim(), 
        dueDate, 
        priority, 
        completed: false, 
        createdAt: Date.now(),
        createdBy: userProfile?.id || 'unknown',
        createdByName: userProfile?.fullName || 'Unknown User'
      }
    ];
    persist(next);
    setTitle('');
    setDueDate('');
    setPriority('normal');
  };

  const toggleTask = (id) => {
    persist(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    persist(tasks.filter(t => t.id !== id));
  };

  const priorities = {
    low: { label: 'Low', color: 'neutral' },
    normal: { label: 'Normal', color: 'primary' },
    high: { label: 'High', color: 'warning' },
    critical: { label: 'Critical', color: 'danger' }
  };

  const openTasks = tasks.filter(t => !t.completed).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
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
                <Button variant="outlined" color="neutral" onClick={() => { setTitle(''); setDueDate(''); setPriority('normal'); }}>Clear</Button>
                <Button variant="solid" color="primary" onClick={addTask}>Add Task</Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Stack spacing={2}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography level="title-md">Open Tasks ({openTasks.length})</Typography>
                {openTasks.length === 0 && <Typography level="body-sm" color="neutral">No open tasks.</Typography>}
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
              </Stack>
            </Card>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography level="title-md">Completed ({completedTasks.length})</Typography>
                {completedTasks.length === 0 && <Typography level="body-sm" color="neutral">No completed tasks yet.</Typography>}
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
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}