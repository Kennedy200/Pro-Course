"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, TrendingUp, Award, BarChart3, Users,
  LogOut, User, AlertTriangle, CheckCircle, Clock,
  Target, Brain, Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyticsApi } from "@/lib/api";

interface AnalyticsOverview {
  total_students: number;
  total_courses: number;
  avg_completion: number;
  avg_score: number;
  learning_states: {
    proficient: number;
    needs_practice: number;
    struggling: number;
  };
}

interface StudentAnalytic {
  student_id?: number;
  id?: number;
  full_name?: string;
  name?: string;
  email: string;
  courses_enrolled?: number;
  courses?: number;
  avg_score: number;
  modules_completed: number;
  total_modules?: number;
  learning_state?: "proficient" | "needs_practice" | "struggling";
  at_risk: boolean;
}

interface StudentPerformance {
  student_id: number;
  full_name: string;
  email: string;
  courses_enrolled: number;
  avg_score: number;
  modules_completed: number;
  total_modules: number;
  learning_state: "proficient" | "needs_practice" | "struggling";
  at_risk: boolean;
}

export default function LecturerDashboard() {
  const { user, token, logout } = useAuth();
  const [mounted,   setMounted]   = useState(false);
  const [overview,  setOverview]  = useState<AnalyticsOverview | null>(null);
  const [students,  setStudents]  = useState<StudentPerformance[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [overviewData, studentsData] = await Promise.all([
          analyticsApi.getOverview(token),
          analyticsApi.getStudents(token),
        ]);
        setOverview(overviewData as any);
        setStudents((studentsData as StudentAnalytic[]).map((student) => ({
          student_id: student.student_id ?? student.id ?? 0,
          full_name: student.full_name ?? student.name ?? "",
          email: student.email,
          courses_enrolled: student.courses_enrolled ?? student.courses ?? 0,
          avg_score: student.avg_score,
          modules_completed: student.modules_completed,
          total_modules: student.total_modules ?? 0,
          learning_state: student.learning_state ?? "needs_practice",
          at_risk: student.at_risk,
        })));
      } catch (err) {
        console.error("Failed to load analytics:", err);
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
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const atRiskStudents = students.filter(s => s.at_risk);
  const stateColors = {
    proficient:     { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    needs_practice: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
    struggling:     { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  };

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
            { icon: BarChart3, label: "Dashboard",   href: "/lecturer/dashboard", active: true  },
            { icon: BookOpen,  label: "Courses",     href: "/lecturer/courses",   active: false },
            { icon: Users,     label: "Students",    href: "/lecturer/students",  active: false },
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

      {/* ── MAIN ── */}
      <main style={{ marginLeft: "240px", padding: "32px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>
            Lecturer Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Monitor student performance and adaptive learning analytics
          </p>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ height: "120px", borderRadius: "16px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <>
            {/* Overview cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Students",  value: overview?.total_students ?? 0,       icon: Users,   color: "#3d4de8", bg: "#eef2ff" },
                { label: "Active Courses",  value: overview?.total_courses ?? 0,        icon: BookOpen, color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Avg Completion",  value: `${overview?.avg_completion ?? 0}%`, icon: Target,  color: "#059669", bg: "#ecfdf5" },
                { label: "Avg Score",       value: `${overview?.avg_score ?? 0}%`,      icon: Award,   color: "#d97706", bg: "#fffbeb" },
              ].map((stat) => (
                <div key={stat.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <stat.icon size={18} color={stat.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", marginBottom: "2px" }}>{stat.value}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

           {/* Learning states */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
  {[
    { label: "Proficient",     count: overview?.learning_states?.proficient ?? 0,     color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
    { label: "Needs Practice", count: overview?.learning_states?.needs_practice ?? 0, color: "#ea580c", bg: "#fff7ed", icon: "💪" },
    { label: "Struggling",     count: overview?.learning_states?.struggling ?? 0,     color: "#dc2626", bg: "#fef2f2", icon: "⚠️" },
  ].map((s) => (
    <div key={s.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontSize: "24px" }}>{s.icon}</span>
        <span style={{ fontSize: "32px", fontWeight: 900, color: s.color }}>{s.count}</span>
      </div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{s.label}</div>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>students in this state</div>
    </div>
  ))}
</div>

            {/* At-risk banner */}
            {atRiskStudents.length > 0 && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "16px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <AlertTriangle size={20} color="#dc2626" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>
                    {atRiskStudents.length} student{atRiskStudents.length === 1 ? "" : "s"} at risk
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Students with avg score &lt;50% or in struggling state — may need intervention
                  </div>
                </div>
              </div>
            )}

            {/* Student performance table */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>Student Performance</h2>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>{students.length} students enrolled across all courses</p>
              </div>

              {students.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>No students yet</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>Students will appear here once they enroll in courses</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Student</th>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Courses</th>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Progress</th>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Avg Score</th>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Learning State</th>
                        <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const sc = stateColors[student.learning_state];
                        const progressPercent = student.total_modules > 0
                          ? Math.round((student.modules_completed / student.total_modules) * 100)
                          : 0;
                        return (
                          <tr key={student.student_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "14px 24px" }}>
                              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>{student.full_name}</div>
                              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{student.email}</div>
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{student.courses_enrolled}</span>
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ flex: 1, height: "6px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden", minWidth: "80px" }}>
                                  <div style={{ height: "100%", backgroundColor: "#3d4de8", borderRadius: "999px", width: `${progressPercent}%` }} />
                                </div>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", whiteSpace: "nowrap" }}>
                                  {student.modules_completed}/{student.total_modules}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              <span style={{ fontSize: "16px", fontWeight: 800, color: student.avg_score >= 70 ? "#16a34a" : student.avg_score >= 50 ? "#ea580c" : "#dc2626" }}>
                                {student.avg_score}%
                              </span>
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              <span style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 700, color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, borderRadius: "999px", textTransform: "capitalize", whiteSpace: "nowrap" }}>
                                {student.learning_state.replace("_", " ")}
                              </span>
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              {student.at_risk ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <AlertTriangle size={16} color="#dc2626" />
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>At Risk</span>
                                </div>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <CheckCircle size={16} color="#16a34a" />
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>On Track</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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