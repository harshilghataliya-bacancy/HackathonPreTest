"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Shield,
  LogOut,
  Users,
  Trophy,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Power,
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

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [examOpen, setExamOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const toggleExam = async () => {
    setToggling(true);
    const res = await fetch("/api/exam-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examOpen: !examOpen }),
    });
    const data = await res.json();
    setExamOpen(data.examOpen);
    setToggling(false);
  };

  useEffect(() => {
    fetch("/api/exam-config")
      .then((res) => res.json())
      .then((data) => setExamOpen(data.examOpen));

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.role !== "ADMIN" &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const totalEmployees = users.filter((u) => u.role !== "ADMIN").length;
  const passedEmployees = users.filter(
    (u) => u.role !== "ADMIN" && u.passed
  ).length;
  const attemptedEmployees = users.filter(
    (u) => u.role !== "ADMIN" && u.totalAttempts > 0
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bacancy-logo.png" alt="Bacancy" className="w-8 h-8" />
            <span className="font-semibold text-gray-900">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Exam Toggle */}
        <div className={`rounded-xl border p-6 mb-8 flex items-center justify-between ${examOpen ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${examOpen ? 'bg-green-100' : 'bg-gray-200'}`}>
              <Power className={`w-6 h-6 ${examOpen ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Exam Status: {examOpen ? 'OPEN' : 'CLOSED'}
              </h3>
              <p className="text-sm text-gray-500">
                {examOpen ? 'Employees can take the exam now' : 'Employees cannot access the exam'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleExam}
            disabled={toggling}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 ${
              examOpen
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {toggling ? 'Updating...' : examOpen ? 'Close Exam' : 'Start Exam'}
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-500">Total Employees</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-500">Attempted Exam</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {attemptedEmployees}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500">Passed (100%)</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {passedEmployees}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Best Score
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Attempt
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No employees found
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
        className="hover:bg-gray-50 cursor-pointer transition-colors"
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
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="text-sm font-medium text-gray-700">
            {user.totalAttempts}
          </span>
        </td>
        <td className="px-6 py-4 text-center">
          {user.totalAttempts > 0 ? (
            <span className="text-sm font-medium text-gray-700">
              {user.bestScore}/{user.totalQuestions}
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>
        <td className="px-6 py-4 text-center">
          {user.passed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <CheckCircle size={12} />
              Passed
            </span>
          ) : user.totalAttempts > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <Clock size={12} />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              <XCircle size={12} />
              Not Started
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-center text-sm text-gray-500">
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
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="max-w-2xl">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Attempt History
              </h4>
              <div className="space-y-2">
                {user.attempts.map((attempt, i) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400 w-6">
                        #{user.attempts.length - i}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                      {attempt.passed ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <XCircle size={14} className="text-red-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
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
