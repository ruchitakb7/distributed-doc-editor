

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Sidebar from "@/component/dashboard/Sidebar";
import DocumentHeader from "@/component/document/documentheader";
import DocumentEditor from "@/component/document/documneteditore";
import { getDocumentById } from "@/request/document";

export default function DocumentPage() {
    const { documentId } = useParams();

    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await getDocumentById(documentId as string);
                console.log(response, "response");

                if (response.success) {
                    setDocument(response.document);
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        if (documentId) {
            fetchDocument();
        }
    }, [documentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                Loading...
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
            <div className="flex h-full">
                <div className="h-full sticky top-0">
                    <Sidebar />
                </div>

                <main className="flex-1 flex flex-col overflow-hidden">
                    <DocumentHeader
                        document={document}
                        setDocument={setDocument}
                    />

                    <div className="flex-1 overflow-auto p-6">
                        <DocumentEditor
                            document={document}
                            setDocument={setDocument}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}