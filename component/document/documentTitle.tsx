"use client";

interface DocumentTitleProps {
  title?: string;
}

export default function DocumentTitle({
  title = "Untitled Document",
}: DocumentTitleProps) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <input
          type="text"
          value={title}
          readOnly
          className="w-full border-none bg-transparent text-4xl font-bold text-gray-900 outline-none"
        />

        <p className="mt-2 text-sm text-gray-500">
          Last saved • Just now
        </p>
      </div>
    </section>
  );
}