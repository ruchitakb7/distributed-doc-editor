"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/component/ui/dialog";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "../ui";
import { shareDocument } from "@/request/document";
import { Alert } from "@/component/ui";
import { useRouter } from "next/navigation";


interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

export default function ShareModal({
  open,
  onOpenChange,
  document,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [status, setStatus] = useState<{
    variant: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleShare = async () => {
    if (!email.trim()) {
      setStatus({
        variant: "error",
        message: "Please enter an email.",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const response = await shareDocument({
        documentId: document._id,
        email,
        role: role as "viewer" | "editor",
      });

      setStatus({
        variant: "success",
        message: response.message || "Document shared successfully.",
      });

      setEmail("");
      setRole("viewer");

      onOpenChange(false);
      window.location.reload();
      
    } catch (error: any) {
      setStatus({
        variant: "error",
        message:
          error?.message || "Unable to share document. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStatus(null);
      setEmail("");
      setRole("viewer");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-gray-200 bg-white p-8">
        <DialogHeader>
          {/* <h2 className="text-3xl font-serif text-[#222]">
            Share Document
          </h2> */}

          <p className="mt-2 text-sm text-gray-500">
            Invite someone to collaborate on this document.
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-5">
          {status && (
            <Alert
              variant={status.variant}
              title={status.variant === "success" ? "Success" : "Error"}
              message={status.message}
            />
          )}

          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </Label>

            <Input
              placeholder="Enter collaborator's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Permission
            </Label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Viewers can only read the document. Editors can make changes.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancel
            </Button>

            <Button
              onClick={handleShare}
              disabled={loading}
              className="rounded-full bg-black hover:bg-gray-800"
            >
              {loading ? "Sharing..." : "Share Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

