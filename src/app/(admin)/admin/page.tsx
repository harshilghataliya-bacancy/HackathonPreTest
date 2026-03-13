"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LogOut,
  Users,
  Trophy,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";

interface AttemptData {
  id: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  totalAttempts: number;
  bestScore: number;
  totalQuestions: number;
  passed: boolean;
  lastAttemptAt: string | null;
  attempts: AttemptData[];
}

type StatusFilter = "all" | "passed" | "in_progress" | "not_started";
type ScoreFilter = "all" | "perfect" | "above_half" | "below_half";
type AttemptFilter = "all" | "0" | "1-3" | "4+";

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [attemptFilter, setAttemptFilter] = useState<AttemptFilter>("all");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "passed") matchesStatus = u.passed;
    else if (statusFilter === "in_progress") matchesStatus = !u.passed && u.totalAttempts > 0;
    else if (statusFilter === "not_started") matchesStatus = u.totalAttempts === 0;

    let matchesScore = true;
    if (scoreFilter === "perfect") matchesScore = u.totalQuestions > 0 && u.bestScore === u.totalQuestions;
    else if (scoreFilter === "above_half") matchesScore = u.totalQuestions > 0 && u.bestScore >= u.totalQuestions / 2;
    else if (scoreFilter === "below_half") matchesScore = u.totalQuestions > 0 && u.bestScore < u.totalQuestions / 2;

    let matchesAttempts = true;
    if (attemptFilter === "0") matchesAttempts = u.totalAttempts === 0;
    else if (attemptFilter === "1-3") matchesAttempts = u.totalAttempts >= 1 && u.totalAttempts <= 3;
    else if (attemptFilter === "4+") matchesAttempts = u.totalAttempts >= 4;

    return matchesSearch && matchesStatus && matchesScore && matchesAttempts;
  });

  const totalUsers = users.length;
  const passedUsers = users.filter((u) => u.passed).length;
  const attemptedUsers = users.filter((u) => u.totalAttempts > 0).length;

  const activeFilters = (statusFilter !== "all" ? 1 : 0) + (scoreFilter !== "all" ? 1 : 0) + (attemptFilter !== "all" ? 1 : 0);

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Role", "Total Attempts", "Best Score", "Total Questions", "Status", "Last Attempt"];
    const rows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.role,
      u.totalAttempts,
      u.totalAttempts > 0 ? u.bestScore : "",
      u.totalAttempts > 0 ? u.totalQuestions : "",
      u.passed ? "Passed" : u.totalAttempts > 0 ? "In Progress" : "Not Started",
      u.lastAttemptAt ? new Date(u.lastAttemptAt).toLocaleString() : "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <nav className="border-b border-white/10 px-6 py-4 bg-[#0b0c10]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bacancy-logo.png" alt="Bacancy" className="w-8 h-8" />
            <span className="font-semibold text-white tracking-wide">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-full hover:bg-cyan-400/20 transition-colors"
            >
              Back to Dashboard
            </a>
            <span className="text-sm text-gray-400 hidden sm:block">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-400">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-gray-400">Attempted Exam</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {attemptedUsers}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Passed (100%)</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {passedUsers}
            </p>
          </div>
        </div>

        {/* Search, Filters & Export */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#1a1b20] text-white">All Status</option>
            <option value="passed" className="bg-[#1a1b20] text-white">Passed</option>
            <option value="in_progress" className="bg-[#1a1b20] text-white">In Progress</option>
            <option value="not_started" className="bg-[#1a1b20] text-white">Not Started</option>
          </select>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as ScoreFilter)}
            className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#1a1b20] text-white">All Scores</option>
            <option value="perfect" className="bg-[#1a1b20] text-white">Perfect Score</option>
            <option value="above_half" className="bg-[#1a1b20] text-white">Above 50%</option>
            <option value="below_half" className="bg-[#1a1b20] text-white">Below 50%</option>
          </select>

          <select
            value={attemptFilter}
            onChange={(e) => setAttemptFilter(e.target.value as AttemptFilter)}
            className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#1a1b20] text-white">All Attempts</option>
            <option value="0" className="bg-[#1a1b20] text-white">0 Attempts</option>
            <option value="1-3" className="bg-[#1a1b20] text-white">1-3 Attempts</option>
            <option value="4+" className="bg-[#1a1b20] text-white">4+ Attempts</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setScoreFilter("all");
                setAttemptFilter("all");
              }}
              className="px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
            >
              Clear ({activeFilters})
            </button>
          )}

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors whitespace-nowrap"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredUsers.length} of {totalUsers} users
        </p>

        {/* Users table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Best Score
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Last Attempt
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    expanded={expandedUser === user.id}
                    onToggle={() =>
                      setExpandedUser(
                        expandedUser === user.id ? null : user.id
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-gray-600 text-sm">
          AI Mahakurukshetra 2026 &middot; Bacancy Technology
        </p>
      </footer>
    </div>
  );
}

function UserRow({
  user,
  expanded,
  onToggle,
}: {
  user: UserData;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="w-9 h-9 rounded-full"
              />
            ) : (
              <div className="w-9 h-9 bg-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-white text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="text-sm font-medium text-gray-200">
            {user.totalAttempts}
          </span>
        </td>
        <td className="px-6 py-4 text-center">
          {user.totalAttempts > 0 ? (
            <span className="text-sm font-medium text-gray-200">
              {user.bestScore}/{user.totalQuestions}
            </span>
          ) : (
            <span className="text-sm text-gray-600">—</span>
          )}
        </td>
        <td className="px-6 py-4 text-center">
          {user.passed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/15 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
              <CheckCircle size={12} />
              Passed
            </span>
          ) : user.totalAttempts > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
              <Clock size={12} />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full text-xs font-medium">
              <XCircle size={12} />
              Not Started
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-center text-sm text-gray-400">
          {user.lastAttemptAt
            ? new Date(user.lastAttemptAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </td>
        <td className="px-6 py-4 text-center">
          {user.totalAttempts > 0 && (
            <span className="text-gray-400">
              {expanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          )}
        </td>
      </tr>
      {expanded && user.attempts.length > 0 && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-white/[0.02] border-b border-white/5">
            <div className="max-w-2xl">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Attempt History
              </h4>
              <div className="space-y-2">
                {user.attempts.map((attempt, i) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 w-6">
                        #{user.attempts.length - i}
                      </span>
                      <span className="text-sm font-medium text-gray-200">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                      {attempt.passed ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <XCircle size={14} className="text-red-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(attempt.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
