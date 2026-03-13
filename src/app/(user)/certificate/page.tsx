"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Download, ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";

interface Attempt {
  id: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  createdAt: string;
}

export default function CertificatePage() {
  const { data: session } = useSession();
  const [passed, setPassed] = useState<boolean | null>(null);
  const [completedDate, setCompletedDate] = useState<string>("");
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/attempts")
      .then((res) => res.json())
      .then((attempts: Attempt[]) => {
        const passedAttempt = attempts.find((a) => a.passed);
        if (passedAttempt) {
          setPassed(true);
          setCompletedDate(
            new Date(passedAttempt.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        } else {
          setPassed(false);
        }
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (passed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!passed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="text-center max-w-md mx-4">
          <h2 className="text-xl font-bold text-white mb-2">
            Certificate Not Available
          </h2>
          <p className="text-gray-500 mb-6">
            You need to pass the exam with 100% score to earn your certificate.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print styles — force dark bg, remove browser header/footer */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#0b0c10] py-8 px-4 print:py-0 print:px-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <Download size={16} />
              Download / Print
            </button>
          </div>

          <div
            ref={certRef}
            className="bg-[#111318] rounded-2xl shadow-2xl overflow-hidden border border-white/10 print:shadow-none print:rounded-none print:border-0 print:min-h-screen print:flex print:items-center print:justify-center"
          >
            {/* Certificate border */}
            <div className="border-[12px] border-double border-cyan-500/40 m-4 rounded-xl print:m-6 print:flex-1">
              <div className="p-12 text-center print:p-8">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/bacancy-logo.png"
                    alt="Bacancy"
                    className="w-16 h-16 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] print:w-12 print:h-12"
                  />
                </div>

                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 font-medium mb-2">
                  Certificate of Completion
                </p>

                <h1 className="text-4xl font-bold text-white mb-2 print:text-3xl">
                  AI Mahakurukshetra Pre-Exam
                </h1>

                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto my-6 print:my-4" />

                <p className="text-gray-500 mb-1">This is to certify that</p>

                <h2 className="text-3xl font-bold text-cyan-400 my-4 print:text-2xl print:my-3">
                  {session?.user?.name || session?.user?.email}
                </h2>

                <p className="text-gray-500 mb-1">
                  has successfully completed the
                </p>
                <p className="text-gray-500 mb-6 print:mb-4">
                  <strong className="text-gray-300">AI Mahakurukshetra Pre-Examination</strong> with a perfect
                  score
                </p>

                <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-3 mb-6 print:mb-4">
                  <span className="text-3xl font-bold text-green-400 print:text-2xl">100%</span>
                  <span className="text-sm text-green-400/80 text-left">
                    Score
                    <br />
                    Achieved
                  </span>
                </div>

                <p className="text-gray-500 mb-4 print:mb-3">
                  and is now eligible to participate in the hackathon.
                </p>

                {/* Battle ready message */}
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-8 print:mb-6">
                  <Swords size={18} className="text-cyan-400" />
                  <span className="text-cyan-300 text-sm font-semibold tracking-wide">
                    You are now battle-ready for AI Kurukshetra!
                  </span>
                </div>

                <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10 print:mt-4 print:pt-4">
                  <div className="text-center">
                    <p className="font-semibold text-white">Mehul Budasna</p>
                    <p className="text-sm text-gray-600">Approved By</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">{completedDate}</p>
                    <p className="text-sm text-gray-600">Date of Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">Chandresh Patel</p>
                    <p className="font-semibold text-white">Binal Patel</p>
                    <p className="text-sm text-gray-600">Organized By</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
