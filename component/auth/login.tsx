// "use client";

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

import { loginUser, LoginFormData } from "@/request/auth";
import { validateUser } from "@/validation/validation";
import { UserFormErrors } from "@/types/user.types";

export default function LoginPage() {
  const router = useRouter();

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
                href="/auth/forgot-password"
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

// import Link from "next/link";
// import { useState } from "react";
// import { Alert } from "@/component/ui";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/component/ui/card";
// import { Input } from "@/component/ui/input";
// import { Button } from "@/component/ui/button";
// import { useRouter } from "next/navigation";
// import { loginUser, LoginFormData } from "@/request/auth";
// import { validateUser } from "@/validation/validation";
// import { UserFormErrors } from "@/types/user.types";

// export default function LoginPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<UserFormErrors>({});
//   const [status, setStatus] = useState<{ variant: "success" | "error"; message: string } | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//     setStatus(null);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     const validationErrors = validateUser(formData);

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await loginUser(formData);

//       if (!response.success) {
//         setStatus({ variant: "error", message: response.data.message || "Login failed." });
//         return;
//       }

//       setStatus({ variant: "success", message: response.data.message || "Login successful." });
//       router.push("/dashboard");
//     } catch (error) {
//       setStatus({
//         variant: "error",
//         message: error instanceof Error ? error.message : "Unable to login.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 px-4">
//       <Card className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-slate-950/20">
//         <CardHeader className="space-y-2 text-center text-white">
//           <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
//           <CardDescription className="text-gray-300">
//             Sign in to continue to your account
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {status && (
//             <Alert
//               className="mb-5"
//               variant={status.variant}
//               title={status.variant === "success" ? "Success" : "Error"}
//               message={status.message}
//             />
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm text-gray-200 mb-2">Email Address</label>
//               <Input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//               />
//               {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-sm text-gray-200 mb-2">Password</label>
//               <Input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//               />
//               {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
//             </div>

//             <div className="flex justify-end">
//               <Link href="/auth/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
//                 Forgot Password?
//               </Link>
//             </div>

//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//           </form>

//           <p className="mt-8 text-center text-gray-300">
//             New here?{" "}
//             <Link
//               href="/auth/register"
//               className="font-semibold text-indigo-400 hover:text-indigo-300"
//             >
//               Register
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }