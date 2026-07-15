import DocumentCard from "./DocumentCard";
import EmptyState from "./Emptystate";

export default function RecentDocuments() {
  const documents: any[] = [];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
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
        <div className="space-y-4">
          {documents.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
            />
          ))}
        </div>
      )}
    </section>
  );
}