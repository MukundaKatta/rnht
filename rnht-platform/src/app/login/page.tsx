"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ShieldCheck, CheckCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase";

type AuthStep = "method" | "email" | "otp" | "success";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, sendOtp, verifyOtp, initialize } = useAuthStore();
  const [step, setStep] = useState<AuthStep>("method");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    const result = await sendOtp(email, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    const token = otp.join("");
    const result = await verifyOtp(email, token);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setStep("success");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    const result = await sendOtp(email, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (err) {
      setError(err.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  // Handle paste of full OTP code
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      const last = document.getElementById("otp-5");
      last?.focus();
    }
  };

  if (step === "success") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-gray-900">
          Welcome to RNHT!
        </h1>
        <p className="mt-3 text-gray-600">
          You have been successfully signed in. You can now book services,
          manage your family profiles, and track your spiritual journey.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard" className="btn-primary">
            My Dashboard
          </Link>
          <Link href="/services" className="btn-outline">
            Book a Pooja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <div className="w-full">
        {/* Temple logo */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-temple-red text-2xl font-heading font-bold text-white">
            R
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">
            Devotee Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Access your devotee profile, booking history, and more
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Error display */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step: Choose method */}
          {step === "method" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("email")}
                className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-temple-red hover:bg-red-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Sign in with Email
                  </p>
                  <p className="text-xs text-gray-500">
                    We&apos;ll send a 6-digit code to your email
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* Step: Email input */}
          {step === "email" && (
            <div className="space-y-4">
              <button
                onClick={() => { setStep("method"); setError(""); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                &larr; Back
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  className="input-field mt-1"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field mt-1"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={!email || !name.trim() || loading}
                onClick={handleSendOtp}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          )}

          {/* Step: OTP verification */}
          {step === "otp" && (
            <div className="space-y-4 text-center">
              <button
                onClick={() => { setStep("email"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                &larr; Back
              </button>
              <div>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-temple-red focus:outline-none focus:ring-2 focus:ring-temple-red/20"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    autoFocus={i === 0}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={otp.some((d) => !d) || loading}
                onClick={handleVerifyOtp}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </button>
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-temple-red hover:underline disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          )}
        </div>

        {/* Guest note */}
        <div className="mt-6 flex items-center gap-2 justify-center text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>
            Guest checkout is also available when booking services.
          </span>
        </div>
      </div>
    </div>
  );
}
