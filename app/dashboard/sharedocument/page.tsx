"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSharedDocuments} from "@/request/document";
import Spinner from "@/component/ui/Spinner";
import { Search, X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit=6

  useEffect(() => {
    fetchDocuments();
  }, [currentPage,debouncedSearch]);

    useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);


  const fetchDocuments = async () => {
    try {
      const data = await getSharedDocuments(currentPage, limit, search);

      if (data.success) {
        // setDocuments(data.documents);
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

  return (
  <div className="min-h-screen bg-[#f8f8f8]">
    <main className="max-w-7xl mx-auto px-8 py-12">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-[#222]">
          Shared Documents
        </h1>

        <p className="text-gray-500 mt-2">
          Documents shared with you by collaborators.
        </p>
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
        <div className="h-[250px] border-2 border-dashed rounded-xl flex items-center justify-center bg-white text-gray-400">
          No shared documents yet.
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
              {/* Document Icon */}
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
                SHARED DOCUMENT
              </p>

              {/* Footer */}
              <div className="border-t mt-8 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(doc.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="uppercase font-medium">
                  SHARED
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>

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