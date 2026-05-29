"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users, BookOpen, BarChart3, LogOut, User,
  Shield, TrendingUp, CheckCircle, AlertTriangle,
  Brain, Award, Clock, Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyticsApi } from "@/lib/api";

interface OverviewData {
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

interface StudentData {
  student_id: number;
  full_name: string;
  email: string;
  courses_enrolled: number;
  avg_score: number;
  modules_completed: number;
  total_modules: number;
  learning_state: string;
  at_risk: boolean;
}

const stateConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  proficient:     { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Proficient"     },
  needs_practice: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", label: "Needs Practice" },
  struggling:     { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Struggling"     },
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [mounted,   setMounted]   = useState(false);
  const [overview,  setOverview]  = useState<OverviewData | null>(null);
  const [students,  setStudents]  = useState<StudentData[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "courses">("overview");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [ov, st] = await Promise.all([
          analyticsApi.getOverview(token),
          analyticsApi.getStudents(token),
        ]);
        setOverview(ov);
        setStudents(st);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (!mounted) return null;

  const filtered = students.filter((s) => {
    const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true
      : filter === "at_risk" ? s.at_risk
      : s.learning_state === filter;
    return matchSearch && matchFilter;
  });

  const atRiskCount     = students.filter(s => s.at_risk).length;
  const proficientCount = students.filter(s => s.learning_state === "proficient").length;
  const avgScore        = students.length > 0
    ? Math.round(students.reduce((a, s) => a + s.avg_score, 0) / students.length)
    : 0;

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
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 12px 8px" }}>Admin Panel</div>
          {[
            { icon: BarChart3, label: "Dashboard",  tab: "overview"  },
            { icon: Users,     label: "Students",   tab: "students"  },
            { icon: BookOpen,  label: "Courses",    tab: "courses"   },
          ].map((item) => (
            <button key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", backgroundColor: activeTab === item.tab ? "rgba(61,77,232,0.2)" : "transparent", color: activeTab === item.tab ? "#7b97fa" : "#64748b", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", textAlign: "left" }}
              onMouseEnter={(e) => { if (activeTab !== item.tab) { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
              onMouseLeave={(e) => { if (activeTab !== item.tab) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#64748b"; } }}
            >
              <item.icon size={17} /> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={15} color="#ffffff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.full_name || "Admin"}</div>
              <div style={{ fontSize: "11px", color: "#475569" }}>Administrator</div>
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

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <Shield size={20} color="#dc2626" />
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {activeTab === "overview" ? "Admin Dashboard" : activeTab === "students" ? "User Management" : "Course Overview"}
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            {activeTab === "overview" ? "System-wide platform analytics and health" : activeTab === "students" ? "View and monitor all registered students" : "Monitor all courses and their performance"}
          </p>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
              {loading ? Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ height: "110px", borderRadius: "16px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
              )) : [
                { label: "Total Students",  value: overview?.total_students  ?? 0,   icon: Users,       color: "#3d4de8", bg: "#eef2ff"  },
                { label: "Active Courses",  value: overview?.total_courses   ?? 0,   icon: BookOpen,    color: "#059669", bg: "#ecfdf5"  },
                { label: "Avg Score",       value: `${overview?.avg_score    ?? 0}%`, icon: Award,       color: "#ea580c", bg: "#fff7ed"  },
                { label: "Avg Completion",  value: `${overview?.avg_completion ?? 0}%`, icon: TrendingUp, color: "#7c3aed", bg: "#f5f3ff" },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <s.icon size={17} color={s.color} />
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Two col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

              {/* Learning State Distribution */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <Brain size={17} color="#3d4de8" />
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>AI Learning States</h3>
                </div>
                {loading ? <div style={{ height: "120px", borderRadius: "12px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} /> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "Proficient",     count: overview?.learning_states.proficient     ?? 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
                      { label: "Needs Practice", count: overview?.learning_states.needs_practice ?? 0, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
                      { label: "Struggling",     count: overview?.learning_states.struggling     ?? 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
                    ].map((s) => {
                      const total = (overview?.learning_states.proficient ?? 0) + (overview?.learning_states.needs_practice ?? 0) + (overview?.learning_states.struggling ?? 0);
                      const pct   = total > 0 ? Math.round((s.count / total) * 100) : 0;
                      return (
                        <div key={s.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: s.color }}>{s.label}</span>
                            <span style={{ fontSize: "13px", fontWeight: 800, color: s.color }}>{s.count} students ({pct}%)</span>
                          </div>
                          <div style={{ height: "8px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: "999px", width: `${pct}%`, backgroundColor: s.color, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Platform Health */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <Shield size={17} color="#3d4de8" />
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Platform Health</h3>
                </div>
                {loading ? <div style={{ height: "120px", borderRadius: "12px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} /> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "Total Students",    value: students.length,     icon: Users,       ok: true  },
                      { label: "Proficient Students", value: proficientCount,   icon: CheckCircle, ok: true  },
                      { label: "At-Risk Students",  value: atRiskCount,         icon: AlertTriangle, ok: atRiskCount === 0 },
                      { label: "Platform Avg Score", value: `${avgScore}%`,     icon: Award,       ok: avgScore >= 50 },
                    ].map((s) => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <s.icon size={15} color={s.ok ? "#16a34a" : "#dc2626"} />
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{s.label}</span>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 900, color: s.ok ? "#16a34a" : "#dc2626" }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent students */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Recent Students</h3>
                <button onClick={() => setActiveTab("students")}
                  style={{ fontSize: "13px", fontWeight: 600, color: "#3d4de8", background: "none", border: "none", cursor: "pointer" }}>
                  View all →
                </button>
              </div>
              {loading ? <div style={{ height: "100px", borderRadius: "12px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} /> : students.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#94a3b8", textAlign: "center", padding: "20px" }}>No students registered yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {students.slice(0, 5).map((s) => {
                    const state = stateConfig[s.learning_state] || stateConfig["needs_practice"];
                    const pct   = s.total_modules > 0 ? Math.round((s.modules_completed / s.total_modules) * 100) : 0;
                    return (
                      <div key={s.student_id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#3d4de8" }}>{s.full_name.charAt(0)}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{s.full_name}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.email}</div>
                        </div>
                        <div style={{ width: "100px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                            <span style={{ fontSize: "10px", color: "#94a3b8" }}>{s.modules_completed}/{s.total_modules}</span>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a" }}>{pct}%</span>
                          </div>
                          <div style={{ height: "4px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", backgroundColor: "#3d4de8", borderRadius: "999px", width: `${pct}%` }} />
                          </div>
                        </div>
                        <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: state.color, backgroundColor: state.bg, border: `1px solid ${state.border}`, borderRadius: "999px", whiteSpace: "nowrap" }}>
                          {state.label}
                        </span>
                        {s.at_risk && <AlertTriangle size={14} color="#dc2626" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === "students" && (
          <>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Students",  value: students.length,   color: "#3d4de8", bg: "#eef2ff",  icon: Users        },
                { label: "Proficient",       value: proficientCount,   color: "#16a34a", bg: "#f0fdf4",  icon: CheckCircle  },
                { label: "At Risk",          value: atRiskCount,       color: "#dc2626", bg: "#fef2f2",  icon: AlertTriangle },
                { label: "Avg Score",        value: `${avgScore}%`,    color: "#7c3aed", bg: "#f5f3ff",  icon: Award        },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <s.icon size={17} color={s.color} />
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search + filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, position: "relative", maxWidth: "360px" }}>
                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Search size={15} color="#94a3b8" />
                </div>
                <input type="text" placeholder="Search students..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", height: "40px", paddingLeft: "36px", paddingRight: "16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "4px" }}>
                {[
                  { value: "all",            label: "All"           },
                  { value: "proficient",     label: "Proficient"    },
                  { value: "needs_practice", label: "Needs Practice"},
                  { value: "struggling",     label: "Struggling"    },
                  { value: "at_risk",        label: "At Risk"       },
                ].map((f) => (
                  <button key={f.value} onClick={() => setFilter(f.value)}
                    style={{ padding: "6px 14px", fontSize: "13px", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: filter === f.value ? "#3d4de8" : "transparent", color: filter === f.value ? "#ffffff" : "#64748b", transition: "all 0.15s" }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Students table */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} style={{ height: "72px", borderRadius: "14px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e8ecf4" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>No students found</p>
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 180px 100px 120px 100px", gap: "16px", padding: "14px 24px", backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                  {["Student", "Courses", "Progress", "Avg Score", "State", "Status"].map((h) => (
                    <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                  ))}
                </div>
                {filtered.map((s, idx) => {
                  const state = stateConfig[s.learning_state] || stateConfig["needs_practice"];
                  const pct   = s.total_modules > 0 ? Math.round((s.modules_completed / s.total_modules) * 100) : 0;
                  return (
                    <div key={s.student_id}
                      style={{ display: "grid", gridTemplateColumns: "1fr 80px 180px 100px 120px 100px", gap: "16px", padding: "16px 24px", borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center", transition: "background 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fafbff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#3d4de8" }}>{s.full_name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{s.full_name}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.email}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{s.courses_enrolled}</div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>{s.modules_completed}/{s.total_modules}</span>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{pct}%</span>
                        </div>
                        <div style={{ height: "5px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", backgroundColor: "#3d4de8", borderRadius: "999px", width: `${pct}%` }} />
                        </div>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 900, color: s.avg_score >= 70 ? "#16a34a" : s.avg_score >= 50 ? "#ea580c" : s.avg_score === 0 ? "#94a3b8" : "#dc2626" }}>
                        {s.avg_score > 0 ? `${s.avg_score}%` : "—"}
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", fontSize: "12px", fontWeight: 700, color: state.color, backgroundColor: state.bg, border: `1px solid ${state.border}`, borderRadius: "999px" }}>
                        {state.label}
                      </span>
                      {s.at_risk ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>
                          <AlertTriangle size={13} /> At Risk
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>
                          <CheckCircle size={13} /> On Track
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── COURSES TAB ── */}
        {activeTab === "courses" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {[
              { id: 1, title: "Data Structures & Algorithms", code: "CSC 301", band: "linear-gradient(90deg,#3d4de8,#7b97fa)", color: "#3d4de8", bg: "#eef2ff" },
              { id: 2, title: "Computer Networks",            code: "CSC 312", band: "linear-gradient(90deg,#059669,#34d399)", color: "#059669", bg: "#ecfdf5" },
              { id: 3, title: "Operating Systems",           code: "CSC 320", band: "linear-gradient(90deg,#7c3aed,#a78bfa)", color: "#7c3aed", bg: "#f5f3ff" },
              { id: 4, title: "Software Engineering",        code: "CSC 340", band: "linear-gradient(90deg,#ea580c,#fb923c)", color: "#ea580c", bg: "#fff7ed" },
            ].map((course) => (
              <div key={course.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ height: "5px", background: course.band }} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>{course.code}</span>
                      <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{course.title}</h3>
                    </div>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: course.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={17} color={course.color} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    {[
                      { label: "Students",    value: students.filter(s => s.courses_enrolled > 0).length },
                      { label: "Avg Score",   value: students.length > 0 ? `${Math.round(students.reduce((a, s) => a + s.avg_score, 0) / students.length)}%` : "—" },
                      { label: "Proficient",  value: students.filter(s => s.learning_state === "proficient").length },
                    ].map((stat) => (
                      <div key={stat.label} style={{ textAlign: "center", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
                        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "2px" }}>{stat.value}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}