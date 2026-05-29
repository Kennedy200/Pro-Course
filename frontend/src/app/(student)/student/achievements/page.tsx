"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, TrendingUp, Award, BarChart3,
  LogOut, User, CheckCircle, Star,
  Zap, Target, Clock, Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { progressApi } from "@/lib/api";
import type { StudentProgress as StudentProgressType } from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  category: "learning" | "performance" | "consistency" | "milestone";
}

function buildAchievements(data: StudentProgressType | null): Achievement[] {
  const summary  = data?.summary;
  const states   = data?.learning_states;
  const courses  = data?.courses_progress || [];

  const modulesCompleted = summary?.modules_completed ?? 0;
  const avgScore         = summary?.avg_score         ?? 0;
  const hoursStudied     = summary?.hours_studied     ?? 0;
  const totalQuizzes     = summary?.total_quizzes     ?? 0;
  const proficient       = states?.proficient         ?? 0;
  const completedCourses = courses.filter(c => c.status === "completed").length;

  return [
    // ── Milestone ──────────────────────────────────────
    {
      id: "first_module",
      title: "First Step",
      description: "Complete your first module",
      icon: "🚀",
      color: "#3d4de8", bg: "#eef2ff", border: "#c7d2fe",
      unlocked: modulesCompleted >= 1,
      progress: Math.min(modulesCompleted, 1), maxProgress: 1,
      category: "milestone",
    },
    {
      id: "five_modules",
      title: "On a Roll",
      description: "Complete 5 modules",
      icon: "🎯",
      color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
      unlocked: modulesCompleted >= 5,
      progress: Math.min(modulesCompleted, 5), maxProgress: 5,
      category: "milestone",
    },
    {
      id: "ten_modules",
      title: "Dedicated Learner",
      description: "Complete 10 modules",
      icon: "📚",
      color: "#ea580c", bg: "#fff7ed", border: "#fed7aa",
      unlocked: modulesCompleted >= 10,
      progress: Math.min(modulesCompleted, 10), maxProgress: 10,
      category: "milestone",
    },
    {
      id: "first_course",
      title: "Course Conqueror",
      description: "Complete an entire course",
      icon: "🏆",
      color: "#d97706", bg: "#fffbeb", border: "#fde68a",
      unlocked: completedCourses >= 1,
      progress: Math.min(completedCourses, 1), maxProgress: 1,
      category: "milestone",
    },
    {
      id: "all_courses",
      title: "Grand Master",
      description: "Complete all 4 courses",
      icon: "👑",
      color: "#be185d", bg: "#fdf2f8", border: "#fbcfe8",
      unlocked: completedCourses >= 4,
      progress: Math.min(completedCourses, 4), maxProgress: 4,
      category: "milestone",
    },

    // ── Performance ────────────────────────────────────
    {
      id: "perfect_quiz",
      title: "Perfect Score",
      description: "Score 100% on any quiz",
      icon: "⭐",
      color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
      unlocked: avgScore === 100,
      category: "performance",
    },
    {
      id: "high_scorer",
      title: "High Achiever",
      description: "Maintain an average score above 80%",
      icon: "🌟",
      color: "#d97706", bg: "#fffbeb", border: "#fde68a",
      unlocked: avgScore >= 80,
      category: "performance",
    },
    {
      id: "passing_grade",
      title: "Passing Grade",
      description: "Achieve an average score of 70% or more",
      icon: "✅",
      color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
      unlocked: avgScore >= 70,
      category: "performance",
    },
    {
      id: "five_proficient",
      title: "Mastery Mode",
      description: "Reach proficient state in 5 modules",
      icon: "🎓",
      color: "#3d4de8", bg: "#eef2ff", border: "#c7d2fe",
      unlocked: proficient >= 5,
      progress: Math.min(proficient, 5), maxProgress: 5,
      category: "performance",
    },
    {
      id: "ten_quizzes",
      title: "Quiz Veteran",
      description: "Complete 10 quizzes",
      icon: "📝",
      color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
      unlocked: totalQuizzes >= 10,
      progress: Math.min(totalQuizzes, 10), maxProgress: 10,
      category: "performance",
    },

    // ── Consistency ────────────────────────────────────
    {
      id: "five_hours",
      title: "Time Invested",
      description: "Study for 5 hours total",
      icon: "⏰",
      color: "#059669", bg: "#ecfdf5", border: "#a7f3d0",
      unlocked: hoursStudied >= 5,
      progress: Math.round(Math.min(hoursStudied, 5) * 10) / 10,
      maxProgress: 5,
      category: "consistency",
    },
    {
      id: "ten_hours",
      title: "Committed Scholar",
      description: "Study for 10 hours total",
      icon: "🔥",
      color: "#ea580c", bg: "#fff7ed", border: "#fed7aa",
      unlocked: hoursStudied >= 10,
      progress: Math.round(Math.min(hoursStudied, 10) * 10) / 10,
      maxProgress: 10,
      category: "consistency",
    },
    {
      id: "all_enrolled",
      title: "Explorer",
      description: "Enroll in all 4 courses",
      icon: "🗺️",
      color: "#3d4de8", bg: "#eef2ff", border: "#c7d2fe",
      unlocked: courses.length >= 4,
      progress: Math.min(courses.length, 4), maxProgress: 4,
      category: "consistency",
    },
  ];
}

