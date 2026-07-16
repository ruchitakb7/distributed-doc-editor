"use client";

import { useEffect, useState } from "react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { sendOtp, verifyOtp } from "@/request/auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/component/ui/card";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<number | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const router = useRouter();

    useEffect(() => {
        if (!otpSent || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleSendOtp = async () => {
        try {
            setLoading(true);

            await sendOtp(email, "forgot-password");

            setOtpSent(true);
            setTimer(120);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);

            await sendOtp(email, "forgot-password");

            setTimer(120);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp === null) {
            alert("Please enter the OTP.");
            return;
        }

        if (otp.toString().length !== 6) {
            alert("OTP must be 6 digits.");
            return;
        }

        try {
            setLoading(true);

            const response = await verifyOtp({
                email,
                otp,
                type: "forgot-password",
            });

            alert(response.message);

            router.push(
                `/auth/resetpassword?email=${encodeURIComponent(email)}`
            );
        } catch (error: any) {
            alert(error.message);

            if (error.message === "OTP has expired.") {
                setTimer(0);
            }
        } finally {
            setLoading(false);
        }
    };
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    return (
        // <div className="mx-auto mt-20 w-full max-w-md rounded-lg border p-6 shadow bg-slate-50">
        //     <h2 className="mb-6 text-center text-2xl font-bold">
        //         Forgot Password
        //     </h2>

        //     <div className="space-y-4">
        //         <div>
        //             <Label>Email</Label>

        //             <Input
        //                 type="email"
        //                 value={email}
        //                 disabled={otpSent}
        //                 onChange={(e) => setEmail(e.target.value)}
        //             />
        //         </div>

        //         {otpSent && (
        //             <>
        //                 <div>
        //                     <Label>OTP</Label>

        //                     <Input
        //                         type="number"
        //                         value={otp ?? ""}
        //                         onChange={(e) =>
        //                             setOtp(e.target.value ? Number(e.target.value) : null)
        //                         }
        //                     />
        //                 </div>

        //                 <div className="flex items-center justify-between text-sm">
        //                     <span>
        //                         {minutes}:{seconds}
        //                     </span>

        //                     {timer === 0 && (
        //                         <button
        //                             type="button"
        //                             onClick={handleResendOtp}
        //                             disabled={loading}
        //                             className="font-medium text-blue-600 hover:underline disabled:opacity-50"
        //                         >
        //                             {loading ? "Sending..." : "Resend OTP"}
        //                         </button>
        //                     )}
        //                 </div>
        //             </>
        //         )}

        //         {!otpSent ? (
        //             <Button
        //                 className="w-full"
        //                 onClick={handleSendOtp}
        //                 disabled={loading}
        //             >
        //                 {loading ? "Sending..." : "Send OTP"}
        //             </Button>
        //         ) : (
        //             <Button
        //                 className="w-full"
        //                 onClick={handleVerifyOtp}
        //                 disabled={loading}
        //             >
        //                 {loading ? "Verifying..." : "Verify OTP"}
        //             </Button>
        //         )}
        //     </div>
        // </div>

    
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-bold">
                    Forgot Password
                </CardTitle>

                <CardDescription>
                    Enter your email to receive a verification code.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <Input
                            type="email"
                            value={email}
                            disabled={otpSent}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    {otpSent && (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    OTP
                                </label>

                                <Input
                                    type="number"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp ?? ""}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>
                                    {minutes}:{seconds}
                                </span>

                                {timer === 0 && (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="font-medium text-blue-600 hover:underline disabled:opacity-50"
                                    >
                                        {loading
                                            ? "Sending..."
                                            : "Resend OTP"}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {!otpSent ? (
                        <Button
                            className="w-full"
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    </main>

    );
}