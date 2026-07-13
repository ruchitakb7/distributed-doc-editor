import { Button } from "@/component/ui/button";

export default function QuickActions() {
  return (
    <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Quick Actions
      </h2>

      <Button>
        + New Document
      </Button>
    </div>
  );
}