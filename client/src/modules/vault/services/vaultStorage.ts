import { localDB, CachedDocRecord } from '../../../shared/db/dexie';
import { TravelDocument, DuoId } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { onFamilyEvent, emitFamilyEvent } from '../../../shared/services/socketClient';

// Active Object URLs cache for automatic memory cleanup
const activeBlobUrls = new Map<string, string>();

/**
 * Creates a minimal valid PDF byte stream for offline testing
 */
function createSamplePDFBlob(title: string, pnrOrId: string, elderNote: string): Blob {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 180 >>
stream
BT
/F1 18 Tf
50 720 Td
(TripTrack Document Vault - Badrinath Yatra 2026) Tj
/F1 14 Tf
0 -40 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Reference / ID: ${pnrOrId}) Tj
0 -25 Td
(Elder Care Note: ${elderNote}) Tj
0 -25 Td
(Cached in Dexie IndexedDB for 100% Offline Access) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000476 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
555
%%EOF`;

  return new Blob([content], { type: 'application/pdf' });
}

export const INITIAL_SEED_DOCS: Omit<CachedDocRecord, 'blobData'>[] = [
  {
    id: 'doc-1',
    title: '12441 Rajdhani Express e-Ticket (Durg to NDLS)',
    category: 'TRAIN_TICKET',
    passengerId: 'traveller-utkarsh',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'TRAIN_TICKET',
      pnr: '6709136735',
      seatNumber: 'Coach A2: 19(LB), 20(UB), 21(LB-Jain), 22(UB)',
      validDate: '2026-09-24',
      destinationOrHotel: 'New Delhi (NDLS) - 1362 KM'
    },
    updatedAt: Date.now()
  },
  {
    id: 'doc-2',
    title: 'Badrinath Yatra Biometric Registration (Family A)',
    category: 'YATRA_PASS',
    passengerId: 'traveller-rajnish',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'YATRA_PASS',
      yatraRegistrationNo: 'UK-YATRA-2026-BD-88912',
      validDate: '2026-09-27',
      destinationOrHotel: 'Badrinath Dham Sanctum'
    },
    updatedAt: Date.now()
  },
  {
    id: 'doc-3',
    title: 'Badrinath Yatra Biometric Registration (Family B)',
    category: 'YATRA_PASS',
    passengerId: 'traveller-sanjay',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'YATRA_PASS',
      yatraRegistrationNo: 'UK-YATRA-2026-BD-88913',
      validDate: '2026-09-27',
      destinationOrHotel: 'Badrinath Dham Sanctum'
    },
    updatedAt: Date.now()
  },
  {
    id: 'doc-4',
    title: 'Joshimath Base Hotel Confirmation Voucher',
    category: 'HOTEL_VOUCHER',
    passengerId: 'traveller-shreyas',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'HOTEL_VOUCHER',
      destinationOrHotel: 'Joshimath Heritage Inn (Heated Rooms)',
      validDate: '2026-09-26 to 2026-09-28'
    },
    updatedAt: Date.now()
  },
  {
    id: 'doc-5',
    title: 'IndiGo Return Flights - Sons (DED to RPR via DEL)',
    category: 'FLIGHT_PASS',
    passengerId: 'traveller-utkarsh',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'FLIGHT_PASS',
      pnr: 'VGLHWK',
      validDate: '2026-10-02',
      seatNumber: 'Utkarsh: 28E/28B | Shreyas: 28F/28A (IndiGo 6E 2476 / 6E 734)',
      destinationOrHotel: 'Raipur (RPR) via DEL T2->T1'
    },
    updatedAt: Date.now()
  },
  {
    id: 'doc-6',
    title: 'IndiGo Return Flights - Elders (Senior Citizens)',
    category: 'FLIGHT_PASS',
    passengerId: 'traveller-rajnish',
    mimeType: 'application/pdf',
    parsedData: {
      docType: 'FLIGHT_PASS',
      pnr: 'L8CM7C',
      validDate: '2026-10-02',
      seatNumber: 'Sanjay Ji: 27F/27A (Win) | Rajnish Ji: 27E/27B (Mid)',
      destinationOrHotel: 'Raipur (RPR) via DEL T2->T1'
    },
    updatedAt: Date.now()
  }
];

/**
 * Initialize Dexie Document Vault with Pre-Seeded Offline Passes
 */
export async function initializeVaultStorage(): Promise<void> {
  try {
    const existingCount = await localDB.cachedDocs.count();
    if (existingCount > 0) {
      return;
    }

    const recordsWithBlobs: CachedDocRecord[] = INITIAL_SEED_DOCS.map(doc => ({
      ...doc,
      blobData: createSamplePDFBlob(
        doc.title,
        doc.parsedData?.pnr || doc.parsedData?.yatraRegistrationNo || 'CONFIRMED',
        'Senior Citizen comfort prioritized'
      )
    }));

    await localDB.cachedDocs.bulkPut(recordsWithBlobs);
    console.log(`📂 [Dexie Vault] Initialized ${recordsWithBlobs.length} offline passes with binary blobs.`);
  } catch (err) {
    console.error('Failed to initialize offline vault storage', err);
  }
}

/**
 * Save or update document blob in IndexedDB
 */
export async function saveDocumentToDexie(
  doc: TravelDocument,
  blob?: Blob
): Promise<void> {
  const binaryBlob = blob || createSamplePDFBlob(
    doc.title,
    doc.parsedData?.pnr || doc.parsedData?.yatraRegistrationNo || 'LOCAL-PASS',
    'Offline travel pass'
  );

  await localDB.cachedDocs.put({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    passengerId: doc.passengerId,
    mimeType: doc.fileType || 'application/pdf',
    blobData: binaryBlob,
    parsedData: doc.parsedData,
    updatedAt: Date.now()
  });
}

/**
 * Retrieve documents filtered by Family and Category
 */
export async function getVaultDocuments(
  duoFilter: DuoId | 'ALL' = 'ALL',
  categoryFilter: string = 'ALL'
): Promise<TravelDocument[]> {
  await initializeVaultStorage();
  const records = await localDB.cachedDocs.toArray();

  return records
    .filter(record => {
      // Duo filter
      if (duoFilter !== 'ALL') {
        const traveller = TRAVELLERS_CONFIG.find(t => t.id === record.passengerId);
        if (traveller?.duoId !== duoFilter) return false;
      }
      // Category filter
      if (categoryFilter !== 'ALL' && record.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .map(record => ({
      id: record.id,
      title: record.title,
      category: record.category as any,
      fileUrl: '', // generated dynamically via getDocumentBlobUrl
      fileType: record.mimeType,
      passengerId: record.passengerId,
      parsedData: record.parsedData,
      createdAt: new Date(record.updatedAt).toISOString(),
      isCachedOffline: !!record.blobData
    }));
}

/**
 * Get or create an object URL for instant zero-network rendering
 */
export async function getDocumentBlobUrl(id: string): Promise<string | null> {
  if (activeBlobUrls.has(id)) {
    return activeBlobUrls.get(id)!;
  }

  const record = await localDB.cachedDocs.get(id);
  if (!record || !record.blobData) {
    return null;
  }

  const url = URL.createObjectURL(record.blobData);
  activeBlobUrls.set(id, url);
  return url;
}

/**
 * Revoke object URL on modal close to prevent memory leaks
 */
export function revokeDocumentBlobUrl(id: string): void {
  if (activeBlobUrls.has(id)) {
    URL.revokeObjectURL(activeBlobUrls.get(id)!);
    activeBlobUrls.delete(id);
  }
}

/**
 * Retrieve raw blob for sharing or native delegation
 */
export async function getDocumentBlob(id: string): Promise<{ blob: Blob; mimeType: string; title: string } | null> {
  const record = await localDB.cachedDocs.get(id);
  if (!record || !record.blobData) return null;
  return {
    blob: record.blobData,
    mimeType: record.mimeType,
    title: record.title
  };
}

/**
 * Storage metrics for the offline status indicator
 */
export async function getVaultStorageMetrics(): Promise<{
  cachedCount: number;
  totalSizeBytes: number;
  formattedSize: string;
}> {
  const records = await localDB.cachedDocs.toArray();
  let totalBytes = 0;

  for (const rec of records) {
    if (rec.blobData) {
      totalBytes += rec.blobData.size;
    }
  }

  const formattedSize = totalBytes > 1024 * 1024
    ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(totalBytes / 1024).toFixed(1)} KB`;

  return {
    cachedCount: records.length,
    totalSizeBytes: totalBytes,
    formattedSize
  };
}

