interface DocumentCardProps {
  document: {
    _id: string;
    title: string;
    updatedAt: string;
  };
}

export default function DocumentCard({
  document,
}: DocumentCardProps) {
  return (
    <div className="cursor-pointer rounded-lg border p-4 transition hover:bg-slate-50">
      <h3 className="font-semibold">
        {document.title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {document.updatedAt}
      </p>
    </div>
  );
}