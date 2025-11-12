/**
 * localStorage persistence layer for subzero app
 * 
 * Manages user preferences, widget configuration, data imports, and webhooks
 * with fallback handling for localStorage access issues.
 */

const STORAGE_KEYS = {
  USER_PREFERENCES: 'subzero_user_preferences',
  WIDGET_CONFIG: 'subzero_widget_config', 
  IMPORTED_DATA: 'subzero_imported_data',
  WEBHOOKS: 'subzero_webhooks',
  ANALYTICS_SETTINGS: 'subzero_analytics_settings'
};

/**
 * Safe localStorage wrapper with error handling
 */
class Storage {
  static isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }

  static get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  }

  static set(key, value) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  }

  static remove(key) {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }

  static clear() {
    if (!this.isAvailable()) return;
    
    try {
      // Only clear our app's keys, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }
}

/**
 * User preferences management
 */
export const UserPreferences = {
  getAll() {
    return Storage.get(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      dashboardLayout: 'default',
      dateFormat: 'MM/dd/yyyy',
      currency: 'USD',
      timezone: 'UTC',
      notifications: {
        renewals: true,
        healthChanges: true,
        churnRisk: true
      }
    });
  },

  get(key) {
    const prefs = this.getAll();
    return prefs[key];
  },

  set(key, value) {
    const prefs = this.getAll();
    prefs[key] = value;
    return Storage.set(STORAGE_KEYS.USER_PREFERENCES, prefs);
  },

  setAll(preferences) {
    return Storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
};

/**
 * Analytics widget configuration management
 */
export const WidgetConfig = {
  getAll() {
    return Storage.get(STORAGE_KEYS.WIDGET_CONFIG, {
      dashboard: {
        enabled: ['stats', 'renewals', 'quickActions'],
        layout: 'grid',
        order: ['stats', 'renewals', 'quickActions']
      },
      analytics: {
        enabled: [],
        layout: 'masonry',
        order: []
      }
    });
  },

  getDashboard() {
    return this.getAll().dashboard;
  },

  getAnalytics() {
    return this.getAll().analytics;
  },

  setDashboard(config) {
    const current = this.getAll();
    current.dashboard = { ...current.dashboard, ...config };
    return Storage.set(STORAGE_KEYS.WIDGET_CONFIG, current);
  },

  setAnalytics(config) {
    const current = this.getAll();
    current.analytics = { ...current.analytics, ...config };
    return Storage.set(STORAGE_KEYS.WIDGET_CONFIG, current);
  },

  enableWidget(page, widgetId) {
    const config = this.getAll();
    if (!config[page].enabled.includes(widgetId)) {
      config[page].enabled.push(widgetId);
      config[page].order.push(widgetId);
      return Storage.set(STORAGE_KEYS.WIDGET_CONFIG, config);
    }
    return true;
  },

  disableWidget(page, widgetId) {
    const config = this.getAll();
    config[page].enabled = config[page].enabled.filter(id => id !== widgetId);
    config[page].order = config[page].order.filter(id => id !== widgetId);
    return Storage.set(STORAGE_KEYS.WIDGET_CONFIG, config);
  },

  reorderWidgets(page, newOrder) {
    const config = this.getAll();
    config[page].order = newOrder;
    return Storage.set(STORAGE_KEYS.WIDGET_CONFIG, config);
  }
};

/**
 * Imported data management 
 */
export const ImportedData = {
  getClients() {
    return Storage.get(STORAGE_KEYS.IMPORTED_DATA, []);
  },

  setClients(clients) {
    return Storage.set(STORAGE_KEYS.IMPORTED_DATA, clients);
  },

  addClient(client) {
    const clients = this.getClients();
    clients.push({
      ...client,
      id: this.generateId(),
      importedAt: new Date().toISOString()
    });
    return Storage.set(STORAGE_KEYS.IMPORTED_DATA, clients);
  },

  updateClient(clientId, updates) {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() };
      return Storage.set(STORAGE_KEYS.IMPORTED_DATA, clients);
    }
    return false;
  },

  removeClient(clientId) {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== clientId);
    return Storage.set(STORAGE_KEYS.IMPORTED_DATA, filtered);
  },

  clear() {
    return Storage.set(STORAGE_KEYS.IMPORTED_DATA, []);
  },

  generateId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

/**
 * Webhook configuration management
 */
export const Webhooks = {
  getAll() {
    return Storage.get(STORAGE_KEYS.WEBHOOKS, []);
  },

  add(webhook) {
    const webhooks = this.getAll();
    const newWebhook = {
      ...webhook,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      enabled: true,
      lastTriggered: null
    };
    webhooks.push(newWebhook);
    return Storage.set(STORAGE_KEYS.WEBHOOKS, webhooks);
  },

  update(webhookId, updates) {
    const webhooks = this.getAll();
    const index = webhooks.findIndex(w => w.id === webhookId);
    if (index !== -1) {
      webhooks[index] = { ...webhooks[index], ...updates };
      return Storage.set(STORAGE_KEYS.WEBHOOKS, webhooks);
    }
    return false;
  },

  remove(webhookId) {
    const webhooks = this.getAll();
    const filtered = webhooks.filter(w => w.id !== webhookId);
    return Storage.set(STORAGE_KEYS.WEBHOOKS, filtered);
  },

  toggle(webhookId) {
    const webhooks = this.getAll();
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook) {
      webhook.enabled = !webhook.enabled;
      return Storage.set(STORAGE_KEYS.WEBHOOKS, webhooks);
    }
    return false;
  },

  generateId() {
    return 'webhook_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

/**
 * Analytics settings management
 */
export const AnalyticsSettings = {
  getAll() {
    return Storage.get(STORAGE_KEYS.ANALYTICS_SETTINGS, {
      dateRange: 'last30days',
      metrics: ['mrr', 'health', 'churn', 'renewals'],
      groupBy: 'none',
      showTrends: true,
      autoRefresh: false,
      refreshInterval: 300000 // 5 minutes
    });
  },

  get(key) {
    const settings = this.getAll();
    return settings[key];
  },

  set(key, value) {
    const settings = this.getAll();
    settings[key] = value;
    return Storage.set(STORAGE_KEYS.ANALYTICS_SETTINGS, settings);
  },

  setAll(settings) {
    return Storage.set(STORAGE_KEYS.ANALYTICS_SETTINGS, settings);
  }
};

/**
 * Export all storage utilities
 */
export default {
  UserPreferences,
  WidgetConfig,
  ImportedData,
  Webhooks,
  AnalyticsSettings,
  Storage
};