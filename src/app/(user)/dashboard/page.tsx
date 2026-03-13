"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  BookOpen,
  Trophy,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attempts")
      .then((r) => (r.ok ? r.json() : []))
      .then((attempts) => {
        if (
          Array.isArray(attempts) &&
          attempts.some((a: { passed: boolean }) => a.passed)
        ) {
          setAlreadyPassed(true);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src="/bacancy-logo.png" alt="Bacancy" className="w-8 h-8" />
          <span className="text-white font-semibold text-sm tracking-wide">
            Bacancy
          </span>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.role === "ADMIN" && (
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-full hover:bg-cyan-400/20 transition-colors"
            >
              <Shield size={13} />
              Admin Panel
            </a>
          )}
          {alreadyPassed && (
            <a
              href="/certificate"
              className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full hover:bg-green-400/20 transition-colors"
            >
              <Trophy size={13} />
              Certificate
            </a>
          )}
          <span className="text-xs text-gray-400 hidden sm:block">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4">
          <span className="bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            AI MAHAKURUKSHETRA
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base tracking-[0.15em] uppercase mb-6">
          Think, Build, and Launch a Product.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-gray-300 text-sm">14 March 2026</span>
        </div>

        {alreadyPassed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-2.5 rounded-full text-sm font-medium">
              <Trophy size={16} />
              You have already passed the exam!
            </div>
            <a
              href="/certificate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
            >
              <Trophy size={18} />
              View Certificate
            </a>
          </div>
        ) : (
          <button
            onClick={() => router.push("/exam")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
          >
            <BookOpen size={20} />
            Start Exam
          </button>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-xs tracking-[0.15em] uppercase">
            The Ultimate AI Battle &middot; Bacancy Technology
          </p>
        </div>
      </div>
    </div>
  );
}
