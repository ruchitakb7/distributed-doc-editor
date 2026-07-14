import { updateDocument } from "@/request/document";
import {
    getPendingDocuments,
    markDocumentSynced,
} from "@/lib/indexedDB";

export async function syncPendingDocuments() {
    const documents = await getPendingDocuments();

    for (const document of documents) {
        try {
            await updateDocument(document._id, {
                title: document.title,
                content: document.content,
            });

            await markDocumentSynced(document);
        } catch (error) {
            console.error(error);
        }
    }
}