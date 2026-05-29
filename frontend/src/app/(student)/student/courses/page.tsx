"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, TrendingUp, Award, Clock,
  ChevronRight, LogOut, User, BarChart3,
  CheckCircle, PlayCircle, Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { coursesApi, EnrolledCourse } from "@/lib/api";

const courseColors: Record<number, {
  colorBand: string; levelColor: string; levelBg: string; levelBorder: string;
}> = {
  1: { colorBand: "linear-gradient(90deg,#3d4de8,#7b97fa)", levelColor: "#3d4de8", levelBg: "#eef2ff", levelBorder: "#c7d2fe" },
  2: { colorBand: "linear-gradient(90deg,#059669,#34d399)", levelColor: "#059669", levelBg: "#ecfdf5", levelBorder: "#a7f3d0" },
  3: { colorBand: "linear-gradient(90deg,#7c3aed,#a78bfa)", levelColor: "#7c3aed", levelBg: "#f5f3ff", levelBorder: "#ddd6fe" },
  4: { colorBand: "linear-gradient(90deg,#ea580c,#fb923c)", levelColor: "#ea580c", levelBg: "#fff7ed", levelBorder: "#fed7aa" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  completed:   { label: "Completed",   color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  in_progress: { label: "In Progress", color: "#3d4de8", bg: "#eef2ff", border: "#c7d2fe" },
  not_started: { label: "Not Started", color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
};

export default function StudentCourses() {
  const { user, token, logout } = useAuth();
  const [mounted,  setMounted]  = useState(false);
  const [courses,  setCourses]  = useState<EnrolledCourse[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) return;
    const fetchCourses = async () => {
      try {
        const data = await coursesApi.getEnrolled(token);
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#3d4de8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

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

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>My Courses</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            {courses.length} courses enrolled · {courses.filter(c => c.status === "completed").length} completed
          </p>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, position: "relative", maxWidth: "360px" }}>
            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Search size={15} color="#94a3b8" />
            </div>
            <input
              type="text" placeholder="Search courses..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: "40px", paddingLeft: "36px", paddingRight: "16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,77,232,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "4px" }}>
            {[
              { value: "all",         label: "All"         },
              { value: "in_progress", label: "In Progress" },
              { value: "completed",   label: "Completed"   },
              { value: "not_started", label: "Not Started" },
            ].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                style={{ padding: "6px 14px", fontSize: "13px", fontWeight: 600, borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: filter === f.value ? "#3d4de8" : "transparent", color: filter === f.value ? "#ffffff" : "#64748b", transition: "all 0.15s" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ height: "360px", borderRadius: "20px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>No courses found</p>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {filtered.map((course) => {
              const colors = courseColors[course.id] || courseColors[1];
              const s      = statusConfig[course.status] || statusConfig["not_started"];
              return (
                <div key={course.id}
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s", display: "flex", flexDirection: "column" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: "5px", background: colors.colorBand }} />
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.5px" }}>{course.code}</span>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginTop: "3px" }}>{course.title}</h3>
                      </div>
                      <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {s.label}
                      </span>
                    </div>

                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "14px" }}>{course.description}</p>

                    {course.current_module && course.status !== "completed" && (
                      <div style={{ padding: "8px 12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", marginBottom: "14px" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Current: </span>
                        <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{course.current_module}</span>
                      </div>
                    )}

                    <div style={{ flex: 1 }} />

                    {/* Progress */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                          {course.completed_modules}/{course.total_modules} modules
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{course.progress}%</span>
                      </div>
                      <div style={{ height: "5px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "999px", width: `${course.progress}%`, background: colors.colorBand, transition: "width 0.6s ease" }} />
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                        <BookOpen size={12} /> {course.total_modules} modules
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                        <Clock size={12} /> {course.duration}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link href={`/student/courses/${course.id}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px", fontSize: "14px", fontWeight: 700, color: "#3d4de8", textDecoration: "none", borderRadius: "12px", backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3d4de8"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#3d4de8"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#eef2ff"; e.currentTarget.style.color = "#3d4de8"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                    >
                      {course.status === "completed"
                        ? <><CheckCircle size={15} /> Review Course</>
                        : course.status === "not_started"
                        ? <><PlayCircle size={15} /> Start Course</>
                        : <><ChevronRight size={15} /> Continue Learning</>
                      }
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}