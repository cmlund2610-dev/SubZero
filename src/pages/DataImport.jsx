/**
 * Data Import Wizard - Multi-step client data import
 * 
 * Provides guided CSV/JSON import with field mapping, validation,
 * and preview before final import to localStorage.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Card, 
  Stepper, 
  Step, 
  StepIndicator,
  StepButton,
  Input,
  Textarea,
  Select,
  Option,
  Table,
  Alert,
  LinearProgress,
  Chip
} from '@mui/joy';
import {
  CloudUpload,
  CloudUploadRounded as DataImportIcon,
  TableChart,
  CheckCircle,
  Warning,
  Download,
  GetApp,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { LEGACY_MAPPING_TABLE, getSuggestedMapping, checkFieldPresence, CANONICAL_FIELDS, transformToCanonical } from '../lib/mappers.js';
import PageHeader from '../components/PageHeader.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { upsertClient } from '../lib/clientData.js'; // Corrected import for upsertClient

const IMPORT_STEPS = [
  { label: 'Upload Data', description: 'Choose CSV or JSON file' },
  { label: 'Map Fields', description: 'Match your fields to our format' },
  { label: 'Validate', description: 'Review and fix any issues' },
  { label: 'Import', description: 'Complete the import process' }
];

export default function DataImport() {
  const navigate = useNavigate();
  const { userCompany } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedData, setUploadedData] = useState([]);
  const [originalHeaders, setOriginalHeaders] = useState([]);
  const [fieldMappings, setFieldMappings] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importError, setImportError] = useState(null);

  const fileInputRef = useRef(null);

  // Step 1: File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        let headers;

        if (file.name.endsWith('.json')) {
          data = JSON.parse(e.target.result);
          if (!Array.isArray(data)) {
            throw new Error('JSON must be an array of objects');
          }
          headers = data.length > 0 ? Object.keys(data[0]) : [];
        } else if (file.name.endsWith('.csv')) {
          const lines = e.target.result.split('\n').filter(line => line.trim());
          headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
          
          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          });
        } else {
          throw new Error('Please upload a CSV or JSON file');
        }

        setUploadedData(data);
        setOriginalHeaders(headers);
        
        // Generate initial field mappings with suggestions
        const initialMappings = {};
        headers.forEach(header => {
          const suggestion = getSuggestedMapping(header);
          if (suggestion) {
            initialMappings[header] = suggestion;
          }
        });
        setFieldMappings(initialMappings);
        
        setActiveStep(1);
      } catch (error) {
        alert('Error parsing file: ' + error.message);
      }
    };

    reader.readAsText(file);
  };

  // Step 2: Field Mapping
  const handleMappingChange = (originalField, canonicalField) => {
    setFieldMappings(prev => ({
      ...prev,
      [originalField]: canonicalField
    }));
  };

  const validateMappings = () => {
    const mappedFields = Object.values(fieldMappings).filter(Boolean);
    const fieldCheck = checkFieldPresence(mappedFields, uploadedData);
    
    // Check for required fields
    const requiredFields = CANONICAL_FIELDS.filter(field => field.required).map(field => field.key);
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
    
    const results = {
      ...fieldCheck,
      missingRequired,
      hasRequiredFields: missingRequired.length === 0,
      unmappedFields: originalHeaders.filter(h => !fieldMappings[h]),
      duplicateMappings: findDuplicateMappings()
    };
    
    setValidationResults(results);
    setActiveStep(2);
  };

  const findDuplicateMappings = () => {
    const mappings = Object.values(fieldMappings).filter(Boolean);
    return mappings.filter((item, index) => mappings.indexOf(item) !== index);
  };

  // Step 3: Validation & Preview
  const transformData = () => {
    const transformedData = transformToCanonical(uploadedData, fieldMappings);
    
    return transformedData.map((row, index) => {
      // Use the client's actual ID from the data (client.id field)
      // Fall back to generated ID only if client.id is missing
      const clientId = row.client?.id || row.id || `imported_${Date.now()}_${index}`;
      
      return {
        ...row,
        id: clientId,
        importedAt: new Date().toISOString()
      };
    });
  };

  // Step 4: Import
  const executeImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportError(null);
    
    try {
      const transformedData = transformData();
      
      if (!userCompany?.id) {
        throw new Error('No company ID found. Please sign in again.');
      }
      
      // Save to Firestore
      const totalClients = transformedData.length;
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < transformedData.length; i++) {
        const client = transformedData[i];
        
        try {
          // Save to Firestore
          await upsertClient(userCompany.id, client.id, client);
          successCount++;
        } catch (error) {
          console.error(`Failed to import client ${client.id}:`, error);
          failCount++;
        }
        
        // Update progress
        setImportProgress(Math.round(((i + 1) / totalClients) * 100));
        
        // Small delay to prevent overwhelming Firestore
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      if (failCount > 0) {
        setImportError(`Import completed with ${failCount} failures out of ${totalClients} clients.`);
      }
      
      setImportComplete(true);
      setActiveStep(3);
      
      console.log(`✅ Import complete: ${successCount} succeeded, ${failCount} failed`);
      
    } catch (error) {
      console.error('Import failed:', error);
      setImportError('Import failed: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setActiveStep(0);
    setUploadedData([]);
    setOriginalHeaders([]);
    setFieldMappings({});
    setValidationResults(null);
    setImportProgress(0);
    setIsImporting(false);
    setImportComplete(false);
    setImportError(null);
  };

  const downloadTemplate = () => {
    // Create template CSV content with all canonical fields
    const headers = CANONICAL_FIELDS.map(field => {
      // Convert dot notation to underscore for CSV headers
      return field.key.replace('.', '_');
    });
    
    // Add sample data row
    const sampleData = [
      'CLIENT_001', // client.id
      'Example Company Inc', // company.name  
      'John Doe', // contact.name
      'john@example.com', // contact.email
      '2023-01-01', // contract.startDate
      '2024-01-01', // contract.endDate
      '2024-01-01', // renewal.date
      '5000', // mrr
      '60000', // ltv
      '12' // subscribedMonths
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'client_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            <CloudUpload sx={{ fontSize: '4rem', color: 'primary.500' }} />
            <Box textAlign="center">
              <Typography level="h4" sx={{ mb: 1 }}>
                Upload Your Client Data
              </Typography>
              <Typography level="body-md" color="neutral" sx={{ mb: 3 }}>
                Support for CSV and JSON files. Your data stays secure in your browser.
              </Typography>
            </Box>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            <Button
              size="lg"
              startDecorator={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography level="body-sm" color="neutral">
                Need a template?
              </Typography>
              <Button
                variant="outlined"
                size="sm"
                startDecorator={<GetApp />}
                onClick={downloadTemplate}
              >
                Download CSV Template
              </Button>
            </Stack>

            <Alert variant="soft" color="primary" sx={{ maxWidth: 600 }}>
              <Typography level="body-sm">
                <strong>Supported fields:</strong> client_id, company_name, contact_name, contact_email, 
                contract_start_date, contract_end_date, renewal_date, mrr, ltv, subscribed_months
              </Typography>
            </Alert>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Box>
              <Typography level="h4" sx={{ mb: 1 }}>
                Map Your Fields
              </Typography>
              <Typography level="body-md" color="neutral">
                Match your data fields to our standard format. We've suggested mappings based on field names.
              </Typography>
            </Box>

            <Card variant="outlined">
              <Table>
                <thead>
                  <tr>
                    <th>Your Field</th>
                    <th>Sample Data</th>
                    <th>Maps To</th>
                  </tr>
                </thead>
                <tbody>
                  {originalHeaders.map(header => (
                    <tr key={header}>
                      <td>
                        <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                          {header}
                        </Typography>
                      </td>
                      <td>
                        <Typography level="body-sm" color="neutral">
                          {uploadedData[0]?.[header] || 'N/A'}
                        </Typography>
                      </td>
                      <td>
                        <Select
                          placeholder="Select field..."
                          value={fieldMappings[header] || null}
                          onChange={(_, value) => handleMappingChange(header, value)}
                          size="sm"
                          sx={{ minWidth: 200 }}
                        >
                          <Option value="">Don't import</Option>
                          {CANONICAL_FIELDS.map(field => (
                            <Option key={field.key} value={field.key}>
                              {field.label}
                            </Option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setActiveStep(0)}>
                Back
              </Button>
              <Button onClick={validateMappings}>
                Continue to Validation
              </Button>
            </Stack>
          </Stack>
        );

      case 2:
        // Fixed lexical declaration issue in case block by moving the declaration outside the block.
        const transformedData = transformData();
        return (
          <Stack spacing={3}>
            <Box>
              <Typography level="h4" sx={{ mb: 1 }}>
                Validation & Preview
              </Typography>
              <Typography level="body-md" color="neutral">
                Review your data before importing. Check for any issues or missing fields.
              </Typography>
            </Box>

            {/* Validation Results */}
            <Stack spacing={2}>
              {validationResults?.missingRequired.length > 0 && (
                <Alert variant="soft" color="danger">
                  <Typography level="body-sm">
                    <strong>Missing required fields:</strong> {validationResults.missingRequired.join(', ')}
                  </Typography>
                </Alert>
              )}

              {validationResults?.duplicateMappings.length > 0 && (
                <Alert variant="soft" color="warning">
                  <Typography level="body-sm">
                    <strong>Duplicate mappings:</strong> {validationResults.duplicateMappings.join(', ')}
                  </Typography>
                </Alert>
              )}

              <Alert variant="soft" color="success">
                <Typography level="body-sm">
                  Ready to import {uploadedData.length} clients with {Object.keys(fieldMappings).length} mapped fields.
                </Typography>
              </Alert>
            </Stack>

            {/* Preview */}
            <Card variant="outlined">
              <Typography level="title-sm" sx={{ mb: 2 }}>
                Preview (First 3 Records)
              </Typography>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>MRR</th>
                    <th>Health Score</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {transformedData.slice(0, 3).map((client, index) => (
                    <tr key={index}>
                      <td>{client.companyName || 'N/A'}</td>
                      <td>{client.mrr ? `$${client.mrr}` : 'N/A'}</td>
                      <td>{client.health?.score || 'N/A'}</td>
                      <td>{client.churn?.risk || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setActiveStep(1)}>
                Back to Mapping
              </Button>
              <Button 
                onClick={executeImport}
                disabled={validationResults?.missingRequired.length > 0}
              >
                Import Data
              </Button>
            </Stack>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            {isImporting ? (
              <>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <LinearProgress determinate value={importProgress} />
                  <Typography level="body-sm" textAlign="center" sx={{ mt: 1 }}>
                    Importing to Firestore... {importProgress}%
                  </Typography>
                  <Typography level="body-xs" textAlign="center" color="neutral" sx={{ mt: 0.5 }}>
                    Saving {uploadedData.length} clients to cloud database
                  </Typography>
                </Box>
              </>
            ) : importComplete ? (
              <>
                <CheckCircle sx={{ fontSize: '4rem', color: 'success.500' }} />
                <Box textAlign="center">
                  <Typography level="h4" sx={{ mb: 1 }}>
                    Import Complete!
                  </Typography>
                  <Typography level="body-md" color="neutral" sx={{ mb: 3 }}>
                    Successfully imported {uploadedData.length} clients to Firestore. You can now view them in the Clients page.
                  </Typography>
                  {importError && (
                    <Alert color="warning" sx={{ mb: 2 }}>
                      {importError}
                    </Alert>
                  )}
                </Box>
                
                <Stack direction="row" spacing={2}>
                  <Button onClick={() => navigate('/clients')}>
                    View Clients
                  </Button>
                  <Button variant="outlined" onClick={resetImport}>
                    Import More Data
                  </Button>
                </Stack>
              </>
            ) : null}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Data Import"
        description="Import your client data from CSV or JSON files with guided field mapping"
        icon={DataImportIcon}
      />

      {/* Stepper */}
      <Stepper sx={{ mb: 4 }}>
        {IMPORT_STEPS.map((step, index) => (
          <Step
            key={step.label}
            indicator={
              <StepIndicator 
                variant={activeStep === index ? 'solid' : activeStep > index ? 'solid' : 'outlined'}
                color={activeStep >= index ? 'primary' : 'neutral'}
              >
                {activeStep > index ? <CheckCircle /> : index + 1}
              </StepIndicator>
            }
          >
            <StepButton onClick={() => activeStep > index && setActiveStep(index)}>
              <Typography level="title-sm">{step.label}</Typography>
              <Typography level="body-xs">{step.description}</Typography>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Card variant="outlined" sx={{ minHeight: 400 }}>
        <Box sx={{ p: 3 }}>
          {renderStepContent()}
        </Box>
      </Card>
    </PageContainer>
  );
}