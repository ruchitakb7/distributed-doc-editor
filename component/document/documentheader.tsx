
"use client";

import { Share2 } from "lucide-react";
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
  setDocument,
}: DocumentHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);

  const lastSavedTitle = useRef("");

  const currentUser = getUserFromCookie();

  const collaborator = document?.collaborators?.find(
    (item: any) => item.user._id === currentUser?.id
  );

  const role = collaborator?.role;

  const isReadOnly = role === "viewer";

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const collaboratorsList = document?.collaborators?.length
    ? document.collaborators
    : [];

  return (
    <section className="border-b border-[var(--hairline)] bg-[var(--surface-elevated)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
            <span>Documents</span>
            <span className="text-[var(--hairline)]">/</span>
            <span>{isReadOnly ? "Viewing" : "Draft"}</span>
          </div>

          <input
            value={document?.title ?? ""}
            onChange={handleTitleChange}
            readOnly={isReadOnly}
            placeholder="Untitled document"
            className="w-full bg-transparent font-serif text-4xl leading-tight text-gray-800 outline-none placeholder:text-muted-foreground/50 focus:outline-none md:text-5xl"
          />

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Last updated:{" "}
              {document?.updatedAt
                ? new Date(document.updatedAt).toLocaleString()
                : "just now"}
            </span>
            <span className="text-[var(--hairline)]">·</span>
            <span>{collaboratorsList.length} collaborators</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {collaboratorsList.slice(0, 4).map((c: any, i: number) => {
              const name = c?.user?.name ?? "?";
              const initial = name.charAt(0).toUpperCase();
              const palette = [
                "oklch(0.55 0.15 30)",
                "oklch(0.55 0.15 200)",
                "oklch(0.55 0.15 150)",
                "oklch(0.55 0.15 280)",
              ];
              return (
                <span
                  key={c?.user?._id ?? i}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--surface-elevated)] text-xs font-semibold text-white"
                  style={{ backgroundColor: c.color ?? palette[i % palette.length] }}
                >
                  {initial}
                </span>
              );
            })}
          </div>

          <Button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 hover:bg-foreground"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} document={document} />
    </section>
  );
}



// "use client";

// import { Share2, History } from "lucide-react";
// import { Button } from "@/component/ui/button";
// import { useEffect, useRef, useState } from "react";
// import { updateDocument } from "@/request/document";
// import ShareModal from "./ShareModal";
// import { saveDocumentToIndexedDB } from "@/lib/indexedDB";
// import { syncPendingDocuments } from "@/request/syncpendingdoc";

// const getUserFromCookie = () => {
//   if (typeof document === "undefined") return null;

//   const cookie = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("auth_user="));

//   if (!cookie) return null;

//   try {
//     return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
//   } catch {
//     return null;
//   }
// };

// interface DocumentHeaderProps {
//     document: any;
//     setDocument: React.Dispatch<React.SetStateAction<any>>;
// }
// export default function DocumentHeader({
//     document,
//     setDocument
// }: DocumentHeaderProps) {

//     const [shareOpen, setShareOpen] = useState(false);

//     const lastSavedTitle = useRef("");

//     const currentUser = getUserFromCookie();

//     const collaborator = document?.collaborators?.find(
//         (item: any) => item.user._id === currentUser?.id
//     );

//     const role = collaborator?.role;

//     const isReadOnly = role === "viewer";

//     const handleTitleChange = (
//         e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         setDocument((prev: any) => ({
//             ...prev,
//             title: e.target.value,
//         }));
//     };

//     useEffect(() => {
//         const handleOnline = () => {
//             syncPendingDocuments();
//         };

//         window.addEventListener("online", handleOnline);

//         return () => {
//             window.removeEventListener("online", handleOnline);
//         };
//     }, []);

//     useEffect(() => {
//         lastSavedTitle.current = document?.title || "";
//     }, [document._id]);

//     useEffect(() => {
//         if (!document?._id) return;

//         if (lastSavedTitle.current === document.title) {
//             return;
//         }

//         const timer = setTimeout(async () => {
//             try {


//                 await saveDocumentToIndexedDB({
//                     ...document,
//                     isSynced: false,
//                 });

//                 if (navigator.onLine) {
//                     await updateDocument(document._id, {
//                         title: document.title,
//                     });

//                     await saveDocumentToIndexedDB({
//                         ...document,
//                         isSynced: true,
//                     });
//                 }

//                 lastSavedTitle.current = document.title;
//             } catch (error) {
//                 console.error(error);
//             }
//         }, 1000);

//         return () => clearTimeout(timer);
//     }, [document.title, document._id]);

//     return (
//         <header className="sticky top-0 z-50 border-b bg-white">
//             <div className="mx-auto flex h-16 items-center justify-between px-6">
//                 <div className="flex min-w-0 items-center gap-4">
//                     <div className="min-w-0">
//                         <input
//                             type="text"
//                             value={document?.title}
//                             readOnly={isReadOnly}
//                             onChange={handleTitleChange}
//                             className="w-full border-none bg-transparent text-lg font-semibold text-gray-900 outline-none"
//                         />

//                         <p className="text-sm text-gray-500">
//                             Last updated: {new Date(document.updatedAt).toLocaleString()}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     {/* <Button variant="outline" size="sm">
//                         <History className="mr-2 h-4 w-4" />
//                         Version 1
//                     </Button> */}

//                     <Button
//                         variant="secondary"
//                         onClick={() => setShareOpen(true)}
//                     >
//                         <Share2 className="w-4 h-4 mr-2" />

//                     </Button>
//                 </div>
//             </div>

//             <ShareModal
//                 open={shareOpen}
//                 onOpenChange={setShareOpen}
//                 document={document}
//             />
//         </header>
//     );
// }