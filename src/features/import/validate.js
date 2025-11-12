/**
 * Client data validation utilities with JSDoc types and runtime checks
 * 
 * Provides validation functions for incoming client data before processing.
 * Useful for data imports, API responses, and form submissions.
 * 
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the data passed validation
 * @property {Array<string>} errors - Array of error messages
 * @property {Array<string>} warnings - Array of warning messages
 */

/**
 * Legacy client data structure (from external sources)
 * @typedef {Object} LegacyClientData
 * @property {string} id - Unique client identifier
 * @property {string} [company_name] - Company name (legacy key)
 * @property {string} [client_name] - Client name (alternative legacy key)
 * @property {number} [health_score] - Health score 0-100
 * @property {number} [mrr] - Monthly recurring revenue
 * @property {string} [renewal_date] - ISO date string
 * @property {string} [churn_risk] - Risk level: low|medium|high|critical
 * @property {number} [nps_score] - NPS score
 * @property {string} [nps_comment] - NPS feedback comment
 * @property {number} [usage_30d] - Usage percentage in last 30 days
 * @property {number} [contract_value] - Total contract value
 * @property {string} [subscription_status] - Subscription status
 * @property {string} [contact_email] - Primary contact email
 */

/**
 * Validates a single legacy client record
 * 
 * @param {LegacyClientData} client - Client data to validate
 * @returns {ValidationResult} Validation result
 */