/**
 * Remove document from Dexie
 */
export async function deleteDocumentFromDexie(id: string): Promise<void> {
  revokeDocumentBlobUrl(id);
  await localDB.cachedDocs.delete(id);
}

/**
 * Delete document from local Dexie and sync deletion with MongoDB Atlas & peers
 */
export async function deleteVaultDocument(id: string): Promise<void> {
  revokeDocumentBlobUrl(id);
  await localDB.cachedDocs.delete(id);

  if (navigator.onLine) {
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'x-family-pin': pin }
      });
      emitFamilyEvent('delete_document', { id });
    } catch (e) {
      console.warn('⚠️ [Vault Sync] Cloud delete deferred:', e);
    }
  }

  window.dispatchEvent(new CustomEvent('triptrack_vault_update', { detail: { id, deleted: true } }));
}

/**
 * Reconcile local Dexie vault with MongoDB Atlas cloud repository
 */
export async function syncVaultWithCloud(): Promise<TravelDocument[]> {
  try {
    const pin = localStorage.getItem('triptrack_family_pin') || '2026';

    const res = await fetch('/api/documents', {
      headers: { 'x-family-pin': pin }
    });

    if (!res.ok) {
      return await getVaultDocuments();
    }

    const json = await res.json();
    const cloudDocs: any[] = json.documents || json.data || [];

    for (const cloudDoc of cloudDocs) {
      if (!cloudDoc.id) continue;
      const existing = await localDB.cachedDocs.get(cloudDoc.id);

      // If document is not cached or missing blob, fetch and cache it
      if (!existing || !existing.blobData) {
        let blobData: Blob | undefined = undefined;
        if (cloudDoc.fileUrl && cloudDoc.fileUrl.startsWith('http')) {
          try {
            const blobRes = await fetch(cloudDoc.fileUrl);
            if (blobRes.ok) {
              blobData = await blobRes.blob();
            }
          } catch (e) {
            console.warn(`[Vault Sync] Failed to fetch blob for ${cloudDoc.id}:`, e);
          }
        }

        if (!blobData) {
          blobData = createSamplePDFBlob(
            cloudDoc.title,
            cloudDoc.parsedData?.pnr || cloudDoc.parsedData?.yatraRegistrationNo || 'SYNCED',
            'Synced from cloud'
          );
        }

        await localDB.cachedDocs.put({
          id: cloudDoc.id,
          title: cloudDoc.title,
          category: cloudDoc.category,
          passengerId: cloudDoc.passengerId,
          mimeType: cloudDoc.fileType || 'application/pdf',
          blobData,
          parsedData: cloudDoc.parsedData,
          updatedAt: Date.now()
        });
      }
    }

    window.dispatchEvent(new CustomEvent('triptrack_vault_update'));
  } catch (err) {
    console.warn('⚠️ [Vault Sync] Could not sync with cloud:', err);
  }

  return await getVaultDocuments();
}

