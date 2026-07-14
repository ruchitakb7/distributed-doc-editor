

"use client";

import { Share2, History } from "lucide-react";
import { Button } from "@/component/ui/button";
import { useEffect, useRef, useState } from "react";
import { updateDocument } from "@/request/document";
import ShareModal from "./ShareModal";
import { saveDocumentToIndexedDB } from "@/lib/indexedDB";
import { syncPendingDocuments } from "@/request/syncpendingdoc";

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

interface DocumentHeaderProps {
    document: any;
    setDocument: React.Dispatch<React.SetStateAction<any>>;
}
export default function DocumentHeader({
    document,
    setDocument
}: DocumentHeaderProps) {

    const [shareOpen, setShareOpen] = useState(false);

    const lastSavedTitle = useRef("");

    const currentUser = getUserFromCookie();

    const collaborator = document?.collaborators?.find(
        (item: any) => item.user._id === currentUser?.id
    );

    const role = collaborator?.role;

    const isReadOnly = role === "viewer";

    const handleTitleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDocument((prev: any) => ({
            ...prev,
            title: e.target.value,
        }));
    };

    useEffect(() => {
        const handleOnline = () => {
            syncPendingDocuments();
        };

        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    useEffect(() => {
        lastSavedTitle.current = document?.title || "";
    }, [document._id]);

    useEffect(() => {
        if (!document?._id) return;

        if (lastSavedTitle.current === document.title) {
            return;
        }

        const timer = setTimeout(async () => {
            try {


                await saveDocumentToIndexedDB({
                    ...document,
                    isSynced: false,
                });

                if (navigator.onLine) {
                    await updateDocument(document._id, {
                        title: document.title,
                    });

                    await saveDocumentToIndexedDB({
                        ...document,
                        isSynced: true,
                    });
                }

                lastSavedTitle.current = document.title;
            } catch (error) {
                console.error(error);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [document.title, document._id]);

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto flex h-16 items-center justify-between px-6">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="min-w-0">
                        <input
                            type="text"
                            value={document?.title}
                            readOnly={isReadOnly}
                            onChange={handleTitleChange}
                            className="w-full border-none bg-transparent text-lg font-semibold text-gray-900 outline-none"
                        />

                        <p className="text-sm text-gray-500">
                            Last updated: {new Date(document.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* <Button variant="outline" size="sm">
                        <History className="mr-2 h-4 w-4" />
                        Version 1
                    </Button> */}

                    <Button
                        variant="secondary"
                        onClick={() => setShareOpen(true)}
                    >
                        <Share2 className="w-4 h-4 mr-2" />

                    </Button>
                </div>
            </div>

            <ShareModal
                open={shareOpen}
                onOpenChange={setShareOpen}
                document={document}
            />
        </header>
    );
}