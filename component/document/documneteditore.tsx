"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { updateDocument } from "@/request/document";
import { saveDocumentToIndexedDB } from "@/lib/indexedDB";
import socket from "@/lib/socket";

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

const TOOLS = [
  [
    { icon: Undo2, label: "Undo", cmd: "undo" },
    { icon: Redo2, label: "Redo", cmd: "redo" },
  ],
  [
    { icon: Heading1, label: "H1", cmd: "formatBlock", value: "H1" },
    { icon: Heading2, label: "H2", cmd: "formatBlock", value: "H2" },
  ],
  [
    { icon: Bold, label: "Bold", cmd: "bold" },
    { icon: Italic, label: "Italic", cmd: "italic" },
    { icon: Underline, label: "Underline", cmd: "underline" },
  ],
  [
    { icon: List, label: "Bulleted list", cmd: "insertUnorderedList" },
    { icon: ListOrdered, label: "Numbered list", cmd: "insertOrderedList" },
    { icon: Quote, label: "Quote", cmd: "formatBlock", value: "BLOCKQUOTE" },
  ],
  [
    { icon: Link2, label: "Link", cmd: "createLink" },
    { icon: ImageIcon, label: "Image", cmd: "insertImage" },
  ],
];

interface DocumentEditorProps {
  document: any;
  setDocument: React.Dispatch<React.SetStateAction<any>>;
  isRemoteUpdate: React.MutableRefObject<boolean>;
}

