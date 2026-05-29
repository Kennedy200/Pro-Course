"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, TrendingUp, Award, BarChart3,
  LogOut, User, CheckCircle, Clock,
  Target, Zap, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { progressApi } from "@/lib/api";
import type { StudentProgress as StudentProgressType } from "@/lib/api";

const courseColors: Record<string, string> = {
  "CSC 301": "linear-gradient(90deg,#3d4de8,#7b97fa)",
  "CSC 312": "linear-gradient(90deg,#059669,#34d399)",
  "CSC 320": "linear-gradient(90deg,#7c3aed,#a78bfa)",
  "CSC 340": "linear-gradient(90deg,#ea580c,#fb923c)",
};

const courseIds: Record<string, number> = {
  "CSC 301": 1,
  "CSC 312": 2,
  "CSC 320": 3,
  "CSC 340": 4,
};

export default function StudentProgress() {
  const { user, token, logout } = useAuth();
  const [mounted,  setMounted]  = useState(false);
const [progress, setProgress] = useState<StudentProgressType | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    progressApi.getStudentProgress(token)
      .then(setProgress)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#3d4de8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const summary = progress?.summary;
  const states  = progress?.learning_states;
  const courses = progress?.courses_progress || [];

  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", fontFamily: "Inter, sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "240px", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", zIndex: 40 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image src="/logo.png" alt="ProCourse" width={30} height={30} style={{ borderRadius: "8px" }} />
            <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
              Pro<span style={{ color: "#7b97fa" }}>Course</span>
            </span>
          </Link>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { icon: BarChart3,  label: "Dashboard",    href: "/student/dashboard",    active: false },
            { icon: BookOpen,   label: "My Courses",   href: "/student/courses",      active: false },
            { icon: TrendingUp, label: "Progress",     href: "/student/progress",     active: true  },
            { icon: Award,      label: "Achievements", href: "/student/achievements", active: false },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", backgroundColor: item.active ? "rgba(61,77,232,0.2)" : "transparent", color: item.active ? "#7b97fa" : "#64748b", fontSize: "14px", fontWeight: 600 }}
              onMouseEnter={(e) => { if (!item.active) { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
              onMouseLeave={(e) => { if (!item.active) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#64748b"; } }}
            >
              <item.icon size={17} /> {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3d4de8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={15} color="#ffffff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.full_name || "Student"}</div>
              <div style={{ fontSize: "11px", color: "#475569" }}>Student</div>
            </div>
          </div>
          <button onClick={logout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", backgroundColor: "transparent", color: "#475569", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#475569"; }}
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: "240px", padding: "32px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>
            My Progress
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Track your learning journey across all courses
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ height: "100px", borderRadius: "16px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <>
            {/* Overall progress card */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "20px", padding: "28px 32px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle,rgba(61,77,232,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle,rgba(234,88,12,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: "32px", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
                {/* Circle */}
                <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#3d4de8" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}`}
                      strokeLinecap="round" transform="rotate(-90 50 50)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff" }}>{overallProgress}%</span>
                    <span style={{ fontSize: "10px", color: "#475569", fontWeight: 500 }}>overall</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "16px" }}>
                  {[
                    { icon: BookOpen,    label: "Courses",          value: summary?.total_courses    ?? 0   },
                    { icon: CheckCircle, label: "Modules Done",     value: summary?.modules_completed ?? 0  },
                    { icon: Target,      label: "Avg Score",        value: `${summary?.avg_score ?? 0}%`    },
                    { icon: Clock, label: "Mins Studied", value: summary?.hours_studied ?? 0 },
                    { icon: Zap,         label: "Quizzes Taken",    value: summary?.total_quizzes    ?? 0   },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <s.icon size={13} color="#475569" />
                        <span style={{ fontSize: "11px", color: "#475569", fontWeight: 500 }}>{s.label}</span>
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning state breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Proficient",     count: states?.proficient     ?? 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", desc: "Modules mastered", icon: "🎯" },
                { label: "Needs Practice", count: states?.needs_practice ?? 0, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", desc: "Keep practicing",   icon: "💪" },
                { label: "Struggling",     count: states?.struggling     ?? 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", desc: "Needs attention",   icon: "📚" },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: "#ffffff", border: `1px solid ${s.border}`, borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <span style={{ fontSize: "28px", fontWeight: 900, color: s.color }}>{s.count}</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>{s.label}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Per-course progress */}
            <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
              Course Breakdown
            </h2>

            {courses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e8ecf4" }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>No progress yet</p>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>Start a course to track your progress here</p>
                <Link href="/student/courses" style={{ padding: "10px 20px", backgroundColor: "#3d4de8", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
                  Go to Courses
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {courses.map((course) => {
                  const colorBand = courseColors[course.course_code] || courseColors["CSC 301"];
                  const courseId  = course.course_id;
                  const statusColor = course.status === "completed" ? "#16a34a" : course.status === "in_progress" ? "#3d4de8" : "#94a3b8";
                  const statusBg    = course.status === "completed" ? "#f0fdf4" : course.status === "in_progress" ? "#eef2ff" : "#f8fafc";
                  const statusLabel = course.status === "completed" ? "Completed" : course.status === "in_progress" ? "In Progress" : "Not Started";

                  return (
                    <div key={course.course_id} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div style={{ height: "4px", background: colorBand }} />
                      <div style={{ padding: "18px 20px" }}>
                        {/* Top row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                          <div>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.5px" }}>{course.course_code}</span>
                            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginTop: "3px" }}>{course.course_title}</h3>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                            <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: statusColor, backgroundColor: statusBg, borderRadius: "999px" }}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                              {course.completed_modules} of {course.total_modules} modules completed
                            </span>
                            <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{course.progress}%</span>
                          </div>
                          <div style={{ height: "8px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: "999px", width: `${course.progress}%`, background: colorBand, transition: "width 0.8s ease" }} />
                          </div>
                        </div>

                        {/* Stats + action */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "16px", fontWeight: 900, color: course.avg_score >= 70 ? "#16a34a" : course.avg_score >= 50 ? "#ea580c" : "#dc2626" }}>
                                {course.avg_score}%
                              </div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>Avg Score</div>
                            </div>
                            <div style={{ width: "1px", height: "32px", backgroundColor: "#f1f5f9" }} />
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "16px", fontWeight: 900, color: "#0f172a" }}>{course.completed_modules}</div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>Completed</div>
                            </div>
                            <div style={{ width: "1px", height: "32px", backgroundColor: "#f1f5f9" }} />
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "16px", fontWeight: 900, color: "#0f172a" }}>{course.total_modules - course.completed_modules}</div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>Remaining</div>
                            </div>
                          </div>

                          <Link href={`/student/courses/${courseId}`}
                            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, color: "#3d4de8", textDecoration: "none", borderRadius: "10px", backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", transition: "all 0.15s", flexShrink: 0 }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3d4de8"; e.currentTarget.style.color = "#ffffff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#eef2ff"; e.currentTarget.style.color = "#3d4de8"; }}
                          >
                            Continue <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}