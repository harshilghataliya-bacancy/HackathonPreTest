"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight, Send, RotateCcw, Trophy, XCircle, Lock } from "lucide-react";

interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  incorrectQuestions: { id: number; question: string }[];
}

type ExamState = "loading" | "ready" | "in-progress" | "submitted";

export default function ExamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [examState, setExamState] = useState<ExamState>("loading");
  const [result, setResult] = useState<ExamResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRetake, setShowRetake] = useState(false);
  const [examClosed, setExamClosed] = useState(false);

  const [alreadyPassed, setAlreadyPassed] = useState(false);

  const fetchQuestions = useCallback(async () => {
    // Check if exam is open
    const configRes = await fetch("/api/exam-config");
    const config = await configRes.json();
    if (!config.examOpen) {
      setExamClosed(true);
      setExamState("ready");
      return;
    }

    // Check if user already passed
    const attemptsRes = await fetch("/api/attempts");
    const attempts = await attemptsRes.json();
    if (Array.isArray(attempts) && attempts.some((a: { passed: boolean }) => a.passed)) {
      setAlreadyPassed(true);
      setExamState("ready");
      return;
    }

    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data);
    setExamState("in-progress");
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const startExam = () => {
    setAnswers({});
    setCurrentPage(0);
    setResult(null);
    setShowRetake(false);
    setExamState("in-progress");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const submitExam = async () => {
    setSubmitting(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data: ExamResult = await res.json();
    setResult(data);
    setExamState("submitted");
    setSubmitting(false);

    if (!data.passed) {
      setTimeout(() => setShowRetake(true), 3000);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const QUESTIONS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  if (examState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Exam closed by admin
  if (examClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="text-center max-w-md mx-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Exam Not Available
          </h1>
          <p className="text-gray-500 mb-6">
            The admin has not started the exam yet. Please check back later.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-6 py-3 rounded-xl font-medium hover:bg-cyan-500/20 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Already passed — no retake allowed
  if (alreadyPassed && examState !== "submitted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="text-center max-w-lg mx-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            You have already passed!
          </h1>
          <p className="text-gray-500 mb-8">
            You have already achieved 100% and are eligible for the hackathon.
          </p>
          <a
            href="/certificate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <Trophy size={18} />
            View Certificate
          </a>
          <div className="mt-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Certificate redirect
  if (examState === "submitted" && result?.passed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] overflow-hidden relative">
        {/* Glitter bomb confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => {
            const colors = ["#22d3ee", "#3b82f6", "#a855f7", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#fff"];
            const color = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 2 + Math.random() * 3;
            const size = 4 + Math.random() * 8;
            const isCircle = i % 3 === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: "-20px",
                  width: `${size}px`,
                  height: isCircle ? `${size}px` : `${size * 2.5}px`,
                  backgroundColor: color,
                  borderRadius: isCircle ? "50%" : "2px",
                  opacity: 0.9,
                  animation: `confettiFall ${duration}s ${delay}s ease-in infinite`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
          {/* Glitter sparkles */}
          {Array.from({ length: 30 }).map((_, i) => {
            const left = 10 + Math.random() * 80;
            const top = 10 + Math.random() * 80;
            const delay = Math.random() * 2;
            return (
              <div
                key={`sparkle-${i}`}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: `${top}%`,
                  width: "4px",
                  height: "4px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 0 6px 2px rgba(255,255,255,0.6), 0 0 12px 4px rgba(34,211,238,0.3)",
                  animation: `glitterPulse 1.5s ${delay}s ease-in-out infinite`,
                }}
              />
            );
          })}
        </div>

        <style jsx>{`
          @keyframes confettiFall {
            0% {
              transform: translateY(-20px) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg) scale(0.3);
              opacity: 0;
            }
          }
          @keyframes glitterPulse {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <div className="text-center max-w-lg mx-4 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mb-6 animate-bounce">
            <Trophy className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Congratulations!
          </h1>
          <p className="text-gray-300 mb-2">
            You scored {result.score}/{result.totalQuestions} — Perfect Score!
          </p>
          <p className="text-gray-500 mb-8">
            You are now eligible to participate in AI Mahakurukshetra.
          </p>
          <a
            href="/certificate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Trophy size={18} />
            View Certificate
          </a>
        </div>
      </div>
    );
  }

  // Result page (failed)
  if (examState === "submitted" && result && !result.passed) {
    return (
      <div className="min-h-screen bg-[#0b0c10]">
        <nav className="border-b border-white/10 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/bacancy-logo.png" alt="Bacancy" className="w-7 h-7" />
              <span className="font-semibold text-white">
                Hackathon Pre-Exam
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-gray-600 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Exam Results
              </h2>
              <div className="mt-4 flex items-center justify-center gap-8">
                <div>
                  <p className="text-4xl font-bold text-cyan-400">
                    {result.score}
                  </p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <p className="text-4xl font-bold text-gray-600">
                    {result.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <p className="text-4xl font-bold text-red-400">
                    {result.totalQuestions - result.score}
                  </p>
                  <p className="text-sm text-gray-500">Incorrect</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-400 font-medium">
                You need 100% correct answers to pass. Keep trying!
              </p>
            </div>

            {result.incorrectQuestions.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3">
                  Wrong Answers:
                </h3>
                <div className="space-y-2">
                  {result.incorrectQuestions.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <p className="text-sm text-red-300">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showRetake && (
            <div className="text-center">
              <button
                onClick={startExam}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                <RotateCcw size={18} />
                Retake Exam
              </button>
            </div>
          )}

          {!showRetake && (
            <div className="text-center">
              <p className="text-gray-600 text-sm animate-pulse">
                Preparing retake...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // In-progress exam — 10 questions per page
  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <nav className="border-b border-white/10 px-6 py-4 sticky top-0 z-10 bg-[#0b0c10]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bacancy-logo.png" alt="Bacancy" className="w-7 h-7" />
            <span className="font-semibold text-white">
              Hackathon Pre-Exam
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-cyan-400">
              {answeredCount}/{questions.length} answered
            </span>
            <span className="text-sm text-gray-500">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              {answeredCount}/{questions.length} answered
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Questions list — 10 per page */}
        <div className="space-y-6">
          {pageQuestions.map((q, idx) => {
            const globalIdx = currentPage * QUESTIONS_PER_PAGE + idx;
            return (
              <div
                key={q.id}
                className="bg-white/5 rounded-2xl border border-white/10 p-6"
              >
                <h2 className="text-base font-semibold text-white mb-4">
                  <span className="text-cyan-400 mr-2">Q{globalIdx + 1}.</span>
                  {q.question}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["optionA", "optionB", "optionC", "optionD"] as const).map(
                    (opt) => {
                      const selected = answers[q.id] === opt;
                      const label = opt.replace("option", "");
                      return (
                        <button
                          key={opt}
                          onClick={() => selectAnswer(q.id, opt)}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                            selected
                              ? "border-cyan-500 bg-cyan-500/10 text-white"
                              : "border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2 ${
                              selected
                                ? "bg-cyan-500 text-white"
                                : "bg-white/10 text-gray-500"
                            }`}
                          >
                            {label}
                          </span>
                          <span className="text-sm">{q[opt]}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => { setCurrentPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  i === currentPage
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentPage < totalPages - 1 ? (
            <button
              onClick={() => { setCurrentPage((p) => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={submitExam}
              disabled={answeredCount < questions.length || submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
