

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/component/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";

import { useAuth } from "@/context/AuthContext";
import { loginUser, LoginFormData } from "@/request/auth";
import { validateUser } from "@/validation/validation";
import { UserFormErrors } from "@/types/user.types";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthUser } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [status, setStatus] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateUser(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (!response.success) {
        setStatus({
          variant: "error",
          message: response.data.message || "Login failed.",
        });
        return;
      }

      setStatus({
        variant: "success",
        message: response.data.message || "Login successful.",
      });

      if (response.data?.token && response.data?.user) {
        setAuthUser({ user: response.data.user, token: response.data.token });
      }

      router.push("/dashboard");
    } catch (error) {
      setStatus({
        variant: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
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
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to continue to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {status && (
            <Alert
              className="mb-5"
              variant={status.variant}
              title={status.variant === "success" ? "Success" : "Error"}
              message={status.message}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgotPassword"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
