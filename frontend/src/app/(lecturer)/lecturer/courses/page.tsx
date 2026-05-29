"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3, BookOpen, Users, LogOut, User,
  ChevronRight, TrendingUp, AlertTriangle, CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyticsApi } from "@/lib/api";

const courseColors: Record<number, { band: string; color: string; bg: string }> = {
  1: { band: "linear-gradient(90deg,#3d4de8,#7b97fa)", color: "#3d4de8", bg: "#eef2ff" },
  2: { band: "linear-gradient(90deg,#059669,#34d399)", color: "#059669", bg: "#ecfdf5" },
  3: { band: "linear-gradient(90deg,#7c3aed,#a78bfa)", color: "#7c3aed", bg: "#f5f3ff" },
  4: { band: "linear-gradient(90deg,#ea580c,#fb923c)", color: "#ea580c", bg: "#fff7ed" },
};

interface CourseAnalytics {
  course: { id: number; title: string; code: string };
  students_enrolled: number;
  avg_completion: number;
  modules: Array<{
    module_id: number;
    title: string;
    order: number;
    attempts: number;
    avg_score: number;
    struggling_count: number;
  }>;
}

export default function LecturerCourses() {
  const { user, token, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        // Fetch analytics for all 4 courses
        const results = await Promise.all(
          [1, 2, 3, 4].map((id) => analyticsApi.getCourseAnalytics(id, token))
        );
        setCourses(results);
      } catch (err) {
        console.error("Failed to load course analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", fontFamily: "Inter, sans-serif" }}>

      {/* SIDEBAR */}
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
            { icon: BarChart3, label: "Dashboard", href: "/lecturer/dashboard", active: false },
            { icon: BookOpen,  label: "Courses",   href: "/lecturer/courses",   active: true  },
            { icon: Users,     label: "Students",  href: "/lecturer/students",  active: false },
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
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={15} color="#ffffff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.full_name || "Lecturer"}</div>
              <div style={{ fontSize: "11px", color: "#475569" }}>Lecturer</div>
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

      {/* MAIN */}
      <main style={{ marginLeft: "240px", padding: "32px", minHeight: "100vh" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>Courses</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>Monitor performance and engagement per course</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ height: "120px", borderRadius: "16px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {courses.map((course, idx) => {
              const colors = courseColors[course.course.id] || courseColors[1];
              const isOpen = expanded === course.course.id;
              const struggleModules = course.modules.filter(m => m.struggling_count > 0).length;

              return (
                <div key={course.course.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ height: "4px", background: colors.band }} />
                  <div style={{ padding: "20px 24px" }}>

                    {/* Course header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>{course.course.code}</span>
                          {struggleModules > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#dc2626", backgroundColor: "#fef2f2", borderRadius: "999px" }}>
                              <AlertTriangle size={10} /> {struggleModules} struggling
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a" }}>{course.course.title}</h3>
                      </div>

                      {/* Stats */}
                      {[
                        { label: "Students",   value: course.students_enrolled },
                        { label: "Completion", value: `${course.avg_completion}%` },
                        { label: "Modules",    value: course.modules.length },
                      ].map((s) => (
                        <div key={s.label} style={{ textAlign: "center", minWidth: "70px" }}>
                          <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{s.value}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                        </div>
                      ))}

                      {/* Progress bar */}
                      <div style={{ width: "140px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>Avg Completion</span>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{course.avg_completion}%</span>
                        </div>
                        <div style={{ height: "6px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "999px", width: `${course.avg_completion}%`, background: colors.band }} />
                        </div>
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={() => setExpanded(isOpen ? null : course.course.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, color: colors.color, backgroundColor: colors.bg, border: "none", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                      >
                        {isOpen ? "Hide" : "View"} Modules <ChevronRight size={14} style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                      </button>
                    </div>

                    {/* Module breakdown */}
                    {isOpen && (
                      <div style={{ marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Module Performance</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {course.modules.map((mod) => {
                            const scoreColor = mod.avg_score >= 70 ? "#16a34a" : mod.avg_score >= 50 ? "#ea580c" : mod.avg_score === 0 ? "#94a3b8" : "#dc2626";
                            return (
                              <div key={mod.module_id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", minWidth: "24px" }}>{mod.order}</span>
                                <span style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{mod.title}</span>
                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{mod.attempts} attempts</span>
                                {mod.struggling_count > 0 && (
                                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "#dc2626", backgroundColor: "#fef2f2", padding: "2px 8px", borderRadius: "999px" }}>
                                    <AlertTriangle size={10} /> {mod.struggling_count} struggling
                                  </span>
                                )}
                                <div style={{ textAlign: "right", minWidth: "60px" }}>
                                  <div style={{ fontSize: "16px", fontWeight: 900, color: scoreColor }}>{mod.avg_score > 0 ? `${mod.avg_score}%` : "—"}</div>
                                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>avg score</div>
                                </div>
                                <div style={{ width: "80px" }}>
                                  <div style={{ height: "4px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                                    <div style={{ height: "100%", borderRadius: "999px", width: `${mod.avg_score}%`, backgroundColor: scoreColor }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}