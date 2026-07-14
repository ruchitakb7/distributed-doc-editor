"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogFooter,
} from "@/component/ui/dialog";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "../ui";
import { shareDocument } from "@/request/document";
import { Alert } from "@/component/ui";


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
            <DialogContent className="w-[520px] max-w-[90vw] p-6 sm:p-8">
                <DialogHeader>
                    <div className="text-lg font-semibold text-black">Share document</div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {status && (
                        <Alert
                            className="mb-4"
                            variant={status.variant}
                            title={status.variant === "success" ? "Success" : "Error"}
                            message={status.message}
                        />
                    )}

                    <div>
                        <Label className="mb-2 block text-sm font-medium">
                            Email
                        </Label>

                        <Input
                            placeholder="Enter user's email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block text-sm font-medium">
                            Role
                        </Label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border rounded-md p-2 mt-1 text-slate-900"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleShare} disabled={loading}>
                            {loading ? "Sharing..." : "Share"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}