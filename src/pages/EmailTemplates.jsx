import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Card, Grid, Button, Input, Textarea, IconButton, Sheet } from '@mui/joy';
import { Email, Delete, Save } from '@mui/icons-material';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import persist from '../lib/persist.js';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '' });

  useEffect(() => {
    const seeded = persist.EmailTemplates.ensureDefaults();
    setTemplates(seeded);
  }, []);

  const startEdit = (t) => {
    setEditing(t.id);
    setForm({ name: t.name, subject: t.subject, body: t.body });
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      persist.EmailTemplates.update(editing, { ...form });
    } else {
      persist.EmailTemplates.add({ ...form });
    }
    setTemplates(persist.EmailTemplates.getAll());
    setEditing(null);
    setForm({ name: '', subject: '', body: '' });
  };

  const remove = (id) => {
    persist.EmailTemplates.remove(id);
    setTemplates(persist.EmailTemplates.getAll());
    if (editing === id) {
      setEditing(null);
      setForm({ name: '', subject: '', body: '' });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Email Templates"
        description="Create and manage email templates with merge tags for automations"
        icon={Email}
      />

      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Stack spacing={2}>
          <Typography level="title-lg">{editing ? 'Edit Template' : 'Create Template'}</Typography>
          <Input placeholder="Template name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Textarea minRows={6} placeholder="Email body. Use tags like {{client.name}}, {{renewal.date}}, {{mrr}}, {{csm.name}}, {{client.contact.email}}" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Stack direction="row" spacing={1}>
            <Button startDecorator={<Save />} onClick={save}>{editing ? 'Save Changes' : 'Add Template'}</Button>
            {editing && (
              <Button variant="outlined" onClick={() => { setEditing(null); setForm({ name: '', subject: '', body: '' }); }}>Cancel</Button>
            )}
          </Stack>
        </Stack>
      </Card>

      <Typography level="title-md" sx={{ mb: 1 }}>Available merge tags</Typography>
      <Sheet variant="soft" sx={{ p: 2, mb: 2 }}>
        <Typography level="body-sm" color="neutral">
          {'{{client.name}}'}, {'{{client.contact.name}}'}, {'{{client.contact.email}}'}, {'{{renewal.date}}'}, {'{{mrr}}'}, {'{{days_until}}'}, {'{{company.name}}'}, {'{{csm.name}}'}, {'{{csm.email}}'}
        </Typography>
      </Sheet>

      <Grid container spacing={2}>
        {templates.length === 0 ? (
          <Grid xs={12}>
            <Sheet variant="soft" sx={{ p: 3, textAlign: 'center' }}>
              <Typography level="body-md" color="neutral">No templates yet. Create your first one above.</Typography>
            </Sheet>
          </Grid>
        ) : (
          templates.map(t => (
            <Grid key={t.id} xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography level="title-md">{t.name}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button size="sm" onClick={() => startEdit(t)}>Edit</Button>
                      <IconButton size="sm" color="danger" onClick={() => remove(t.id)}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>Subject</Typography>
                  <Typography level="body-sm" color="neutral">{t.subject}</Typography>
                  <Typography level="body-sm" sx={{ fontWeight: 600, mt: 1 }}>Body</Typography>
                  <Sheet variant="soft" sx={{ p: 1.5, maxHeight: 200, overflow: 'auto' }}>
                    <Typography level="body-sm" whiteSpace="pre-wrap">{t.body}</Typography>
                  </Sheet>
                </Stack>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </PageContainer>
  );
}