export function validateLegacyClient(client) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!client || typeof client !== 'object') {
    errors.push('Client data must be an object');
    return { isValid: false, errors, warnings };
  }

  if (!client.id || typeof client.id !== 'string') {
    errors.push('Client ID is required and must be a string');
  }

  if (!client.company_name && !client.client_name) {
    errors.push('Either company_name or client_name is required');
  }

  // Numeric field validations
  if (client.health_score !== undefined) {
    if (typeof client.health_score !== 'number' || client.health_score < 0 || client.health_score > 100) {
      errors.push('health_score must be a number between 0 and 100');
    }
  }

  if (client.mrr !== undefined) {
    if (typeof client.mrr !== 'number' || client.mrr < 0) {
      errors.push('mrr must be a non-negative number');
    }
  }

  if (client.usage_30d !== undefined) {
    if (typeof client.usage_30d !== 'number' || client.usage_30d < 0 || client.usage_30d > 100) {
      errors.push('usage_30d must be a number between 0 and 100');
    }
  }

  if (client.nps_score !== undefined) {
    if (typeof client.nps_score !== 'number' || client.nps_score < 0 || client.nps_score > 10) {
      errors.push('nps_score must be a number between 0 and 10');
    }
  }

  if (client.contract_value !== undefined) {
    if (typeof client.contract_value !== 'number' || client.contract_value < 0) {
      errors.push('contract_value must be a non-negative number');
    }
  }

  // Date validations
  if (client.renewal_date !== undefined) {
    const date = new Date(client.renewal_date);
    if (isNaN(date.getTime())) {
      errors.push('renewal_date must be a valid ISO date string');
    }
  }

  if (client.contract_start_date !== undefined) {
    const date = new Date(client.contract_start_date);
    if (isNaN(date.getTime())) {
      errors.push('contract_start_date must be a valid ISO date string');
    }
  }

  if (client.contract_end_date !== undefined) {
    const date = new Date(client.contract_end_date);
    if (isNaN(date.getTime())) {
      errors.push('contract_end_date must be a valid ISO date string');
    }
  }

  // Enum validations
  if (client.churn_risk !== undefined) {
    const validRisks = ['low', 'medium', 'high', 'critical'];
    if (!validRisks.includes(client.churn_risk)) {
      errors.push(`churn_risk must be one of: ${validRisks.join(', ')}`);
    }
  }

  if (client.subscription_status !== undefined) {
    const validStatuses = ['active', 'trial', 'suspended', 'cancelled'];
    if (!validStatuses.includes(client.subscription_status)) {
      errors.push(`subscription_status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (client.call_momentum !== undefined) {
    const validMomentum = ['up', 'down', 'stable'];
    if (!validMomentum.includes(client.call_momentum)) {
      warnings.push(`call_momentum should be one of: ${validMomentum.join(', ')}`);
    }
  }

  if (client.login_momentum !== undefined) {
    const validMomentum = ['up', 'down', 'stable'];
    if (!validMomentum.includes(client.login_momentum)) {
      warnings.push(`login_momentum should be one of: ${validMomentum.join(', ')}`);
    }
  }

  // Email validation
  if (client.contact_email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(client.contact_email)) {
      warnings.push('contact_email should be a valid email address');
    }
  }

  // Data completeness warnings
  if (!client.mrr && !client.contract_value) {
    warnings.push('Neither MRR nor contract_value provided - revenue analytics may be limited');
  }

  if (!client.health_score) {
    warnings.push('No health_score provided - health monitoring will be unavailable');
  }

  if (!client.renewal_date) {
    warnings.push('No renewal_date provided - renewal tracking will be unavailable');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates an array of legacy client records
 * 
 * @param {Array<LegacyClientData>} clients - Array of client data to validate
 * @returns {ValidationResult & {validClients: Array, invalidClients: Array}} Extended validation result
 */
export function validateLegacyClientArray(clients) {
  if (!Array.isArray(clients)) {
    return {
      isValid: false,
      errors: ['Input must be an array of client objects'],
      warnings: [],
      validClients: [],
      invalidClients: []
    };
  }

  const validClients = [];
  const invalidClients = [];
  const allErrors = [];
  const allWarnings = [];

  clients.forEach((client, index) => {
    const result = validateLegacyClient(client);
    
    if (result.isValid) {
      validClients.push(client);
    } else {
      invalidClients.push({
        index,
        client,
        errors: result.errors
      });
      
      // Prefix errors with client index for clarity
      result.errors.forEach(error => {
        allErrors.push(`Client ${index + 1}: ${error}`);
      });
    }

    // Collect all warnings
    result.warnings.forEach(warning => {
      allWarnings.push(`Client ${index + 1}: ${warning}`);
    });
  });

  return {
    isValid: invalidClients.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    validClients,
    invalidClients,
    stats: {
      total: clients.length,
      valid: validClients.length,
      invalid: invalidClients.length
    }
  };
}

/**
 * Sanitizes legacy client data by removing invalid fields
 * 
 * @param {LegacyClientData} client - Client data to sanitize
 * @returns {LegacyClientData} Sanitized client data
 */
export function sanitizeLegacyClient(client) {
  const sanitized = { ...client };
  
  // Remove null/undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === null || sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });

  // Convert string numbers to actual numbers for numeric fields
  const numericFields = ['health_score', 'mrr', 'usage_30d', 'nps_score', 'contract_value', 'ltv'];
  numericFields.forEach(field => {
    if (typeof sanitized[field] === 'string' && !isNaN(sanitized[field])) {
      sanitized[field] = parseFloat(sanitized[field]);
    }
  });

  // Normalize string fields
  const stringFields = ['company_name', 'client_name', 'churn_risk', 'subscription_status'];
  stringFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
    }
  });

  // Normalize email
  if (typeof sanitized.contact_email === 'string') {
    sanitized.contact_email = sanitized.contact_email.trim().toLowerCase();
  }

  return sanitized;
}

/**
 * Type guard to check if an object is a valid legacy client
 * 
 * @param {any} obj - Object to check
 * @returns {obj is LegacyClientData} Type predicate
 */
export function isLegacyClient(obj) {
  const result = validateLegacyClient(obj);
  return result.isValid;
}

/**
 * Runtime type checking decorator for functions that expect client data
 * 
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function with validation
 */
export function withClientValidation(fn) {
  return function(client, ...args) {
    const validation = validateLegacyClient(client);
    if (!validation.isValid) {
      throw new Error(`Invalid client data: ${validation.errors.join(', ')}`);
    }
    return fn(client, ...args);
  };
}