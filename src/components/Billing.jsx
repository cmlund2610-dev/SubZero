/**
 * Billing Component
 * 
 * Comprehensive billing management for company accounts:
 * - Subscription overview and management
 * - Payment methods (credit cards)
 * - Billing history and invoices
 * - Usage tracking
 * - Admin-only access
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  Sheet,
  Chip,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator
} from '@mui/joy';
import {
  CreditCard,
  Download,
  Add as Plus,
  Check,
  Warning as AlertCircle,
  CalendarToday as Calendar,
  AttachMoney as DollarSign,
  People as Users,
  Description as FileText,
  TrendingUp,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const Billing = () => {
  const { userCompany, isAdmin } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Form states
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  // Mock billing data (in real app, this would come from Stripe/payment processor)
  const [billingData] = useState({
    subscription: {
      plan: 'Professional',
      status: 'active',
      price: 29,
      billingCycle: 'monthly',
      nextBilling: '2024-02-15',
      users: 5,
      maxUsers: 25,
      features: [
        'Unlimited client records',
        'Advanced analytics',
        'Contract renewal tracking',
        'Team collaboration',
        'Priority support'
      ]
    },
    paymentMethods: [
      {
        id: '1',
        type: 'credit_card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ],
    invoices: [
      {
        id: 'inv_001',
        date: '2024-01-15',
        amount: 29.00,
        status: 'paid',
        description: 'Professional Plan - January 2024'
      },
      {
        id: 'inv_002',
        date: '2023-12-15',
        amount: 29.00,
        status: 'paid',
        description: 'Professional Plan - December 2023'
      },
      {
        id: 'inv_003',
        date: '2023-11-15',
        amount: 29.00,
        status: 'paid',
        description: 'Professional Plan - November 2023'
      }
    ],
    usage: {
      currentPeriodStart: '2024-01-15',
      currentPeriodEnd: '2024-02-15',
      clientsCreated: 156,
      contractsTracked: 89,
      apiCalls: 2840,
      storageUsed: 2.3 // GB
    }
  });

  useEffect(() => {
    // In a real app, load billing data from API
  }, []);

  // Plan options
  const plans = [
    {
      name: 'Starter',
      price: 9,
      users: 3,
      features: [
        'Up to 100 clients',
        'Basic analytics',
        'Email support',
        '1GB storage'
      ]
    },
    {
      name: 'Professional',
      price: 29,
      users: 25,
      features: [
        'Unlimited clients',
        'Advanced analytics',
        'Contract tracking',
        'Team collaboration',
        'Priority support',
        '10GB storage'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      users: 100,
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
        'Unlimited storage',
        'Custom reporting'
      ]
    }
  ];

  const handleAddCard = () => {
    // In a real app, integrate with Stripe to add payment method
    setSuccess('Payment method added successfully');
    setShowAddCardModal(false);
    setCardForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert color="warning">
          <Typography>Only company administrators can access billing information.</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h2" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <CreditCard sx={{ fontSize: '2rem' }} />
          Billing
        </Typography>
        <Typography level="body-lg" color="neutral">
          Manage {userCompany?.name} billing and subscription
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Subscription */}
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography level="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Settings size={20} />
                Current Subscription
              </Typography>

              <Box sx={{ 
                p: 3, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                border: '1px solid rgba(67, 56, 202, 0.2)'
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography level="h3" sx={{ color: '#4338CA' }}>
                      {billingData.subscription.plan} Plan
                    </Typography>
                    <Typography level="body-lg">
                      {formatCurrency(billingData.subscription.price)}/{billingData.subscription.billingCycle}
                    </Typography>
                  </Box>
                  <Chip 
                    color="success" 
                    variant="solid"
                    startDecorator={<Check size={16} />}
                  >
                    Active
                  </Chip>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">Team Size</Typography>
                    <Typography level="body-lg" sx={{ fontWeight: 600 }}>
                      {billingData.subscription.users} / {billingData.subscription.maxUsers} users
                    </Typography>
                    <LinearProgress 
                      determinate 
                      value={(billingData.subscription.users / billingData.subscription.maxUsers) * 100}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Typography level="body-sm" color="neutral">Next Billing</Typography>
                    <Typography level="body-lg" sx={{ fontWeight: 600 }}>
                      {new Date(billingData.subscription.nextBilling).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Change Plan
                  </Button>
                  <Button variant="soft" color="neutral">
                    Cancel Subscription
                  </Button>
                </Stack>
              </Box>

              {/* Features List */}
              <Box sx={{ mt: 3 }}>
                <Typography level="title-md" sx={{ mb: 2 }}>
                  Plan Features
                </Typography>
                <List size="sm">
                  {billingData.subscription.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemDecorator>
                        <Check size={16} color="green" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="body-sm">{feature}</Typography>
                      </ListItemContent>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid xs={12} md={4}>
          <Stack spacing={2}>
            {/* Usage Stats */}
            <Card>
              <CardContent>
                <Typography level="title-md" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp size={16} />
                  Current Usage
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography level="body-sm">Clients</Typography>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {billingData.usage.clientsCreated}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography level="body-sm">Contracts</Typography>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {billingData.usage.contractsTracked}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography level="body-sm">Storage</Typography>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {billingData.usage.storageUsed} GB
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography level="title-md" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard size={16} />
                    Payment Methods
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => setShowAddCardModal(true)}
                  >
                    <Plus size={16} />
                  </IconButton>
                </Stack>
                
                {billingData.paymentMethods.map((method) => (
                  <Box 
                    key={method.id}
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: '8px'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                          **** {method.last4}
                        </Typography>
                        <Typography level="body-xs" color="neutral">
                          {method.expiryMonth}/{method.expiryYear}
                        </Typography>
                      </Box>
                      {method.isDefault && (
                        <Chip size="sm" variant="soft" color="primary">
                          Default
                        </Chip>
                      )}
                    </Stack>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Billing History */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography level="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FileText size={20} />
                Billing History
              </Typography>

              <Sheet sx={{ overflow: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingData.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                            {invoice.id.toUpperCase()}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {new Date(invoice.date).toLocaleDateString()}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {invoice.description}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                            {formatCurrency(invoice.amount)}
                          </Typography>
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            variant="soft"
                            color={invoice.status === 'paid' ? 'success' : 'warning'}
                            startDecorator={invoice.status === 'paid' ? <Check size={14} /> : <AlertCircle size={14} />}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Chip>
                        </td>
                        <td>
                          <IconButton size="sm" variant="outlined">
                            <Download size={16} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Payment Method Modal */}
      <Modal open={showAddCardModal} onClose={() => setShowAddCardModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h3" sx={{ mb: 2 }}>
            Add Payment Method
          </Typography>
          
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Name on Card</FormLabel>
              <Input
                placeholder="John Doe"
                value={cardForm.nameOnCard}
                onChange={(e) => setCardForm(prev => ({ ...prev, nameOnCard: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </FormControl>

            <Grid container spacing={2}>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    placeholder="MM/YY"
                    value={cardForm.expiryDate}
                    onChange={(e) => setCardForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowAddCardModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="primary"
                onClick={handleAddCard}
              >
                Add Card
              </Button>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* Upgrade Plan Modal */}
      <Modal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)}>
        <ModalDialog size="lg" sx={{ maxWidth: '1000px', width: '90vw' }}>
          <ModalClose />
          <Typography level="h3" sx={{ mb: 3, textAlign: 'center' }}>
            Choose Your Plan
          </Typography>
          
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid xs={12} md={4} key={plan.name}>
                <Card 
                  variant={plan.name === billingData.subscription.plan ? 'soft' : 'outlined'}
                  sx={{ 
                    position: 'relative',
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg'
                    },
                    ...(plan.popular && {
                      borderColor: 'primary.400',
                      borderWidth: 2,
                      '&::before': {
                        content: '"Most Popular"',
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'primary.500',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 1
                      }
                    })
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    <Typography level="h4" sx={{ mb: 1, fontWeight: 600 }}>
                      {plan.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography level="h2" sx={{ color: 'primary.500', lineHeight: 1 }}>
                        {formatCurrency(plan.price)}
                      </Typography>
                      <Typography level="body-sm" color="neutral">
                        /month
                      </Typography>
                    </Box>
                    
                    <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
                      Up to {plan.users} users
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1, mb: 3 }}>
                      <List size="sm" sx={{ '--List-gap': '8px' }}>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemDecorator sx={{ minInlineSize: 'auto' }}>
                              <Check size={14} color="green" />
                            </ListItemDecorator>
                            <ListItemContent>
                              <Typography level="body-sm" sx={{ textAlign: 'left' }}>
                                {feature}
                              </Typography>
                            </ListItemContent>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Button
                      variant={plan.name === billingData.subscription.plan ? 'soft' : 'solid'}
                      color="primary"
                      fullWidth
                      size="lg"
                      disabled={plan.name === billingData.subscription.plan}
                      sx={{ 
                        mt: 'auto',
                        fontWeight: 600
                      }}
                    >
                      {plan.name === billingData.subscription.plan ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            <Typography level="body-sm" color="neutral" sx={{ textAlign: 'center' }}>
              All plans include 24/7 support • Cancel anytime • 14-day free trial
            </Typography>
          </Box>
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

export default Billing;