"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSharedDocuments} from "@/request/document";
import Sidebar from "@/component/dashboard/Sidebar";

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
      const data = await getSharedDocuments();

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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
          </div>

          {documents.length === 0 ? (
            <div className="border rounded-lg p-10 text-center bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">No documents found</h2>
              <p className="text-slate-600 mt-2">
                Create your first document to get started.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => router.push(`/dashboard/${doc._id}`)}
                  className="border rounded-xl p-5 cursor-pointer hover:shadow-lg transition bg-white"
                >
                  <h2 className="text-lg font-semibold text-slate-900">{doc.title}</h2>
                  <p className="text-sm text-slate-600 mt-3">
                    Created: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}