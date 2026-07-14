
"use client";
import { useEffect, useRef } from "react";
import { updateDocument } from "@/request/document";
import { saveDocumentToIndexedDB } from "@/lib/indexedDB";
import { useAuth } from "@/context/AuthContext";

const getUserFromCookie = () => {
    if (typeof document === "undefined") return null;

    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_user="));

    if (!cookie) return null;

    try {
        return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    } catch {
        return null;
    }
};

interface DocumentEditorProps {
    document: any;
    setDocument: React.Dispatch<React.SetStateAction<any>>;
}

export default function DocumentEditor({
    document,
    setDocument
}: DocumentEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const user = getUserFromCookie();

    const currentUser = getUserFromCookie();

    const collaborator = document?.collaborators?.find(
        (item: any) => item.user._id === currentUser?.id
    );

    const role = collaborator?.role;

    const isReadOnly = role === "viewer";

    const handleInput = (
        e: React.FormEvent<HTMLDivElement>
    ) => {
        const target = e.currentTarget;
        if (!target) return;

        const html = target.innerHTML ?? "";

        setDocument((prev: any) => ({
            ...(prev ?? {}),
            content: html,
        }));
    };


    useEffect(() => {
        if (!editorRef.current) return;

        editorRef.current.innerHTML =
            document?.content ||
            '<p class="text-gray-400">Start writing your document...</p>';
    }, [document._id]);


    useEffect(() => {
        if (!document?._id) return;

        const timer = setTimeout(async () => {
            try {
                // Save locally first
                await saveDocumentToIndexedDB({
                    ...document,
                    isSynced: false,
                });

                // If online, save to server
                if (navigator.onLine) {
                    await updateDocument(document._id, {
                        content: document.content,
                    });

                    // Mark as synced
                    await saveDocumentToIndexedDB({
                        ...document,
                        isSynced: true,
                    });

                    console.log("Document auto-saved");
                }
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [document.content, document._id]);



    return (
        <main className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto flex justify-center px-4">
                <div className="min-h-[1100px] w-full max-w-4xl rounded-md border border-gray-200 bg-white shadow-lg">

                    <div
                        ref={editorRef}
                        className="min-h-[1100px] p-12 text-gray-800 outline-none"
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onInput={handleInput}
                    // dangerouslySetInnerHTML={{
                    //     __html:
                    //         document?.content ||
                    //         '<p class="text-gray-400">Start writing your document...</p>',
                    // }}
                    />
                </div>
            </div>
        </main>
    );
}