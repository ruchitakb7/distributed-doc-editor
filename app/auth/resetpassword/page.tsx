"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { resetPassword } from "@/request/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/component/ui/card";

 function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            alert("Invalid password reset request.");
            return;
        }

        if (!password.trim() || !confirmPassword.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await resetPassword({
                email,
                password,
            });

            alert(response.message);

            router.push("/");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

   return (
  <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-10">
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">
          Reset Password
        </CardTitle>

        <CardDescription>
          Create a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <Input
              value={email}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <Input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={handleResetPassword}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </main>
);
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}