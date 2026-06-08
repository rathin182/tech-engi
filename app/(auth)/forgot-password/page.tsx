"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormErrors {
  [key: string]: string;
}

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInputDisabled, setOtpInputDisabled] = useState(false); // disables otp field after verified
  const [emailDisabled, setEmailDisabled] = useState(false); // disables email after otp sent
  const [otpVerified, setOtpVerified] = useState(false); // true = otp NOT yet verified (password locked)
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      await handleResetPassword(e);
    } else {
      await handleSendOtp(e);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpVerified(true); // password locked until otp verified
        setEmailDisabled(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (!formData.newPassword.trim()) {
      setErrors({ newPassword: "New password is required" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push("/signin");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpInputDisabled(true); // lock otp field
        setOtpVerified(false);     // unlock password field
        toast.success(data.message);
      } else {
        setErrors({ otp: "Invalid OTP" });
        toast.error(data.message || "Failed to verify OTP");
      }
    } catch {
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex w-full h-screen">
      {/* ── Left: Form ── */}
      <div className="w-[50%] h-screen">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-130 bg-white h-full p-8">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                Forgot Password 🔑
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter the email address associated with your account, and we'll
                help you get back in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    disabled={emailDisabled}
                    value={formData.email.toLowerCase()}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 h-12 rounded-xl border bg-transparent focus:bg-white outline-none transition-all text-sm text-black disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e]/30"
                    }`}
                  />
                  {/* green dot when valid */}
                  {!errors.email && formData.email && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Resend OTP link */}
              {otpSent && (
                <div className="flex justify-end -mt-3">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-[#f0b31e] hover:text-yellow-600 font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {/* OTP */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  OTP
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="otp"
                      type="text"
                      disabled={otpInputDisabled}
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="••••••"
                      maxLength={6}
                      className={`w-full pl-11 pr-4 h-12 rounded-xl border bg-transparent focus:bg-white outline-none transition-all text-sm text-black disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.otp
                          ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                          : "border-gray-200 focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e]/30"
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={otpInputDisabled || loading}
                    onClick={verifyOtp}
                    className="h-12 px-5 bg-[#f0b31e] hover:bg-[#e0a61a] text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
                {errors.otp && (
                  <p className="text-xs text-red-500 ml-1">{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    disabled={otpVerified}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 h-12 rounded-xl border bg-transparent focus:bg-white outline-none transition-all text-sm text-black disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.newPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e]/30"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={otpVerified}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#f0b31e] transition-colors disabled:opacity-40"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || otpVerified}
                className="w-full h-12 bg-[#f0b31e] hover:bg-[#e0a61a] text-white rounded-xl text-base font-semibold shadow-md shadow-yellow-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {otpSent ? "Resetting..." : "Sending..."}
                  </>
                ) : otpSent ? (
                  "Reset Password"
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Right: Golden panel ── */}
      <div className="w-[50%] rounded-[40px] relative overflow-hidden p-10 flex flex-col justify-between m-6">
        {/* Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFF6D6_0%,#F8D978_18%,#F0B31E_45%,#E8A400_65%,#FFF1C2_100%)]" />

        {/* Glows */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/10 blur-[140px] rounded-full" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-white/50 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFD65C]/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFF3CF]/60 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.12] mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
        <div className="absolute inset-0 bg-white/[0.08]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="mt-20">
            <div className="w-24 h-24 bg-white rounded-sm flex items-center justify-center text-black font-bold text-sm shadow-xl">
              LOGO
            </div>
            <div className="mt-12">
              <h1 className="text-white text-7xl font-extrabold tracking-tight leading-none">
                TECH ENGI
              </h1>
              <p className="text-white/85 text-lg max-w-xl mt-4 leading-relaxed">
                Reset your password securely. We verify your identity before
                making any changes to keep your account safe.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-auto pt-28">
            <div className="flex gap-6 overflow-hidden">
              {/* Card 1 */}
              <div className="min-w-[420px] rounded-3xl border border-white/20 bg-white/[0.12] backdrop-blur-2xl p-6 shadow-[0_10px_40px_rgba(255,190,40,0.15)]">
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Dude, your stuff is the bomb! House rent is the real deal! I
                  STRONGLY recommend house rent to EVERYONE interested in
                  running a successful online business!
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <img
                    src="https://i.pravatar.cc/100?img=32"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Lana Bernier
                    </h4>
                    <p className="text-white/70 text-xs">
                      Senior Paradigm Strategist
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-[420px] rounded-3xl border border-white/20 bg-white/[0.12] backdrop-blur-2xl p-6 shadow-[0_10px_40px_rgba(255,190,40,0.15)]">
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Dude, your stuff is the bomb! House rent is the real deal! I
                  STRONGLY recommend house rent to EVERYONE interested in
                  running a successful online business!
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Lana Bernier
                    </h4>
                    <p className="text-white/70 text-xs">
                      Senior Paradigm Strategist
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end mt-16 gap-4 pr-2">
              <div className="w-32 h-[2px] bg-white/70" />
              <p className="text-white text-3xl font-light tracking-tight">
                Build for connectivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;