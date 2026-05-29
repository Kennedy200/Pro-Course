"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3, BookOpen, Users, LogOut, User,
  Search, AlertTriangle, CheckCircle, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyticsApi } from "@/lib/api";

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

export default function LecturerStudents() {
  const { user, token, logout } = useAuth();
  const [mounted,  setMounted]  = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    analyticsApi.getStudents(token)
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (!mounted) return null;

  const filtered = students.filter((s) => {
    const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all"
      ? true
      : filter === "at_risk"
      ? s.at_risk
      : s.learning_state === filter;
    return matchSearch && matchFilter;
  });

  const atRiskCount   = students.filter(s => s.at_risk).length;
  const proficientCount = students.filter(s => s.learning_state === "proficient").length;

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
            { icon: BookOpen,  label: "Courses",   href: "/lecturer/courses",   active: false },
            { icon: Users,     label: "Students",  href: "/lecturer/students",  active: true  },
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

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>Students</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            {students.length} students enrolled across all courses
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Students",  value: students.length,   color: "#3d4de8", bg: "#eef2ff",  icon: Users       },
            { label: "Proficient",       value: proficientCount,   color: "#16a34a", bg: "#f0fdf4",  icon: CheckCircle },
            { label: "At Risk",          value: atRiskCount,       color: "#dc2626", bg: "#fef2f2",  icon: AlertTriangle },
            { label: "Avg Score",        value: students.length > 0 ? `${Math.round(students.reduce((a, s) => a + s.avg_score, 0) / students.length)}%` : "0%", color: "#7c3aed", bg: "#f5f3ff", icon: TrendingUp },
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
            <input
              type="text" placeholder="Search students..." value={search}
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
                style={{ padding: "6px 14px", fontSize: "13px", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: filter === f.value ? "#3d4de8" : "transparent", color: filter === f.value ? "#ffffff" : "#64748b", transition: "all 0.15s" }}
              >
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
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 180px 100px 120px 100px", gap: "16px", padding: "14px 24px", backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              {["Student", "Courses", "Progress", "Avg Score", "State", "Status"].map((h) => (
                <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
              ))}
            </div>

            {/* Table rows */}
            {filtered.map((student, idx) => {
              const state = stateConfig[student.learning_state] || stateConfig["needs_practice"];
              const progressPct = student.total_modules > 0
                ? Math.round((student.modules_completed / student.total_modules) * 100)
                : 0;

              return (
                <div key={student.student_id}
                  style={{ display: "grid", gridTemplateColumns: "1fr 80px 180px 100px 120px 100px", gap: "16px", padding: "16px 24px", borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fafbff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  {/* Student name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#3d4de8" }}>
                        {student.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{student.full_name}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{student.email}</div>
                    </div>
                  </div>

                  {/* Courses */}
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{student.courses_enrolled}</div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{student.modules_completed}/{student.total_modules}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: "5px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", backgroundColor: "#3d4de8", borderRadius: "999px", width: `${progressPct}%` }} />
                    </div>
                  </div>

                  {/* Avg Score */}
                  <div style={{ fontSize: "15px", fontWeight: 900, color: student.avg_score >= 70 ? "#16a34a" : student.avg_score >= 50 ? "#ea580c" : student.avg_score === 0 ? "#94a3b8" : "#dc2626" }}>
                    {student.avg_score > 0 ? `${student.avg_score}%` : "—"}
                  </div>

                  {/* Learning State */}
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", fontSize: "12px", fontWeight: 700, color: state.color, backgroundColor: state.bg, border: `1px solid ${state.border}`, borderRadius: "999px" }}>
                    {state.label}
                  </span>

                  {/* Status */}
                  {student.at_risk ? (
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
      </main>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}