/**
 * Client Data Field Mapping for Import
 * 
 * Contains mapping for the essential client data fields:
 * - company.name (Company name)
 * - contact.name (Contact person name)
 * - contact.email (Contact email)
 * - contract.startDate (Contract start date)
 * - contract.endDate (Contract end date) 
 * - renewal.date (Next renewal date)
 * - mrr (Monthly Recurring Revenue)
 * - ltv (Lifetime Value)
 * - subscribedMonths (Number of months subscribed)
 */

// Essential fields for client import
export const CANONICAL_FIELDS = [
  { 
    key: 'client.id',
    label: 'Client ID',
    description: 'Unique identifier for the client',
    required: false,
    type: 'text'
  },
  { 
    key: 'company.name',
    label: 'Company Name',
    description: 'Name of the client company',
    required: true,
    type: 'text'
  },
  { 
    key: 'contact.name',
    label: 'Contact Name', 
    description: 'Primary contact person name',
    required: true,
    type: 'text'
  },
  { 
    key: 'contact.email',
    label: 'Contact Email',
    description: 'Primary contact email address',
    required: true,
    type: 'email'
  },
  { 
    key: 'contract.startDate',
    label: 'Contract Start Date',
    description: 'When the contract began',
    required: true,
    type: 'date'
  },
  { 
    key: 'contract.endDate',
    label: 'Contract End Date',
    description: 'When the contract expires',
    required: true,
    type: 'date'
  },
  { 
    key: 'renewal.date',
    label: 'Renewal Date',
    description: 'Next renewal or review date',
    required: true,
    type: 'date'
  },
  { 
    key: 'mrr',
    label: 'Monthly Recurring Revenue',
    description: 'Monthly revenue from this client',
    required: true,
    type: 'currency'
  },
  { 
    key: 'ltv',
    label: 'Lifetime Value',
    description: 'Total customer lifetime value',
    required: false,
    type: 'currency'
  },
  { 
    key: 'subscribedMonths',
    label: 'Subscribed Months',
    description: 'Number of months the client has been subscribed',
    required: false,
    type: 'number'
  }
];

// Legacy → Canonical mapping suggestions for import wizard
export const LEGACY_MAPPING_TABLE = {
  // Client identification
  'client_id': 'client.id',
  'id': 'client.id',
  'account_id': 'client.id',
  'customer_id': 'client.id',
  'external_id': 'client.id',
  
  // Company identification
  'client_name': 'company.name',
  'company_name': 'company.name', 
  'account_name': 'company.name',
  'organization': 'company.name',
  'company': 'company.name',
  'client': 'company.name',
  
  // Contact information
  'contact_name': 'contact.name',
  'contact': 'contact.name',
  'name': 'contact.name',
  'primary_contact': 'contact.name',
  'rep': 'contact.name',
  
  'contact_email': 'contact.email',
  'email': 'contact.email',
  'primary_email': 'contact.email',
  'contact_mail': 'contact.email',
  
  // Contract dates
  'contract_start_date': 'contract.startDate',
  'start_date': 'contract.startDate',
  'contract_start': 'contract.startDate',
  'subscription_start': 'contract.startDate',
  
  'contract_end_date': 'contract.endDate',
  'end_date': 'contract.endDate',
  'contract_end': 'contract.endDate',
  'expiry_date': 'contract.endDate',
  'subscription_end': 'contract.endDate',
  
  // Renewal
  'renewal_date': 'renewal.date',
  'next_renewal': 'renewal.date',
  'renewal': 'renewal.date',
  'review_date': 'renewal.date',
  
  // Revenue
  'mrr': 'mrr',
  'monthly_recurring_revenue': 'mrr',
  'monthly_revenue': 'mrr',
  'revenue': 'mrr',
  'monthly_value': 'mrr',
  
  // Lifetime value
  'ltv': 'ltv',
  'lifetime_value': 'ltv',
  'customer_lifetime_value': 'ltv',
  'total_value': 'ltv',
  'clv': 'ltv',
  
  // Subscription duration
  'subscribed_months': 'subscribedMonths',
  'tenure': 'subscribedMonths',
  'months_subscribed': 'subscribedMonths',
  'subscription_months': 'subscribedMonths',
  'months': 'subscribedMonths'
};

/**
 * Get mapping suggestions for a legacy field name
 * 
 * @param {string} legacyField - Legacy field name
 * @returns {string|null} - Canonical field name or null
 */
export function getSuggestedMapping(legacyField) {
  const normalized = legacyField.toLowerCase().trim();
  return LEGACY_MAPPING_TABLE[normalized] || null;
}

/**
 * Check if required fields are present in a dataset
 * 
 * @param {Array<string>} requiredFields - Array of canonical field names
 * @param {Array<Object>} dataset - Array of data objects
 * @returns {Object} - {hasAll: boolean, missing: string[], available: string[]}
 */
export function checkFieldPresence(requiredFields, dataset = []) {
  if (!dataset.length) {
    return {
      hasAll: false,
      missing: requiredFields,
      available: []
    };
  }
  
  const sampleRecord = dataset[0];
  const available = [];
  const missing = [];
  
  requiredFields.forEach(field => {
    if (hasNestedField(sampleRecord, field)) {
      available.push(field);
    } else {
      missing.push(field);
    }
  });
  
  return {
    hasAll: missing.length === 0,
    missing,
    available
  };
}

/**
 * Check if a nested field exists in an object
 * 
 * @param {Object} obj - Object to check
 * @param {string} fieldPath - Dot-notation field path (e.g., 'health.score')
 * @returns {boolean} - Whether field exists and has a value
 */
function hasNestedField(obj, fieldPath) {
  if (!obj || typeof obj !== 'object') return false;
  
  const keys = fieldPath.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current[key] === undefined || current[key] === null) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * Convert imported data to canonical format
 * 
 * @param {Array<Object>} data - Raw imported data
 * @param {Object} mappings - Field mappings {legacyField: canonicalField}
 * @returns {Array<Object>} - Data in canonical format
 */
export function transformToCanonical(data, mappings) {
  return data.map(record => {
    const canonical = {};
    
    Object.entries(mappings).forEach(([sourceField, targetField]) => {
      const value = record[sourceField];
      if (value !== undefined && value !== null && value !== '') {
        setNestedField(canonical, targetField, value);
      }
    });
    
    return canonical;
  });
}

/**
 * Set a nested field value in an object
 * 
 * @param {Object} obj - Object to modify
 * @param {string} fieldPath - Dot-notation field path
 * @param {any} value - Value to set
 */
function setNestedField(obj, fieldPath, value) {
  const keys = fieldPath.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}