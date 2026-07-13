"use client";

export default function DocumentEditor() {
  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex justify-center px-4">
        <div className="min-h-[1100px] w-full max-w-4xl rounded-md border border-gray-200 bg-white shadow-lg">
          <div
            className="min-h-[1100px] p-12 text-gray-800 outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            <p className="text-gray-400">
              Start writing your document...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}