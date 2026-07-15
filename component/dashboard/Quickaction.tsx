"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/component/ui/button";
import { createDocument } from "@/request/document";

export default function QuickActions() {
  const router = useRouter();

  const handleCreateDocument = async () => {
    try {
      const data = await createDocument();
      router.push(`/dashboard/${data.document._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-[#222]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new document and start collaborating instantly.
          </p>
        </div>

        <Button
          onClick={handleCreateDocument}
          className="rounded-full bg-black px-6 hover:bg-gray-800"
        >
          + New Document
        </Button>
      </div>
    </section>
  );
}