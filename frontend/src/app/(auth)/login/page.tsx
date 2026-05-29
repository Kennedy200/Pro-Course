"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await login(email, password);  // ← FIXED: pass email, password directly
    // Router.push is handled inside AuthContext.login
  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  const fillDemo = (role: string) => {
    if (role === "student") {
      setEmail("student@demo.com");
      setPassword("demo1234");
    } else if (role === "lecturer") {
      setEmail("lecturer@demo.com");
      setPassword("demo1234");
    } else if (role === "admin") {
      setEmail("admin@demo.com");
      setPassword("demo1234");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image src="/logo.png" alt="ProCourse" width={40} height={40} style={{ borderRadius: "10px" }} />
            <span style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              Pro<span style={{ color: "#3d4de8" }}>Course</span>
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #e8ecf4" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginBottom: "8px", textAlign: "center" }}>Welcome Back</h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px", textAlign: "center" }}>Sign in to continue your learning journey</p>

          {error && (
            <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#dc2626", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: "100%", height: "48px", padding: "0 16px", fontSize: "15px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: "100%", height: "48px", padding: "0 16px", fontSize: "15px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3d4de8"; e.currentTarget.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8fafc"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", height: "48px", backgroundColor: loading ? "#94a3b8" : "#3d4de8", color: "#ffffff", fontSize: "15px", fontWeight: 700, border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#2d3ec8"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#3d4de8"; }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>
              Don't have an account?{" "}
              <Link href="/register" style={{ color: "#3d4de8", fontWeight: 600, textDecoration: "none" }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: "24px", backgroundColor: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e8ecf4" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "12px", textAlign: "center" }}>Quick Login (Demo Accounts)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { role: "student", label: "Student", color: "#3d4de8" },
              { role: "lecturer", label: "Lecturer", color: "#7c3aed" },
              { role: "admin", label: "Admin", color: "#059669" },
            ].map((demo) => (
              <button
                key={demo.role}
                onClick={() => fillDemo(demo.role)}
                style={{ padding: "10px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: demo.color, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#eef2ff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc"; }}
              >
                {demo.label}: {demo.role}@demo.com / demo1234
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}