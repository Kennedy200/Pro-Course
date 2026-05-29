"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen, TrendingUp, Award, LogOut, User,
  BarChart3, ArrowLeft, Clock, CheckCircle,
  Sparkles, ChevronRight, Brain, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { modulesApi, quizzesApi, aiApi, ModuleData, QuizData, QuizResult } from "@/lib/api";

type ContentLevel = "foundational" | "intermediate" | "advanced";
type Phase        = "reading" | "quiz" | "result";

const levelConfig = {
  foundational: { label: "Foundational", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  intermediate: { label: "Intermediate", color: "#3d4de8", bg: "#eef2ff", border: "#c7d2fe" },
  advanced:     { label: "Advanced",     color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};

export default function ModuleViewer() {
  const { user, token, logout } = useAuth();
  const params   = useParams();
  const router   = useRouter();
  const moduleId = Number(params.id);

  const [mounted,       setMounted]       = useState(false);
  const [moduleData,    setModuleData]    = useState<ModuleData | null>(null);
  const [quizData,      setQuizData]      = useState<QuizData | null>(null);
  const [quizResult,    setQuizResult]    = useState<QuizResult | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [phase,         setPhase]         = useState<Phase>("reading");
  const [contentLevel,  setContentLevel]  = useState<ContentLevel>("intermediate");
  const [contentBody,   setContentBody]   = useState<{ title: string; body: string } | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [answers,       setAnswers]       = useState<Record<string, string>>({});
  const [submitting,    setSubmitting]    = useState(false);
  const [timeSpent,     setTimeSpent]     = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setTimeSpent((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Track time every 30s
  useEffect(() => {
    if (!token || !moduleId || timeSpent === 0 || timeSpent % 30 !== 0) return;
    modulesApi.trackTime(moduleId, 30, token).catch(console.error);
  }, [timeSpent, token, moduleId]);

  // Fetch module
  useEffect(() => {
    if (!token || !moduleId) return;
    const fetchModule = async () => {
      try {
        const data = await modulesApi.get(moduleId, token);
        setModuleData(data);
        setContentLevel(data.current_level as ContentLevel);
        setContentBody(data.content);
      } catch (err) {
        console.error("Failed to load module:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [token, moduleId]);

  const handleLevelChange = async (level: ContentLevel) => {
    if (!token) return;
    setContentLoading(true);
    setContentLevel(level);
    try {
      const data = await modulesApi.getContentByLevel(moduleId, level, token);
      setContentBody({ title: data.title, body: data.body });
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setContentLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!token) return;
    try {
      const data = await quizzesApi.get(moduleId, token);
      setQuizData(data);
      setPhase("quiz");
    } catch (err) {
      console.error("Failed to load quiz:", err);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const result = await quizzesApi.submit(moduleId, answers, token);
      setQuizResult(result);
      setPhase("result");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#3d4de8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const lc = levelConfig[contentLevel];

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

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Link href="/student/courses" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Courses</Link>
          <ChevronRight size={14} color="#cbd5e1" />
          {moduleData && (
            <Link href={`/student/courses/${moduleData.course_id}`} style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Course</Link>
          )}
          <ChevronRight size={14} color="#cbd5e1" />
          <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>
            {moduleData?.title || "Loading..."}
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ height: "120px", borderRadius: "20px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: "400px", borderRadius: "20px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
          </div>
        ) : !moduleData ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Module not found</p>
            <Link href="/student/courses" style={{ color: "#3d4de8", fontWeight: 600, textDecoration: "none" }}>← Back</Link>
          </div>
        ) : (
          <>
            {/* ── READING PHASE ── */}
            {phase === "reading" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", alignItems: "start" }}>
                <div>
                  {/* Header */}
                  <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px 28px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>Module {moduleData.order}</span>
                      <span style={{ padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: lc.color, backgroundColor: lc.bg, border: `1px solid ${lc.border}`, borderRadius: "999px" }}>{lc.label} Level</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8", marginLeft: "auto" }}>
                        <Clock size={13} /> {formatTime(timeSpent)}
                      </span>
                    </div>
                    <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>{moduleData.title}</h1>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>Access count: {moduleData.progress.access_count} visits</p>
                  </div>

                  {/* Content */}
                  <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "28px", marginBottom: "20px" }}>
                    {contentLoading ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {Array(4).fill(0).map((_, i) => (
                          <div key={i} style={{ height: "20px", borderRadius: "6px", background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", width: i === 3 ? "60%" : "100%" }} />
                        ))}
                      </div>
                    ) : contentBody ? (
                      <>
                        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
                          {contentBody.title}
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          {contentBody.body.split("\n\n").filter(p => p.trim()).map((para, i) => (
                            <p key={i} style={{ fontSize: "15px", color: "#374151", lineHeight: 1.8, fontWeight: 400 }}>
                              {para.trim()}
                            </p>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Content not available for this level.</p>
                    )}
                  </div>

                  {/* Quiz button */}
                  {moduleData.has_quiz && (
                    <button onClick={handleStartQuiz}
                      style={{ width: "100%", padding: "16px", backgroundColor: "#3d4de8", color: "#ffffff", fontSize: "15px", fontWeight: 700, border: "none", borderRadius: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 14px rgba(61,77,232,0.3)", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#3139d4"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#3d4de8"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                      <Brain size={18} /> Take Module Quiz
                    </button>
                  )}
                </div>

                {/* Right sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Level selector */}
                  <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Sparkles size={15} color="#3d4de8" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Content Level</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", lineHeight: 1.5 }}>
                      AI recommended: <strong style={{ color: "#3d4de8" }}>{levelConfig[moduleData.current_level as ContentLevel]?.label || "Intermediate"}</strong>
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {(["foundational", "intermediate", "advanced"] as ContentLevel[]).map((lvl) => {
                        const cfg = levelConfig[lvl];
                        const isAvailable = moduleData.available_levels.includes(lvl);
                        return (
                          <button key={lvl} onClick={() => isAvailable && handleLevelChange(lvl)} disabled={!isAvailable}
                            style={{ padding: "10px 14px", borderRadius: "10px", border: `1px solid ${contentLevel === lvl ? cfg.border : "#e2e8f0"}`, backgroundColor: contentLevel === lvl ? cfg.bg : "transparent", color: contentLevel === lvl ? cfg.color : isAvailable ? "#64748b" : "#cbd5e1", fontSize: "13px", fontWeight: 600, cursor: isAvailable ? "pointer" : "not-allowed", textAlign: "left", transition: "all 0.15s", opacity: isAvailable ? 1 : 0.5 }}
                          >
                            {cfg.label}
                            {lvl === moduleData.current_level && <span style={{ fontSize: "10px", marginLeft: "6px", opacity: 0.7 }}>· AI recommended</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Module info */}
                  <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "18px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Module Info</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { label: "Time spent",   value: formatTime(moduleData.progress.time_spent + timeSpent) },
                        { label: "Access count", value: `${moduleData.progress.access_count} visits` },
                        { label: "Status",       value: moduleData.progress.is_completed ? "Completed ✓" : "In Progress" },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── QUIZ PHASE ── */}
            {phase === "quiz" && quizData && (
              <div style={{ maxWidth: "720px" }}>
                {/* Header */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px 28px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <Brain size={18} color="#3d4de8" />
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{quizData.title}</h2>
                  </div>
                  <p style={{ fontSize: "14px", color: "#64748b" }}>
                    Answer all {quizData.questions.length} questions. The AI engine will evaluate your score and adapt your learning path.
                  </p>
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{Object.keys(answers).length} of {quizData.questions.length} answered</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{Math.round((Object.keys(answers).length / quizData.questions.length) * 100)}%</span>
                    </div>
                    <div style={{ height: "4px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", backgroundColor: "#3d4de8", borderRadius: "999px", width: `${(Object.keys(answers).length / quizData.questions.length) * 100}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                  {quizData.questions.map((q, idx) => (
                    <div key={q.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "16px", padding: "20px 24px" }}>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "14px", lineHeight: 1.5 }}>
                        <span style={{ color: "#94a3b8", marginRight: "8px" }}>{idx + 1}.</span>{q.text}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {[
                          { key: "A", label: q.option_a },
                          { key: "B", label: q.option_b },
                          { key: "C", label: q.option_c },
                          { key: "D", label: q.option_d },
                        ].map((opt) => {
                          const isSelected = answers[String(q.id)] === opt.key;
                          return (
                            <button key={opt.key} onClick={() => setAnswers({ ...answers, [String(q.id)]: opt.key })}
                              style={{ padding: "12px 16px", borderRadius: "12px", border: `1.5px solid ${isSelected ? "#3d4de8" : "#e2e8f0"}`, backgroundColor: isSelected ? "#eef2ff" : "#f8fafc", color: isSelected ? "#3d4de8" : "#374151", fontSize: "14px", fontWeight: isSelected ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "10px" }}
                            >
                              <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${isSelected ? "#3d4de8" : "#e2e8f0"}`, backgroundColor: isSelected ? "#3d4de8" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: isSelected ? "#ffffff" : "#94a3b8", flexShrink: 0 }}>
                                {opt.key}
                              </span>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < quizData.questions.length || submitting}
                  style={{ width: "100%", padding: "16px", backgroundColor: Object.keys(answers).length < quizData.questions.length ? "#94a3b8" : "#3d4de8", color: "#ffffff", fontSize: "15px", fontWeight: 700, border: "none", borderRadius: "14px", cursor: Object.keys(answers).length < quizData.questions.length ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.15s" }}
                >
                  {submitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Submitting...
                    </>
                  ) : Object.keys(answers).length < quizData.questions.length
                    ? `Answer all questions (${quizData.questions.length - Object.keys(answers).length} remaining)`
                    : <><CheckCircle size={18} /> Submit Quiz & Get AI Results</>
                  }
                </button>
              </div>
            )}

            {/* ── RESULT PHASE ── */}
            {phase === "result" && quizResult && (
              <div style={{ maxWidth: "680px" }}>
                {/* Score card */}
                {(() => {
                  const resultStyles = {
                    struggling:     { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "📚", nextLabel: "Review Foundational Content" },
                    needs_practice: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "💪", nextLabel: "Review Intermediate Content" },
                    proficient:     { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "🎉", nextLabel: "View Next Module" },
                  };
                  const rs = resultStyles[quizResult.learning_state as keyof typeof resultStyles] || resultStyles.needs_practice;

                  return (
                    <>
                      {/* Score */}
                      <div style={{ backgroundColor: "#ffffff", border: `1px solid ${rs.border}`, borderRadius: "20px", padding: "32px", marginBottom: "20px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>{rs.icon}</div>
                        <div style={{ fontSize: "56px", fontWeight: 900, color: rs.color, marginBottom: "4px" }}>{quizResult.percentage}%</div>
                        <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px" }}>{quizResult.score} out of {quizResult.total} correct</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", backgroundColor: rs.bg, border: `1px solid ${rs.border}`, borderRadius: "999px", marginBottom: "16px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: rs.color }} />
                          <span style={{ fontSize: "14px", fontWeight: 700, color: rs.color, textTransform: "capitalize" }}>{quizResult.learning_state.replace("_", " ")}</span>
                        </div>
                        <p style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>{quizResult.message}</p>
                        {quizResult.ai_used && (
                          <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Sparkles size={13} color="#3d4de8" />
                            <span style={{ fontSize: "12px", color: "#3d4de8", fontWeight: 600 }}>Result determined by AI model</span>
                          </div>
                        )}
                      </div>

                      {/* Answer review */}
                      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "20px", padding: "24px", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Answer Review</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {quizResult.review.map((r, idx) => (
                            <div key={r.question_id} style={{ padding: "14px 16px", borderRadius: "12px", backgroundColor: r.is_correct ? "#f0fdf4" : "#fef2f2", border: `1px solid ${r.is_correct ? "#bbf7d0" : "#fecaca"}` }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "6px" }}>
                                <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: r.is_correct ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#ffffff", fontWeight: 800, flexShrink: 0 }}>
                                  {r.is_correct ? "✓" : "✗"}
                                </span>
                                <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.4 }}>{idx + 1}. {r.text}</p>
                              </div>
                              {!r.is_correct && (
                                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 32px" }}>
                                  Your answer: <strong style={{ color: "#ef4444" }}>{r.your_answer}</strong> · Correct: <strong style={{ color: "#22c55e" }}>{r.correct}</strong>
                                </p>
                              )}
                              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 0 32px", lineHeight: 1.5 }}>
                                <strong>Explanation:</strong> {r.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => { setPhase("reading"); setAnswers({}); handleLevelChange(quizResult.next_level as ContentLevel); }}
                          style={{ flex: 1, padding: "14px", backgroundColor: "#ffffff", color: "#3d4de8", fontSize: "14px", fontWeight: 700, border: "1px solid #c7d2fe", borderRadius: "12px", cursor: "pointer" }}
                        >
                          <ArrowLeft size={15} style={{ display: "inline", marginRight: "6px" }} />
                          {rs.nextLabel}
                        </button>
                        {quizResult.learning_state === "proficient" && moduleData && (
                          <Link href={`/student/courses/${moduleData.course_id}`}
                            style={{ flex: 1, padding: "14px", backgroundColor: "#3d4de8", color: "#ffffff", fontSize: "14px", fontWeight: 700, border: "none", borderRadius: "12px", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                          >
                            Next Module <ArrowRight size={15} />
                          </Link>
                        )}
                      </div>
                    </>
                  );
                })()}
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