let vaultSocketInitialized = false;

/**
 * Socket listener for peer document updates
 */
export function setupVaultSocketListeners(): void {
  if (vaultSocketInitialized || typeof window === 'undefined') return;
  vaultSocketInitialized = true;

  // Listen for live documents uploaded by other family members
  onFamilyEvent('receive_document', async (docData: any) => {
    try {
      if (!docData?.id) return;
      console.log(`📂 [Vault Sync] Received document "${docData.title}" from peer`);

      let blobData: Blob | undefined = undefined;
      if (docData.fileUrl && docData.fileUrl.startsWith('http')) {
        try {
          const res = await fetch(docData.fileUrl);
          if (res.ok) {
            blobData = await res.blob();
          }
        } catch (fetchErr) {
          console.warn('⚠️ [Vault Sync] Could not download remote blob in background:', fetchErr);
        }
      }

      if (!blobData) {
        blobData = createSamplePDFBlob(
          docData.title,
          docData.parsedData?.pnr || docData.parsedData?.yatraRegistrationNo || 'SYNCED',
          'Synced travel pass'
        );
      }

      const record: CachedDocRecord = {
        id: docData.id,
        title: docData.title,
        category: docData.category,
        passengerId: docData.passengerId,
        mimeType: docData.fileType || 'application/pdf',
        blobData,
        parsedData: docData.parsedData,
        updatedAt: Date.now()
      };

      await localDB.cachedDocs.put(record);
      window.dispatchEvent(new CustomEvent('triptrack_vault_update', { detail: record }));
    } catch (err) {
      console.warn('⚠️ [Vault Sync] Error caching incoming live document in Dexie:', err);
    }
  });

  // Listen for document deletion from peer
  onFamilyEvent('document_removed', async (data: { id: string }) => {
    try {
      if (!data?.id) return;
      revokeDocumentBlobUrl(data.id);
      await localDB.cachedDocs.delete(data.id);
      window.dispatchEvent(new CustomEvent('triptrack_vault_update', { detail: { id: data.id, deleted: true } }));
    } catch (err) {
      console.warn('⚠️ [Vault Sync] Error deleting document from Dexie:', err);
    }
  });

  // Auto-sync when network or socket reconnects
  window.addEventListener('triptrack_network_sync', () => {
    syncVaultWithCloud().catch(err => console.warn('Background vault sync error:', err));
  });
}

// Immediately wire vault socket listeners
setupVaultSocketListeners();

