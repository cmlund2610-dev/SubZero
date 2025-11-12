# Firestore Data Structure

This document describes the Firestore database structure for subzero.

## Collections Overview

```
/companies
  /{companyId}
    - name: string
    - industry: string
    - size: string
    - adminUsers: array<userId>
    - createdAt: timestamp
    - updatedAt: timestamp
    
    /clients
      /{clientId}
        - id: string
        - company: { name: string }
        - contact: { name: string, email: string }
        - mrr: number
        - ltv: number
        - renewal: { date: string }
        - renewalTracking: {
            stage: string,
            probability: number
          }
        - createdAt: timestamp
        - updatedAt: timestamp
        
        /notes
          /{noteId}
            - id: string
            - text: string
            - createdBy: string (userId)
            - createdByName: string
            - createdAt: timestamp
            - updatedAt: timestamp
        
        /tasks
          /{taskId}
            - id: string
            - title: string
            - dueDate: string (YYYY-MM-DD)
            - priority: 'low' | 'normal' | 'high' | 'critical'
            - completed: boolean
            - createdBy: string (userId)
            - createdByName: string
            - createdAt: timestamp
            - updatedAt: timestamp

/users
  /{userId}
    - uid: string
    - email: string
    - fullName: string
    - jobTitle: string
    - department: string
    - companyId: string
    - role: 'admin' | 'standard'
    - createdAt: timestamp
    - updatedAt: timestamp
```

## Data Access Patterns

### Notes
- **Create**: `addClientNote(companyId, clientId, noteData)`
- **Read**: `getClientNotes(companyId, clientId)`
- **Delete**: `deleteClientNote(companyId, clientId, noteId)`

### Tasks
- **Create**: `addClientTask(companyId, clientId, taskData)`
- **Read**: `getClientTasks(companyId, clientId)`
- **Update**: `updateClientTask(companyId, clientId, taskId, updates)`
- **Delete**: `deleteClientTask(companyId, clientId, taskId)`

### Renewal Tracking
- **Update**: `updateClientRenewal(companyId, clientId, renewalData)`
- **Read All**: `getCompanyRenewalsData(companyId)`

### Clients
- **Upsert**: `upsertClient(companyId, clientId, clientData)`
- **Read One**: `getClient(companyId, clientId)`
- **Read All**: `getCompanyClients(companyId)`

## Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isCompanyMember(companyId) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyId == companyId;
    }
    
    function isCompanyAdmin(companyId) {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/companies/$(companyId)).data.adminUsers.hasAny([request.auth.uid]);
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (
        request.auth.uid == userId ||
        isCompanyMember(resource.data.companyId)
      );
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Companies collection
    match /companies/{companyId} {
      allow read: if isCompanyMember(companyId);
      allow write: if isCompanyAdmin(companyId);
      
      // Clients subcollection
      match /clients/{clientId} {
        allow read: if isCompanyMember(companyId);
        allow write: if isCompanyMember(companyId);
        
        // Notes subcollection
        match /notes/{noteId} {
          allow read: if isCompanyMember(companyId);
          allow create: if isCompanyMember(companyId);
          allow delete: if isCompanyMember(companyId) && 
                          resource.data.createdBy == request.auth.uid;
        }
        
        // Tasks subcollection
        match /tasks/{taskId} {
          allow read: if isCompanyMember(companyId);
          allow write: if isCompanyMember(companyId);
        }
      }
    }
  }
}
```

## Migration Notes

### From localStorage to Firestore

The following data was migrated from localStorage to Firestore:

1. **Client Notes** 
   - Old key: `subzero_client_notes_{clientId}`
   - New path: `companies/{companyId}/clients/{clientId}/notes`

2. **Client Tasks**
   - Old key: `subzero_client_tasks_{clientId}`
   - New path: `companies/{companyId}/clients/{clientId}/tasks`

3. **Renewal Tracking**
   - Old key: `subzero_renewals_data`
   - New path: `companies/{companyId}/clients/{clientId}` (renewalTracking field)

### Benefits of Firestore Migration

- ✅ Real-time synchronization across devices
- ✅ Team collaboration (shared data)
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Security rules for data protection
- ✅ Offline support with automatic sync

### Backward Compatibility

The application includes fallback to localStorage if Firestore operations fail, ensuring graceful degradation during network issues or permission problems.
