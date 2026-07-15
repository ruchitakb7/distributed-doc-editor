"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyDocuments } from "@/request/document";

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getMyDocuments();

      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">Loading documents...</h2>
      </div>
    );
  }

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

                <span className="uppercase font-medium">
                  OWNER
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
);

}