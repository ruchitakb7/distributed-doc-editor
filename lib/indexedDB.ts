const DB_NAME = "DocEditorDB";
const STORE_NAME = "documents";
const DB_VERSION = 1;


export async function getPendingDocuments() {
    const db = await openDB();

    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const pending = request.result.filter(
                (doc) => !doc.isSynced
            );

            resolve(pending);
        };

        request.onerror = () => reject(request.error);
    });
}

export async function markDocumentSynced(document: any) {
    const db = await openDB();

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");

        const store = transaction.objectStore(STORE_NAME);

        store.put({
            ...document,
            isSynced: true,
        });

        transaction.oncomplete = () => resolve();

        transaction.onerror = () => reject(transaction.error);
    });
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "_id",
                });
            }
        };

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);
    });
}


export async function saveDocumentToIndexedDB(document: any) {
    const db = await openDB();

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");

        const store = transaction.objectStore(STORE_NAME);

        store.put(document);

        transaction.oncomplete = () => resolve();

        transaction.onerror = () => reject(transaction.error);
    });
}