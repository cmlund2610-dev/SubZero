/**
 * Client Data Service - Firestore operations for client-related data
 * 
 * Manages notes, tasks, and renewal tracking in Firestore
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase.js';

// ============================================
// NOTES OPERATIONS
// ============================================

/**
 * Add a note to a client
 */
export const addClientNote = async (companyId, clientId, noteData) => {
  try {
    const noteRef = doc(collection(db, `companies/${companyId}/clients/${clientId}/notes`));
    const note = {
      ...noteData,
      id: noteRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(noteRef, note);
    return { ...note, createdAt: Date.now(), updatedAt: Date.now() }; // Return with temp timestamps for immediate UI update
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

/**
 * Get all notes for a client
 */
export const getClientNotes = async (companyId, clientId) => {
  try {
    const notesRef = collection(db, `companies/${companyId}/clients/${clientId}/notes`);
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toMillis() || Date.now()
    }));
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

/**
 * Delete a note
 */
export const deleteClientNote = async (companyId, clientId, noteId) => {
  try {
    await deleteDoc(doc(db, `companies/${companyId}/clients/${clientId}/notes/${noteId}`));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// ============================================
// TASKS OPERATIONS
// ============================================

/**
 * Add a task to a client
 */
export const addClientTask = async (companyId, clientId, taskData) => {
  try {
    const taskRef = doc(collection(db, `companies/${companyId}/clients/${clientId}/tasks`));
    const task = {
      ...taskData,
      id: taskRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(taskRef, task);
    return { ...task, createdAt: Date.now(), updatedAt: Date.now() }; // Return with temp timestamps for immediate UI update
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

/**
 * Get all tasks for a client
 */
export const getClientTasks = async (companyId, clientId) => {
  try {
    const tasksRef = collection(db, `companies/${companyId}/clients/${clientId}/tasks`);
    const q = query(tasksRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toMillis() || Date.now()
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

/**
 * Update a task (toggle completion, edit, etc)
 */
export const updateClientTask = async (companyId, clientId, taskId, updates) => {
  try {
    const taskRef = doc(db, `companies/${companyId}/clients/${clientId}/tasks/${taskId}`);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteClientTask = async (companyId, clientId, taskId) => {
  try {
    await deleteDoc(doc(db, `companies/${companyId}/clients/${clientId}/tasks/${taskId}`));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// ============================================
// RENEWAL DATA OPERATIONS
// ============================================

/**
 * Update renewal data for a client (stage, probability)
 */
export const updateClientRenewal = async (companyId, clientId, renewalData) => {
  try {
    console.log('🔵 Updating renewal data:', { companyId, clientId, renewalData });
    
    if (!companyId) {
      throw new Error('Company ID is required');
    }
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    
    const clientRef = doc(db, `companies/${companyId}/clients/${clientId}`);
    
    // Use setDoc with merge to create if doesn't exist
    await setDoc(clientRef, {
      id: clientId,
      renewalTracking: renewalData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Successfully saved renewal data to Firestore');
  } catch (error) {
    console.error('❌ Error updating renewal data:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      companyId,
      clientId,
      renewalData
    });
    throw error;
  }
};

/**
 * Get renewal tracking data for all clients in a company
 */
export const getCompanyRenewalsData = async (companyId) => {
  try {
    const clientsRef = collection(db, `companies/${companyId}/clients`);
    const snapshot = await getDocs(clientsRef);
    
    const renewalsData = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.renewalTracking) {
        renewalsData[doc.id] = data.renewalTracking;
      }
    });
    
    return renewalsData;
  } catch (error) {
    console.error('Error getting renewals data:', error);
    throw error;
  }
};

// ============================================
// CLIENT DOCUMENT OPERATIONS
// ============================================

/**
 * Create or update a client document in Firestore
 * This is used when importing clients from CSV
 */
export const upsertClient = async (companyId, clientId, clientData) => {
  try {
    const clientRef = doc(db, `companies/${companyId}/clients/${clientId}`);
    const docSnap = await getDoc(clientRef);
    
    if (docSnap.exists()) {
      // Update existing client
      await updateDoc(clientRef, {
        ...clientData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new client
      await setDoc(clientRef, {
        ...clientData,
        id: clientId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error upserting client:', error);
    throw error;
  }
};

/**
 * Get a single client document
 */
export const getClient = async (companyId, clientId) => {
  try {
    const clientRef = doc(db, `companies/${companyId}/clients/${clientId}`);
    const docSnap = await getDoc(clientRef);
    
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
};

/**
 * Get all clients for a company
 */
export const getCompanyClients = async (companyId) => {
  try {
    const clientsRef = collection(db, `companies/${companyId}/clients`);
    const snapshot = await getDocs(clientsRef);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting company clients:', error);
    throw error;
  }
};
