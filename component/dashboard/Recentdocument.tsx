import DocumentCard from "./DocumentCard";
import EmptyState from "./Emptystate";

export default function RecentDocuments() {
  const documents: any[] = [];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Documents
      </h2>

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
    </div>
  );
}