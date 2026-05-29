"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Role = "student" | "lecturer";

export default function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]                 = useState<Role>("student");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    matricNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        role,
        matric_number: role === "student" ? form.matricNumber : undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <header style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image src="/logo.png" alt="ProCourse" width={32} height={32} style={{ borderRadius: "9px" }} />
          <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
            Pro<span style={{ color: "#3d4de8" }}>Course</span>
          </span>
        </Link>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#3d4de8", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e8ecf4", borderRadius: "24px", padding: "40px", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #3d4de8, #7b97fa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 14px rgba(61,77,232,0.3)" }}>
                <Sparkles size={22} color="#ffffff" />
              </div>
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.8px", marginBottom: "8px" }}>
                Create your account
              </h1>
              <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 400 }}>
                Start your personalized learning journey today
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Role selector */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                I am a...
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { value: "student"  as Role, label: "Student",  icon: GraduationCap, desc: "I want to learn" },
                  { value: "lecturer" as Role, label: "Lecturer", icon: BookOpen,      desc: "I want to teach" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    style={{ padding: "14px", borderRadius: "14px", cursor: "pointer", border: role === r.value ? "2px solid #3d4de8" : "2px solid #e2e8f0", backgroundColor: role === r.value ? "#eef2ff" : "#f8fafc", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
                  >
                    <r.icon size={20} color={role === r.value ? "#3d4de8" : "#94a3b8"} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: role === r.value ? "#3d4de8" : "#374151" }}>{r.label}</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Full Name */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><User size={16} color="#94a3b8" /></div>
                  <input
                    type="text" placeholder="John Doe" value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} required
                    style={{ width: "100%", height: "46px", paddingLeft: "42px", paddingRight: "16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", outline: "none", transition: "all 0.15s", boxSizing: "border-box" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,77,232,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Matric — students only */}
              {role === "student" && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Matric Number</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><ShieldCheck size={16} color="#94a3b8" /></div>
                    <input
                      type="text" placeholder="e.g. 22/10372" value={form.matricNumber}
                      onChange={(e) => setForm({ ...form, matricNumber: e.target.value })} required
                      style={{ width: "100%", height: "46px", paddingLeft: "42px", paddingRight: "16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", outline: "none", transition: "all 0.15s", boxSizing: "border-box" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,77,232,0.1)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Mail size={16} color="#94a3b8" /></div>
                  <input
                    type="email" placeholder="you@university.edu" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required
                    style={{ width: "100%", height: "46px", paddingLeft: "42px", paddingRight: "16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", outline: "none", transition: "all 0.15s", boxSizing: "border-box" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,77,232,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Lock size={16} color="#94a3b8" /></div>
                  <input
                    type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required minLength={8}
                    style={{ width: "100%", height: "46px", paddingLeft: "42px", paddingRight: "46px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", outline: "none", transition: "all 0.15s", boxSizing: "border-box" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,77,232,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{ width: "100%", height: "48px", backgroundColor: loading ? "#94a3b8" : "#3d4de8", color: "#ffffff", fontSize: "15px", fontWeight: 700, border: "none", borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.15s", boxShadow: loading ? "none" : "0 4px 14px rgba(61,77,232,0.3)", marginTop: "6px" }}
                onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.backgroundColor = "#3139d4"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.backgroundColor = "#3d4de8"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; } }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>

              <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>
                By creating an account you agree to our{" "}
                <Link href="/terms" style={{ color: "#3d4de8", textDecoration: "none", fontWeight: 600 }}>Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "#3d4de8", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>
              </p>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#3d4de8", fontWeight: 700, textDecoration: "none" }}>Sign in instead</Link>
          </p>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}