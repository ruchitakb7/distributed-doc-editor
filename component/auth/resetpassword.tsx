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
import { Alert } from "../ui";
import { validateUser } from "@/validation/validation";
import { ResetPassword } from "@/types/user.types";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ResetPassword>({});

  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);

  const handleResetPassword = async () => {

    if (!email) {
      setStatus({
        variant: "error",
        message: "Invalid password reset request.",
      });
      return;
    }

    const validationErrors = validateUser({ password: password, confirmPassword: confirmPassword });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({})

    setLoading(true);

    try {

      const response = await resetPassword({
        email,
        password,
      });


      setStatus({
        variant: "success",
        message: response.message,
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (error: any) {

      setStatus({
        variant: "error",
        message: error.message,
      });

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
            {status && (
              <Alert
                className="mb-5"
                variant={status.variant}
                title={status.variant === "success" ? "Success" : "Error"}
                message={status.message}
              />
            )}
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

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
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

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
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