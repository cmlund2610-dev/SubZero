import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Card, Grid, Button, Input, Select, Option, Chip, Switch, IconButton, Sheet } from '@mui/joy';
import { BoltRounded, Autorenew, UploadFile, Delete, Add, MonetizationOn, DescriptionOutlined } from '@mui/icons-material';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import persist from '../lib/persist.js';

const triggerOptions = [
  { value: 'renewal_due', label: 'Renewal due in X days', icon: <Autorenew sx={{ fontSize: 16 }} /> },
  { value: 'new_client_added', label: 'New client added', icon: <UploadFile sx={{ fontSize: 16 }} /> },
  { value: 'mrr_above', label: 'MRR above threshold', icon: <MonetizationOn sx={{ fontSize: 16 }} /> },
  { value: 'stage_changed', label: 'Renewal stage changes to…', icon: <DescriptionOutlined sx={{ fontSize: 16 }} /> },
  { value: 'import_completed', label: 'Client data import completed', icon: <UploadFile sx={{ fontSize: 16 }} /> },
];

const actionOptions = [
  { value: 'send_email', label: 'Send email notification' },
  { value: 'create_task', label: 'Create follow-up task' },
  { value: 'post_webhook', label: 'POST to webhook URL' },
];

export default function Automations() {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState(() => persist.Automations.getAll());
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    name: '',
    trigger: 'renewal_due',
    triggerConfig: { days: 14, mrr: 10000, stage: 'negotiation' },
    actions: [{ type: 'send_email', config: { recipientType: 'csm', email: '', templateId: '' } }],
  });

  useEffect(() => {
    const seeded = persist.EmailTemplates.ensureDefaults();
    setTemplates(seeded);
    // set default template if empty
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.map(a => a.type === 'send_email' ? { ...a, config: { ...a.config, templateId: seeded[0]?.id || '' } } : a)
    }));
  }, []);

  const addAutomation = () => {
    if (!form.name.trim()) return;
    const created = persist.Automations.add({ ...form });
    setAutomations(persist.Automations.getAll());
  setForm({ name: '', trigger: 'renewal_due', triggerConfig: { days: 14, mrr: 10000, stage: 'negotiation' }, actions: [{ type: 'send_email', config: { recipientType: 'csm', email: '', templateId: templates[0]?.id || '' } }] });
  };

  const removeAutomation = (id) => {
    persist.Automations.remove(id);
    setAutomations(persist.Automations.getAll());
  };

  const toggleAutomation = (id) => {
    persist.Automations.toggle(id);
    setAutomations(persist.Automations.getAll());
  };

  return (
    <PageContainer>
      <PageHeader
        title="Automations"
        description="Set up rules that trigger actions based on client data and events"
        icon={BoltRounded}
      />

      {/* Quick suggestions */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Chip variant="soft">Suggestion: Email CSM when a renewal is 14 days away</Chip>
        <Chip variant="soft">Suggestion: Create task when MRR {'>'} $10k</Chip>
        <Chip variant="soft">Suggestion: Notify when stage enters Negotiation</Chip>
      </Stack>

      {/* Create rule */}
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Stack spacing={2}>
          <Typography level="title-lg">Create Automation</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Input placeholder="Automation name (e.g., Renewal reminder)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ flex: 2 }} />
            <Select value={form.trigger} onChange={(e, v) => setForm({ ...form, trigger: v })} sx={{ minWidth: 260 }}>
              {triggerOptions.map(opt => (
                <Option key={opt.value} value={opt.value} startDecorator={opt.icon}>{opt.label}</Option>
              ))}
            </Select>
          </Stack>

          {/* Trigger config */}
          {form.trigger === 'renewal_due' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Input type="number" value={form.triggerConfig.days} onChange={(e) => setForm({ ...form, triggerConfig: { ...form.triggerConfig, days: Number(e.target.value) } })} startDecorator={<Autorenew sx={{ fontSize: 16 }} />} slotProps={{ input: { min: 1 } }} />
              <Typography level="body-sm" color="neutral">days before renewal</Typography>
            </Stack>
          )}
          {form.trigger === 'mrr_above' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Input type="number" value={form.triggerConfig.mrr} onChange={(e) => setForm({ ...form, triggerConfig: { ...form.triggerConfig, mrr: Number(e.target.value) } })} startDecorator={<MonetizationOn sx={{ fontSize: 16 }} />} />
              <Typography level="body-sm" color="neutral">minimum MRR</Typography>
            </Stack>
          )}
          {form.trigger === 'stage_changed' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Select value={form.triggerConfig.stage} onChange={(e, v) => setForm({ ...form, triggerConfig: { ...form.triggerConfig, stage: v } })} sx={{ minWidth: 220 }}>
                <Option value="forecast">Forecast</Option>
                <Option value="tentative">Tentative</Option>
                <Option value="negotiation">Negotiation</Option>
                <Option value="closed_won">Closed Won</Option>
                <Option value="closed_lost">Closed Lost</Option>
              </Select>
              <Typography level="body-sm" color="neutral">stage</Typography>
            </Stack>
          )}

          {/* Actions */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Select value={form.actions[0]?.type} onChange={(e, v) => setForm({ ...form, actions: [{ type: v, config: form.actions[0]?.config || {} }] })} sx={{ minWidth: 240 }}>
              {actionOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
            {form.actions[0]?.type === 'send_email' && (
              <>
                <Select value={form.actions[0]?.config?.recipientType || 'csm'} onChange={(e, v) => setForm({ ...form, actions: [{ type: 'send_email', config: { ...form.actions[0].config, recipientType: v } }] })} sx={{ minWidth: 220 }}>
                  <Option value="csm">Recipient: CSM</Option>
                  <Option value="client_contact">Recipient: Client Contact</Option>
                  <Option value="email">Recipient: Specific Email</Option>
                </Select>
                {form.actions[0]?.config?.recipientType === 'email' && (
                  <Input placeholder="Recipient email" value={form.actions[0]?.config?.email || ''} onChange={(e) => setForm({ ...form, actions: [{ type: 'send_email', config: { ...form.actions[0].config, email: e.target.value } }] })} sx={{ flex: 1 }} />
                )}
                <Select value={form.actions[0]?.config?.templateId || ''} onChange={(e, v) => setForm({ ...form, actions: [{ type: 'send_email', config: { ...form.actions[0].config, templateId: v } }] })} sx={{ minWidth: 260 }}>
                  {templates.map(t => (
                    <Option key={t.id} value={t.id}>Template: {t.name}</Option>
                  ))}
                </Select>
                <Button variant="outlined" onClick={() => navigate('/email-templates')}>Manage templates</Button>
              </>
            )}
            {form.actions[0]?.type === 'post_webhook' && (
              <Input placeholder="Webhook URL" value={form.actions[0]?.config?.url || ''} onChange={(e) => setForm({ ...form, actions: [{ type: 'post_webhook', config: { url: e.target.value } }] })} sx={{ flex: 1 }} />
            )}
            {form.actions[0]?.type === 'create_task' && (
              <Input placeholder="Task title" value={form.actions[0]?.config?.title || ''} onChange={(e) => setForm({ ...form, actions: [{ type: 'create_task', config: { title: e.target.value } }] })} sx={{ flex: 1 }} />
            )}
            <Button startDecorator={<Add />} onClick={addAutomation} sx={{ minWidth: 160 }}>Add</Button>
          </Stack>
        </Stack>
      </Card>

      {/* List */}
      <Grid container spacing={2}>
        {automations.length === 0 ? (
          <Grid xs={12}>
            <Sheet variant="soft" sx={{ p: 3, textAlign: 'center' }}>
              <Typography level="body-md" color="neutral">No automations yet. Create your first rule above.</Typography>
            </Sheet>
          </Grid>
        ) : (
          automations.map(rule => (
            <Grid key={rule.id} xs={12} md={6}>
              <Card variant="outlined">
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography level="title-md" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BoltRounded sx={{ fontSize: 18 }} /> {rule.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Switch checked={!!rule.enabled} onChange={() => toggleAutomation(rule.id)} />
                      <IconButton variant="plain" color="danger" onClick={() => removeAutomation(rule.id)}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Typography level="body-sm" color="neutral">Trigger: {rule.trigger}</Typography>
                  <Typography level="body-sm" color="neutral">Action: {rule.actions?.[0]?.type}</Typography>
                </Stack>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </PageContainer>
  );
}
