import { it, expect, vi } from 'vitest';

// Define mocks at the top level
vi.mock('firebase/firestore', () => {
  const mockNotes = [
    { id: '1', content: 'Note 1', createdAt: Date.now() },
    { id: '2', content: 'Note 2', createdAt: Date.now() },
  ];

  const mockSetDoc = vi.fn();
  const mockGetDocs = vi.fn().mockResolvedValue({
    docs: mockNotes.map((note) => ({
      id: note.id,
      data: () => ({
        ...note,
        createdAt: { toMillis: () => note.createdAt },
      }),
    })),
  });

  return {
    setDoc: mockSetDoc,
    getDocs: mockGetDocs,
    doc: vi.fn(() => ({ id: 'mocked-id' })),
    collection: vi.fn(() => 'mocked-collection'),
    query: vi.fn(() => 'mocked-query'),
    orderBy: vi.fn(() => 'mocked-orderBy'),
    serverTimestamp: vi.fn().mockReturnValue(Date.now()),
    getFirestore: vi.fn(() => 'mocked-firestore'),
    __mocks: { mockSetDoc, mockGetDocs },
  };
});

// Import the functions under test
import { getClientNotes, addClientNote } from '../clientData';

// Update test cases to reference mocks from `__mocks`
import { __mocks } from 'firebase/firestore';
const { mockSetDoc, mockGetDocs } = __mocks;

// Add a spy for cache.delete
import { cache } from '../clientData';
vi.spyOn(cache, 'delete');

// Update test to ensure proper mocking
it('should cache and return client notes', async () => {
  const notes = await getClientNotes('company1', 'client1');
  expect(notes).toEqual([
    { id: '1', content: 'Note 1', createdAt: expect.any(Number) },
    { id: '2', content: 'Note 2', createdAt: expect.any(Number) },
  ]);
  expect(mockGetDocs).toHaveBeenCalledTimes(1);

  // Call again to test caching
  const cachedNotes = await getClientNotes('company1', 'client1');
  expect(cachedNotes).toEqual([
    { id: '1', content: 'Note 1', createdAt: expect.any(Number) },
    { id: '2', content: 'Note 2', createdAt: expect.any(Number) },
  ]);
  expect(mockGetDocs).toHaveBeenCalledTimes(1); // Should not call Firestore again
});

it('should invalidate cache on adding a note', async () => {
  // Update mock behavior to simulate empty Firestore response after cache invalidation
  mockGetDocs.mockResolvedValueOnce({ docs: [] });

  await addClientNote('company1', 'client1', { content: 'New Note' });
  expect(mockSetDoc).toHaveBeenCalled();

  // Verify that cache.delete is called with the correct key
  expect(cache.delete).toHaveBeenCalledWith('getClientNotes-company1-client1');

  // Ensure cache is invalidated
  const notes = await getClientNotes('company1', 'client1');
  expect(notes).toEqual([]); // Mocked Firestore now returns empty
});