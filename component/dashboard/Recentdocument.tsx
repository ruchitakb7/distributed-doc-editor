"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecentDocuments } from "@/request/document";
import EmptyState from "./Emptystate";

interface Document {
  _id: string;
  title: string;
  owner: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function RecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  const fetchRecentDocuments = async () => {
    try {
      const data = await getRecentDocuments();

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
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-serif text-[#222]">
          Recent Documents
        </h2>

        <p className="mt-2 text-gray-500">
          Loading recent documents...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-[#222]">
          Recent Documents
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quickly access the documents you've worked on recently.
        </p>
      </div>

      {documents.length === 0 ? (
        <EmptyState />
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

              <p className="uppercase tracking-[0.2em] text-[11px] text-gray-400 mt-2">
                DOCUMENT
              </p>

              {/* Footer */}
              <div className="border-t mt-8 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(doc.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="text-gray-500">
                  {doc.owner?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}