export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h3 className="text-lg font-semibold text-gray-700">
        No Documents Yet
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Create your first document to get started.
      </p>
    </div>
  );
}