export default function DocumentEditor({
  document: doc,
  setDocument,
  isRemoteUpdate,
}: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const currentUser = getUserFromCookie();
  const [stats, setStats] = useState({ words: 0, chars: 0 });

  const collaborator = doc?.collaborators?.find(
    (item: any) => item.user._id === currentUser?.id
  );

  const role = collaborator?.role;
  const isReadOnly = role === "viewer";

  const updateStats = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setStats({ words, chars: text.replace(/\s/g, "").length });
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (!target) return;

    const content = target.innerHTML;
    const html = target.innerHTML ?? "";

    setDocument((prev: any) => ({
      ...(prev ?? {}),
      content: html,
    }));

    updateStats(html);

    socket.emit("document-change", {
      documentId: doc._id,
      content,
    });
  };

  const exec = (cmd: string, value?: string) => {
    if (isReadOnly) return;
    let v = value;
    if (cmd === "createLink") {
      const url = window.prompt("Enter URL");
      if (!url) return;
      v = url;
    }
    if (cmd === "insertImage") {
      const url = window.prompt("Enter image URL");
      if (!url) return;
      v = url;
    }
    (window as any).document.execCommand(cmd, false, v);
    editorRef.current?.focus();
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setDocument((prev: any) => ({ ...(prev ?? {}), content: html }));
      updateStats(html);
    }
  };

  useEffect(() => {
    if (!isRemoteUpdate.current) return;
    if (!editorRef.current) return;

    editorRef.current.innerHTML = doc?.content || "";
    updateStats(editorRef.current.innerHTML);
    isRemoteUpdate.current = false;
  }, [doc?.content]);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML =
      doc?.content ||
      '<p class="text-muted-foreground">Start writing your document...</p>';
    updateStats(editorRef.current.innerHTML);
  }, [doc._id]);

  useEffect(() => {
    if (!doc?._id) return;

    const timer = setTimeout(async () => {
      try {
        await saveDocumentToIndexedDB({ ...doc, isSynced: false });

        if (navigator.onLine) {
          await updateDocument(doc._id, { content: doc.content });
          await saveDocumentToIndexedDB({ ...doc, isSynced: true });
          console.log("Document auto-saved");
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [doc.content, doc._id]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-elevated)] shadow-[var(--shadow-card)]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[var(--hairline)] bg-[var(--surface)] px-3 py-2">
          {TOOLS.map((group, gi) => (
            <div
              key={gi}
              className="flex items-center gap-0.5 border-r border-[var(--hairline)] pr-2 last:border-r-0"
            >
              {group.map(({ icon: Icon, label, cmd, value }) => (
                <button
                  key={label}
                  title={label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec(cmd, value)}
                  disabled={isReadOnly}
                  className="grid h-8 w-8 place-items-center rounded-md text-gray-400 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </button>
              ))}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2 pl-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700">
              {isReadOnly ? "Viewing" : "Saved offline"}
            </span>
          </div>
        </div>

        {/* Page */}
        <div className="bg-[var(--surface)] px-6 py-10 md:px-16 md:py-16">
          <div className="mx-auto max-w-2xl">
            <div
              ref={editorRef}
              contentEditable={!isReadOnly}
              suppressContentEditableWarning
              onInput={handleInput}
              spellCheck={false}
              className="prose-editor min-h-[520px] w-full border-0 bg-transparent font-serif text-lg leading-[1.85] text-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--hairline)] bg-[var(--surface-elevated)] px-6 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{stats.words} words</span>
            <span className="text-[var(--hairline)]">·</span>
            <span>{stats.chars} characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{isReadOnly ? "Read only" : "Editing"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}




// "use client";
// import { useEffect, useRef } from "react";
// import { updateDocument } from "@/request/document";
// import { saveDocumentToIndexedDB } from "@/lib/indexedDB";
// import { useAuth } from "@/context/AuthContext";
// import socket from "@/lib/socket";

// const getUserFromCookie = () => {
//     if (typeof document === "undefined") return null;
//     const cookie = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("auth_user="));

//     if (!cookie) return null;

//     try {
//         return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
//     } catch {
//         return null;
//     }
// };

// interface DocumentEditorProps {
//     document: any;
//     setDocument: React.Dispatch<React.SetStateAction<any>>;
//      isRemoteUpdate: React.MutableRefObject<boolean>;
// }

// export default function DocumentEditor({
//     document,
//     setDocument,
//      isRemoteUpdate,
// }: DocumentEditorProps) {
//     const editorRef = useRef<HTMLDivElement>(null);
//     const user = getUserFromCookie();
//     const currentUser = getUserFromCookie();

//     const collaborator = document?.collaborators?.find(
//         (item: any) => item.user._id === currentUser?.id
//     );

//     const role = collaborator?.role;

//     const isReadOnly = role === "viewer";

//     const handleInput = (
//         e: React.FormEvent<HTMLDivElement>
//     ) => {
//         const target = e.currentTarget;
//         if (!target) return;

//          const content = e.currentTarget.innerHTML;

//         const html = target.innerHTML ?? "";

//         setDocument((prev: any) => ({
//             ...(prev ?? {}),
//             content: html,
//         }));

//         console.log("Emitting:", content);

//         socket.emit("document-change", {
//             documentId: document._id,
//             content,
//         });
//     };

// //     useEffect(() => {
// //     if (!editorRef.current) return;

// //     editorRef.current.innerHTML = document?.content || "";
// // }, [document?.content]);

// // useEffect(() => {
// //     if (!isRemoteUpdate.current) return;
// //     if (!editorRef.current) return;

// //     editorRef.current.innerHTML = document?.content || "";

// //     isRemoteUpdate.current = false;
// // }, [document?.content]);

// useEffect(() => {
//     console.log("Effect running");
//     console.log("isRemoteUpdate:", isRemoteUpdate.current);
//     console.log("document.content:", document?.content);

//     if (!isRemoteUpdate.current) return;
//     if (!editorRef.current) return;

//     editorRef.current.innerHTML = document?.content || "";

//     isRemoteUpdate.current = false;
// }, [document?.content]);


//     useEffect(() => {
//         if (!editorRef.current) return;

//         editorRef.current.innerHTML =
//             document?.content ||
//             '<p class="text-gray-400">Start writing your document...</p>';
//     }, [document._id]);


//     useEffect(() => {
//         if (!document?._id) return;

//         const timer = setTimeout(async () => {
//             try {
//                 // Save locally first
//                 await saveDocumentToIndexedDB({
//                     ...document,
//                     isSynced: false,
//                 });

//                 // If online, save to server
//                 if (navigator.onLine) {
//                     await updateDocument(document._id, {
//                         content: document.content,
//                     });

//                     // Mark as synced
//                     await saveDocumentToIndexedDB({
//                         ...document,
//                         isSynced: true,
//                     });

//                     console.log("Document auto-saved");
//                 }
//             } catch (error) {
//                 console.error("Auto-save failed:", error);
//             }
//         }, 1000);

//         return () => clearTimeout(timer);
//     }, [document.content, document._id]);



//     return (
//         <main className="min-h-screen bg-slate-100 py-10">
//             <div className="mx-auto flex justify-center px-4">
//                 <div className="min-h-[1100px] w-full max-w-4xl rounded-md border border-gray-200 bg-white shadow-lg">

//                     <div
//                         ref={editorRef}
//                         className="min-h-[1100px] p-12 text-gray-800 outline-none"
//                         contentEditable={!isReadOnly}
//                         suppressContentEditableWarning
//                         onInput={handleInput}
//                     // dangerouslySetInnerHTML={{
//                     //     __html:
//                     //         document?.content ||
//                     //         '<p class="text-gray-400">Start writing your document...</p>',
//                     // }}
//                     />
//                 </div>
//             </div>
//         </main>
//     );
// }