"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  BookOpen, TrendingUp, Award, Clock, ChevronRight,
  LogOut, User, BarChart3, CheckCircle, Lock,
  PlayCircle, Sparkles, ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { coursesApi, CourseDetail } from "@/lib/api";

const courseColors: Record<number, { colorBand: string; levelColor: string; levelBg: string }> = {
  1: { colorBand: "linear-gradient(90deg,#3d4de8,#7b97fa)", levelColor: "#3d4de8", levelBg: "#eef2ff" },
  2: { colorBand: "linear-gradient(90deg,#059669,#34d399)", levelColor: "#059669", levelBg: "#ecfdf5" },
  3: { colorBand: "linear-gradient(90deg,#7c3aed,#a78bfa)", levelColor: "#7c3aed", levelBg: "#f5f3ff" },
  4: { colorBand: "linear-gradient(90deg,#ea580c,#fb923c)", levelColor: "#ea580c", levelBg: "#fff7ed" },
};

const stateColors: Record<string, { color: string; bg: string; label: string }> = {
  proficient:     { color: "#16a34a", bg: "#f0fdf4", label: "Proficient"     },
  needs_practice: { color: "#ea580c", bg: "#fff7ed", label: "Needs Practice" },
  struggling:     { color: "#dc2626", bg: "#fef2f2", label: "Struggling"     },
};

export default function CourseDetailPage() {
  const { user, token, logout } = useAuth();
  const params   = useParams();
  const courseId = Number(params.id);

  const [mounted, setMounted] = useState(false);
  const [course,  setCourse]  = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token || !courseId) return;
    const fetchCourse = async () => {
      try {
        const data = await coursesApi.getDetail(courseId, token);
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [token, courseId]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#3d4de8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const colors   = courseColors[courseId] || courseColors[1];
  const progress = course?.progress || 0;

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
            { icon: BookOpen,   label: "My Courses",   href: "/student/courses",      active: true  },
            { icon: TrendingUp, label: "Progress",     href: "/student/progress",     active: false },
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

        <Link href="/student/courses"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#64748b", textDecoration: "none", marginBottom: "24px" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ height: "180px", borderRadius: "20px", background: "linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            {Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ height: "72px", borderRadius: "14px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : !course ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Course not found</p>
            <Link href="/student/courses" style={{ color: "#3d4de8", fontWeight: 600, textDecoration: "none" }}>← Back</Link>
          </div>
        ) : (
          <>
            {/* Course header */}
            <div style={{ backgroundColor: "#0f172a", borderRadius: "20px", padding: "28px 32px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: colors.colorBand }} />
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle,rgba(61,77,232,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", position: "relative", zIndex: 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", fontFamily: "monospace", letterSpacing: "1px" }}>{course.code}</span>
                    <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: colors.levelColor, backgroundColor: colors.levelBg, borderRadius: "999px" }}>{course.level}</span>
                  </div>
                  <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px", marginBottom: "8px" }}>{course.title}</h1>
                  <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, maxWidth: "560px", marginBottom: "20px" }}>{course.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {[
                      { icon: BookOpen, label: `${course.total_modules} Modules` },
                      { icon: Clock,    label: course.duration                   },
                      { icon: Award,    label: `${course.completed_modules} completed` },
                    ].map((m) => (
                      <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <m.icon size={14} color="#475569" />
                        <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress circle */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ position: "relative", width: "80px", height: "80px" }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#3d4de8" strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                        strokeLinecap="round" transform="rotate(-90 40 40)"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff" }}>{progress}%</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>Overall Progress</span>
                </div>
              </div>
            </div>

            {/* AI tip */}
            {course.modules.some(m => m.status === "active") && (
              <div style={{ backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "14px", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <Sparkles size={16} color="#3d4de8" />
                <p style={{ fontSize: "13px", color: "#3d4de8", fontWeight: 600, margin: 0 }}>
                  AI recommends: Continue with your current module. Your adaptive learning path is active.
                </p>
              </div>
            )}

            {/* Modules */}
            <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Course Modules</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {course.modules.map((mod) => {
                const isLocked    = mod.status === "locked";
                const isCompleted = mod.status === "completed";
                const isActive    = mod.status === "active";
                const state       = mod.learning_state ? stateColors[mod.learning_state] : null;

                return (
                  <div key={mod.id}
                    style={{ backgroundColor: "#ffffff", border: `1px solid ${isActive ? "#c7d2fe" : "#e8ecf4"}`, borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", opacity: isLocked ? 0.6 : 1, boxShadow: isActive ? "0 0 0 3px rgba(61,77,232,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { if (!isLocked) (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = isActive ? "0 0 0 3px rgba(61,77,232,0.08)" : "0 1px 4px rgba(0,0,0,0.04)"; }}
                  >
                    {/* Status icon */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: isCompleted ? "#f0fdf4" : isActive ? "#eef2ff" : "#f8fafc", border: `1px solid ${isCompleted ? "#bbf7d0" : isActive ? "#c7d2fe" : "#e2e8f0"}` }}>
                      {isCompleted ? <CheckCircle size={18} color="#16a34a" /> : isActive ? <PlayCircle size={18} color="#3d4de8" /> : <Lock size={16} color="#cbd5e1" />}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>Module {mod.order}</span>
                        {isActive && <span style={{ padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#3d4de8", backgroundColor: "#eef2ff", borderRadius: "999px" }}>Current</span>}
                        {state && <span style={{ padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: state.color, backgroundColor: state.bg, borderRadius: "999px" }}>{state.label}</span>}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{mod.title}</div>
                    </div>

                    {/* Score */}
                    {isCompleted && mod.score !== null && mod.score !== undefined && (
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: "18px", fontWeight: 900, color: mod.score >= 70 ? "#16a34a" : mod.score >= 50 ? "#ea580c" : "#dc2626" }}>{mod.score}%</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>Quiz score</div>
                      </div>
                    )}

                    {/* Action */}
                    {!isLocked && (
                      <Link href={`/student/modules/${mod.id}`}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, color: isCompleted ? "#16a34a" : "#3d4de8", textDecoration: "none", borderRadius: "10px", backgroundColor: isCompleted ? "#f0fdf4" : "#eef2ff", border: `1px solid ${isCompleted ? "#bbf7d0" : "#c7d2fe"}`, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isCompleted ? "#16a34a" : "#3d4de8"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isCompleted ? "#f0fdf4" : "#eef2ff"; e.currentTarget.style.color = isCompleted ? "#16a34a" : "#3d4de8"; }}
                      >
                        {isCompleted ? <><CheckCircle size={14} /> Review</> : <><PlayCircle size={14} /> Start</>}
                      </Link>
                    )}
                  </div>
                );
              })}
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