"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Zap, Sparkles, Calendar, MapPin } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0b0c10]">
      {/* Card */}
      <div className="w-full max-w-2xl mx-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="px-8 py-8 sm:px-12 sm:py-10 flex flex-col items-center">
            {/* Logo */}
            <img
              src="/bacancy-logo.png"
              alt="Bacancy"
              className="w-12 h-12 mb-5"
            />

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white/60 tracking-[0.15em] uppercase mb-4">
              <Sparkles size={9} className="text-cyan-400" />
              The Ultimate AI Battle
            </span>

            {/* Title */}
            <h1 className="text-white text-center font-black tracking-tight leading-[1.05] mb-3">
              <span className="block text-4xl sm:text-5xl">AI</span>
              <span className="block text-3xl sm:text-4xl bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent">
                MAHAKURUKSHETRA
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/40 text-center text-sm mb-4 max-w-sm leading-relaxed">
              Think. Build. Launch.&ensp;Prove yourself before the battle
              begins.
            </p>

            {/* Meta row */}
            <div className="flex items-center justify-center gap-5 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-white/35 text-[11px]">
                <Calendar size={11} className="text-cyan-400/70" />
                14 Mar 2026
              </div>
              <div className="flex items-center gap-1.5 text-white/35 text-[11px]">
                <MapPin size={11} className="text-cyan-400/70" />
                Bacancy Technology
              </div>
            </div>

            {/* Live pulse */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              </span>
              <span className="text-emerald-400 text-[11px] font-medium">
                Pre-Exam Portal is Live
              </span>
            </div>

            {/* Quote */}
            <p className="text-white/25 text-[11px] italic text-center mb-5 max-w-xs">
              &ldquo;Every warrior must pass the test before entering the
              battlefield.&rdquo;
            </p>

            {/* Errors */}
            {error === "AccessDenied" && (
              <div className="bg-red-500/10 border border-red-500/15 rounded-lg px-4 py-2 mb-4 w-full">
                <p className="text-[12px] text-red-400 text-center">
                  Only <strong>@bacancy.com</strong> accounts are allowed.
                </p>
              </div>
            )}
            {error && error !== "AccessDenied" && (
              <div className="bg-red-500/10 border border-red-500/15 rounded-lg px-4 py-2 mb-4 w-full">
                <p className="text-[12px] text-red-400 text-center">
                  Authentication error. Please try again.
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white text-[13px] font-medium hover:bg-white/10 transition-colors disabled:opacity-50 mb-3"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? "Entering..." : "Enter with Google"}
            </button>

            <p className="text-[11px] text-white/50 mb-4">
              Only @bacancy.com accounts are allowed
            </p>

            {/* Divider */}
            <div className="w-16 h-px bg-white/10 mb-4" />

            {/* Footer */}
            <div className="flex items-center gap-1.5 text-white/50 text-[12px]">
              <Zap size={11} className="text-orange-400" />
              <span>
                Bacancy Technology &middot; AI Mahakurukshetra 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