const categoryLabels: Record<string, string> = {
  milestone:   "🏅 Milestones",
  performance: "⚡ Performance",
  consistency: "🔥 Consistency",
};

export default function StudentAchievements() {
  const { user, token, logout } = useAuth();
  const [mounted,  setMounted]  = useState(false);
  const [progress, setProgress] = useState<StudentProgressType | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<"all" | "unlocked" | "locked">("all");

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

  const achievements = buildAchievements(progress);
  const unlocked     = achievements.filter(a => a.unlocked);
  const locked       = achievements.filter(a => !a.unlocked);
  const totalPoints  = unlocked.length * 100;

  const filtered = filter === "unlocked"
    ? unlocked
    : filter === "locked"
    ? locked
    : achievements;

  const byCategory = filtered.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {} as Record<string, Achievement[]>);

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
            { icon: TrendingUp, label: "Progress",     href: "/student/progress",     active: false },
            { icon: Award,      label: "Achievements", href: "/student/achievements", active: true  },
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
            Achievements
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Track your badges and milestones as you progress through ProCourse
          </p>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ height: "130px", borderRadius: "16px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <>
            {/* Summary banner */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "20px", padding: "24px 28px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle,rgba(217,119,6,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />

              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trophy size={28} color="#ffffff" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: 500, marginBottom: "4px" }}>Total Achievement Points</div>
                <div style={{ fontSize: "32px", fontWeight: 900, color: "#ffffff", letterSpacing: "-1px" }}>{totalPoints} pts</div>
              </div>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {[
                  { label: "Unlocked", value: unlocked.length, color: "#22c55e"  },
                  { label: "Locked",   value: locked.length,   color: "#475569"  },
                  { label: "Total",    value: achievements.length, color: "#7b97fa" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall progress bar */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px 24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Overall Completion</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#3d4de8" }}>
                  {unlocked.length}/{achievements.length} achievements
                </span>
              </div>
              <div style={{ height: "10px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "999px", width: `${Math.round((unlocked.length / achievements.length) * 100)}%`, background: "linear-gradient(90deg,#3d4de8,#7b97fa)", transition: "width 0.8s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>0</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{Math.round((unlocked.length / achievements.length) * 100)}% complete</span>
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "4px", marginBottom: "24px", width: "fit-content" }}>
              {[
                { value: "all",      label: `All (${achievements.length})`  },
                { value: "unlocked", label: `Unlocked (${unlocked.length})` },
                { value: "locked",   label: `Locked (${locked.length})`     },
              ].map((f) => (
                <button key={f.value} onClick={() => setFilter(f.value as typeof filter)}
                  style={{ padding: "7px 16px", fontSize: "13px", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: filter === f.value ? "#3d4de8" : "transparent", color: filter === f.value ? "#ffffff" : "#64748b", transition: "all 0.15s" }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Achievements by category */}
            {Object.entries(byCategory).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "14px" }}>
                  {categoryLabels[category] || category}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {items.map((achievement) => (
                    <div key={achievement.id}
                      style={{
                        backgroundColor: achievement.unlocked ? "#ffffff" : "#f8fafc",
                        border: `1px solid ${achievement.unlocked ? achievement.border : "#e2e8f0"}`,
                        borderRadius: "16px", padding: "18px 20px",
                        opacity: achievement.unlocked ? 1 : 0.7,
                        boxShadow: achievement.unlocked ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                        transition: "all 0.2s", position: "relative", overflow: "hidden",
                      }}
                      onMouseEnter={(e) => { if (achievement.unlocked) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                      {/* Unlocked glow */}
                      {achievement.unlocked && (
                        <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: `radial-gradient(circle,${achievement.bg} 0%,transparent 70%)`, pointerEvents: "none" }} />
                      )}

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        {/* Icon */}
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
                          backgroundColor: achievement.unlocked ? achievement.bg : "#f1f5f9",
                          border: `1px solid ${achievement.unlocked ? achievement.border : "#e2e8f0"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "22px",
                          filter: achievement.unlocked ? "none" : "grayscale(1)",
                        }}>
                          {achievement.unlocked ? achievement.icon : "🔒"}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: achievement.unlocked ? "#0f172a" : "#94a3b8" }}>
                              {achievement.title}
                            </span>
                            {achievement.unlocked && (
                              <CheckCircle size={14} color="#22c55e" />
                            )}
                          </div>
                          <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0, marginBottom: "8px" }}>
                            {achievement.description}
                          </p>

                          {/* Progress bar for in-progress achievements */}
                          {!achievement.unlocked && achievement.maxProgress && (
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Progress</span>
                                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
                                  {achievement.progress ?? 0}/{achievement.maxProgress}
                                </span>
                              </div>
                              <div style={{ height: "4px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: "999px", width: `${Math.round(((achievement.progress ?? 0) / achievement.maxProgress) * 100)}%`, backgroundColor: "#94a3b8", transition: "width 0.6s ease" }} />
                              </div>
                            </div>
                          )}

                          {achievement.unlocked && (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: achievement.color, backgroundColor: achievement.bg, padding: "2px 8px", borderRadius: "999px", border: `1px solid ${achievement.border}` }}>
                              +100 pts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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