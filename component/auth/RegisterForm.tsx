"use client";

import Link from "next/link";
import { Alert } from "@/component/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useState } from "react";
import { validateUser } from "@/validation/validation";
import { UserFormData, UserFormErrors } from "@/types/user.types";
import { registerUser } from "@/request/auth";

type StatusType = {
    variant: "success" | "error";
    message: string;
};

export default function RegisterForm() {

    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<UserFormErrors>({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusType | null>(null);


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
        setLoading(true);

        const validationErrors = validateUser(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(formData);

            if (!response.success) {
                setStatus({ variant: "error", message: response.data.message });
                return;
            }

            setStatus({ variant: "success", message: response.data.message });
            console.log(response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-0">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-bold">
                    Create Account
                </CardTitle>

                <CardDescription>
                    Join LiveDocs and start collaborating in real time.
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
                        <Input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email Address"
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
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}