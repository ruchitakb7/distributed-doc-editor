"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyDocuments, deleteDocument } from "@/request/document";
import { Alert } from "@/component/ui/alert";
import ConfirmationModal from "@/component/ui/confirmationModel";
import { Search, X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "@/component/ui/Spinner";
import { Toast } from "@/component/ui/Toast";

interface Document {
  _id: string;
  title: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 6;

  const [toast, setToast] = useState({
    open: false,
    variant: "info" as "success" | "error" | "info",
    message: "",
  });

  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    variant: "info",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  const fetchDocuments = async () => {
    try {
      const data = await getMyDocuments(currentPage, limit, search);

      if (data.success) {
        setDocuments(data.documents.documents);
        setTotalPages(data.documents.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Spinner></Spinner>
      </div>
    );
  }

  const handleDelete = async (documentId: string) => {
    try {
      const data = await deleteDocument(documentId);

      setToast({
        open: true,
        variant: "success",
        message: data.message,
      });

      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== documentId)
      );

      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);
    } catch (error: any) {
      setToast({
        open: true,
        variant: "error",
        message: error.message || "Failed to delete document.",
      });
    }
  };

  return (

    <div className="min-h-screen bg-[#f8f8f8]">
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Heading */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif text-[#222]">
              My Documents
            </h1>

            <p className="text-gray-500 mt-2">
              Manage and curate your professional archive.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative w-full sm:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
        w-full
        rounded-xl
        text-gray-800
        border border-gray-300
        bg-white
        py-3
        pl-11
        pr-10
        text-sm
        placeholder:text-gray-400
        shadow-sm
        transition-all
        outline-none
        focus:border-black
        focus:ring-2
        focus:ring-gray-200
      "
            />


          </div>
        </div>
        {documents.length === 0 ? (
          <div className="h-[250px] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 bg-white">
            No documents found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() => router.push(`/dashboard/${doc._id}`)}
                className="
                bg-white
                border
                border-gray-200
                rounded-xl
                p-5
                cursor-pointer
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6M9 16h6M9 8h6M7 3h8l2 2v16H7V3z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-lg font-medium text-gray-900 line-clamp-2 min-h-[56px]">
                  {doc.title}
                </h2>

                {/* Category */}
                <p className="uppercase tracking-[0.2em] text-[11px] text-gray-400 mt-2">
                  DOCUMENT
                </p>

                {/* Divider */}
                <div className="border-t mt-8 pt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {new Date(doc.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocumentId(doc._id);
                      setDeleteModalOpen(true);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Toast
        open={toast.open}
        variant={toast.variant}
        message={toast.message}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Move document to Trash?"
        description=""
        confirmText="Move to Trash"
        confirmVariant="destructive"
        onConfirm={async () => {
          await handleDelete(selectedDocumentId);
        }}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-black disabled:opacity-30 transition"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-lg transition ${currentPage === page
                  ? "font-bold text-black"
                  : "text-gray-400 hover:text-black"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-500 hover:text-black disabled:opacity-30 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

}
