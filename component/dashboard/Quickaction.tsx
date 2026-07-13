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
    <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Quick Actions
      </h2>

      <Button onClick={handleCreateDocument}>
        + New Document
      </Button>
    </div>
  );
}