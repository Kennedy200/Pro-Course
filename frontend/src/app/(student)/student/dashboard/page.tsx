"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, TrendingUp, Award, Clock, ChevronRight,
  LogOut, Bell, User, BarChart3, Sparkles, CheckCircle,
  PlayCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { progressApi } from "@/lib/api";
import type { StudentProgress } from "@/lib/api";

const courseColors: Record<number, {
  colorBand: string; levelColor: string; levelBg: string;
}> = {
  1: { colorBand: "linear-gradient(90deg, #3d4de8, #7b97fa)", levelColor: "#3d4de8", levelBg: "#eef2ff" },
  2: { colorBand: "linear-gradient(90deg, #059669, #34d399)", levelColor: "#059669", levelBg: "#ecfdf5" },
  3: { colorBand: "linear-gradient(90deg, #7c3aed, #a78bfa)", levelColor: "#7c3aed", levelBg: "#f5f3ff" },
  4: { colorBand: "linear-gradient(90deg, #ea580c, #fb923c)", levelColor: "#ea580c", levelBg: "#fff7ed" },
};

const stateActivityStyle: Record<string, { bg: string; icon: string }> = {
  proficient:     { bg: "#f0fdf4", icon: "✓" },
  needs_practice: { bg: "#fff7ed", icon: "💪" },
  struggling:     { bg: "#fef2f2", icon: "📚" },
};

interface ActivityItem {
  id: number;
  module_title: string;
  course_title: string;
  score: number;
  attempted_at: string;
  learning_state: string;
}

export default function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const [greeting, setGreeting] = useState("Good morning");
  const [mounted,  setMounted]  = useState(false);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [prog, act] = await Promise.all([
          progressApi.getStudentProgress(token),
          progressApi.getRecentActivity(token),
        ]);
        setProgress(prog);
        setActivity(act.activities || []);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#3d4de8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const summary = progress?.summary;
  const courses  = progress?.courses_progress || [];
  const states   = progress?.learning_states;

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
            { icon: BarChart3,  label: "Dashboard",    href: "/student/dashboard",    active: true  },
            { icon: BookOpen,   label: "My Courses",   href: "/student/courses",      active: false },
            { icon: TrendingUp, label: "Progress",     href: "/student/progress",     active: false },
            { icon: Award,      label: "Achievements", href: "/student/achievements", active: false },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", backgroundColor: item.active ? "rgba(61,77,232,0.2)" : "transparent", color: item.active ? "#7b97fa" : "#64748b", fontSize: "14px", fontWeight: 600, transition: "all 0.15s" }}
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

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500, marginBottom: "4px" }}>{greeting},</p>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {user?.full_name || "Student"} 👋
            </h1>
          </div>
          <button style={{ width: "38px", height: "38px", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            <Bell size={17} />
          </button>
        </div>

        {/* Overview cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Courses Enrolled",  value: summary?.total_courses     ?? 0,    icon: BookOpen,    color: "#3d4de8", bg: "#eef2ff" },
            { label: "Modules Completed", value: summary?.modules_completed ?? 0,    icon: CheckCircle, color: "#059669", bg: "#ecfdf5" },
            { label: "Avg Quiz Score",    value: `${summary?.avg_score      ?? 0}%`, icon: Award,       color: "#ea580c", bg: "#fff7ed" },
            { label: "Mins Studied",      value: summary?.hours_studied     ?? 0,    icon: Clock,       color: "#7c3aed", bg: "#f5f3ff" },
          ].map((stat) => (
            <div key={stat.label}
              style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a" }}>{stat.value}</div>
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* AI Recommendation banner */}
        <div style={{ backgroundColor: "#0f172a", borderRadius: "16px", padding: "20px 24px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #3d4de8, #7b97fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={19} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "3px" }}>AI Learning Recommendation</div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
              {states && states.struggling > 0
                ? <>You have <strong style={{ color: "#f87171" }}>{states.struggling} module{states.struggling > 1 ? "s" : ""}</strong> where you're struggling. Focus on those foundational topics before advancing.</>
                : states && states.needs_practice > 0
                ? <>You have <strong style={{ color: "#fb923c" }}>{states.needs_practice} module{states.needs_practice > 1 ? "s" : ""}</strong> that need more practice. Keep reviewing and retrying those quizzes.</>
                : <><strong style={{ color: "#7b97fa" }}>Great progress!</strong> You're performing well across your courses. Keep up the momentum!</>
              }
            </div>
          </div>
          <Link href="/student/courses" style={{ padding: "8px 16px", backgroundColor: "#3d4de8", color: "#ffffff", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            Continue Learning
          </Link>
        </div>

        {/* Two col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

          {/* Courses */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a" }}>My Courses</h2>
              <Link href="/student/courses" style={{ fontSize: "13px", color: "#3d4de8", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", height: "80px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e8ecf4" }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>No courses yet</p>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>You haven't enrolled in any courses</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {courses.map((course) => {
                  const colors = courseColors[course.course_id] || courseColors[1];
                  return (
                    <div key={course.course_id}
                      style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                      <div style={{ height: "4px", background: colors.colorBand }} />
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>{course.course_code}</span>
                            {course.status === "completed" && (
                              <span style={{ padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#16a34a", backgroundColor: "#f0fdf4", borderRadius: "999px" }}>✓ Completed</span>
                            )}
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{course.course_title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ flex: 1, height: "5px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: "999px", width: `${course.progress}%`, background: colors.colorBand, transition: "width 0.6s ease" }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", minWidth: "32px" }}>{course.progress}%</span>
                          </div>
                        </div>
                        <Link href={`/student/courses/${course.course_id}`}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", backgroundColor: course.status === "completed" ? "#f0fdf4" : "#eef2ff", textDecoration: "none", flexShrink: 0 }}
                        >
                          {course.status === "completed" ? <CheckCircle size={17} color="#16a34a" /> : course.status === "not_started" ? <PlayCircle size={17} color="#3d4de8" /> : <ChevronRight size={17} color="#3d4de8" />}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Recent Activity */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Recent Activity</h3>
              {activity.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "16px 0" }}>No activity yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {activity.slice(0, 4).map((a, i) => {
                    const style = stateActivityStyle[a.learning_state] || { bg: "#f8fafc", icon: "•" };
                    const timeAgo = getTimeAgo(new Date(a.attempted_at));
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: style.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>
                          {style.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", lineHeight: 1.4 }}>
                            Scored {a.score}% on {a.module_title} quiz
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{timeAgo}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Learning States */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Learning States</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Proficient",     count: states?.proficient     ?? 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
                  { label: "Needs Practice", count: states?.needs_practice ?? 0, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
                  { label: "Struggling",     count: states?.struggling     ?? 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: s.color }}>{s.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: s.color }}>{s.count} modules</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)    return "Just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}