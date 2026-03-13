"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroScrollVideo from "@/components/ui/scroll-animated-video";
import {
  LogOut,
  Calendar,
  MapPin,
  Clock,
  Cpu,
  Database,
  Globe,
  Terminal,
  BookOpen,
  Trophy,
  CheckCircle,
  Lock,
  ChevronDown,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [examOpen, setExamOpen] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/exam-config").then((r) => r.ok ? r.json() : { examOpen: false }),
      fetch("/api/attempts").then((r) => r.ok ? r.json() : []),
    ]).then(([config, attempts]) => {
      setExamOpen(config.examOpen);
      if (Array.isArray(attempts) && attempts.some((a: { passed: boolean }) => a.passed)) {
        setAlreadyPassed(true);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStartExam = () => {
    router.push("/exam");
  };

  // Build the nextLayer content — hackathon details section
  const hackathonDetails = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 4vw, 60px)",
        paddingBottom: "clamp(140px, 20vw, 280px)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        gap: "clamp(24px, 3vw, 40px)",
      }}
    >
      {/* Exam CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          PRE-EXAM PORTAL
        </span>

        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            lineHeight: 1,
            margin: 0,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            background:
              "linear-gradient(90deg, #fff 0%, #fff 40%, #22d3ee 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            textAlign: "center",
          }}
        >
          Ready for the Challenge?
        </h2>

        <p
          style={{
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "500px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Complete the pre-exam with a 100% score to unlock your hackathon
          participation. You can retake until you pass.
        </p>
      </div>

    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative" style={{ background: "#0b0c10" }}>
      {/* Fixed top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
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

      {/* Scroll down indicator — hides after scroll */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-500"
        style={{ opacity: scrolled ? 0 : 1 }}
      >
        <span className="text-white/40 text-[10px] tracking-[0.15em] uppercase">
          Scroll down to start exam
        </span>
        <ChevronDown size={16} className="text-cyan-400/60" />
      </div>

      {/* Hero scroll animation */}
      <HeroScrollVideo
        title="AI MAHAKURUKSHETRA"
        subtitle="THINK, BUILD, AND LAUNCH A PRODUCT."
        meta="14 March 2026"
        credits={
          <>
            <p>THE ULTIMATE AI BATTLE</p>
            <p>Bacancy Technology</p>
          </>
        }
        mediaType="image"
        media="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=1920&q=80"
        overlay={{
          caption: "HACKATHON • 2026",
          heading: "The Ultimate AI Battle Begins",
          paragraphs: [
            "Build a product from scratch using AI-powered tools. Think fast, code faster, and launch something amazing.",
          ],
          extra: (
            <div
              style={{
                display: "flex",
                gap: "24px",
                marginTop: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                }}
              >
                <Calendar size={16} style={{ color: "#22d3ee" }} />
                14 March 2026
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                }}
              >
                <Clock size={16} style={{ color: "#22d3ee" }} />
                9:00 AM - 7:00 PM
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                }}
              >
                <MapPin size={16} style={{ color: "#22d3ee" }} />
                Bacancy Technology
              </div>
            </div>
          ),
        }}
        themeMode="dark"
        smoothScroll={true}
        scrollHeightVh={100}
        nextLayerScrollVh={150}
        nextLayer={hackathonDetails}
      />

      {/* Static content after scroll animation */}
      <div
        style={{
          background: "#0b0c10",
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
        }}
      >
        {/* Hackathon Details Section */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">Date</h3>
              <p className="text-gray-400 text-sm mt-1">
                14 March 2026
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">Time</h3>
              <p className="text-gray-400 text-sm mt-1">
                9:00 AM - 7:00 PM
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg">Location</h3>
              <p className="text-gray-400 text-sm mt-1">
                Bacancy Technology
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-center text-2xl font-bold text-white mb-8">
              Tech Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Globe className="w-6 h-6" />,
                  name: "Next.js",
                  desc: "Frontend + Backend if needed",
                },
                {
                  icon: <Database className="w-6 h-6" />,
                  name: "Supabase",
                  desc: "Database, Auth, Storage",
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  name: "Vercel",
                  desc: "Hosting (preferred)",
                },
                {
                  icon: <Terminal className="w-6 h-6" />,
                  name: "Codex",
                  desc: "AI Development Tool",
                },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-cyan-400/30 transition-colors"
                >
                  <div className="text-cyan-400 flex justify-center mb-3">
                    {tech.icon}
                  </div>
                  <h3 className="text-white font-semibold">{tech.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Rules */}
          <div className="mb-16">
            <h2 className="text-center text-2xl font-bold text-white mb-8">
              Pre-Exam Rules
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <ul className="space-y-4">
                {[
                  "The exam contains multiple choice questions about the hackathon tools",
                  "You must score 100% to pass and earn your certificate",
                  "Incorrect questions will be shown, but NOT the correct answers",
                  "You can retake the exam unlimited times until you pass",
                  "Once passed, you will receive a completion certificate",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-cyan-400 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-300 text-sm">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            {alreadyPassed ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-full text-sm font-medium">
                  <Trophy size={18} />
                  You have already passed the exam!
                </div>
                <br />
                <a
                  href="/certificate"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  <Trophy size={18} />
                  View Certificate
                </a>
              </div>
            ) : examOpen ? (
              <button
                onClick={handleStartExam}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                <BookOpen size={20} />
                Start Pre-Exam
              </button>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 px-6 py-3.5 rounded-xl font-medium">
                  <Lock size={18} />
                  Exam Not Yet Started
                </div>
                <p className="text-gray-500 text-sm">
                  The admin has not started the exam yet. Please wait.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-gray-600 text-sm">
            AI Mahakurukshetra 2026 &middot; Bacancy Technology
          </p>
        </footer>
      </div>
    </div>
  );
}
