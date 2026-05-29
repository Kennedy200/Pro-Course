"use client";
import { GraduationCap, Sparkles, BookOpen, Users, Award } from "lucide-react";

export function CTASection() {
  return (
    <section id="about" style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          backgroundColor: "#0f172a",
          borderRadius: "28px",
          padding: "72px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Background glow blobs */}
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "280px", height: "280px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(61,77,232,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "-60px",
            width: "280px", height: "280px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Dot pattern */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: "none", opacity: 0.06,
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>

            {/* Icon */}
            <div style={{
              width: "64px", height: "64px", borderRadius: "18px",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <GraduationCap size={28} color="#ffffff" />
            </div>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              marginBottom: "20px",
            }}>
              <Sparkles size={13} color="#7b97fa" />
              <span style={{
                fontSize: "12px", fontWeight: 700, color: "#7b97fa",
                letterSpacing: "1.5px", textTransform: "uppercase",
              }}>
                Adaptive Learning Platform
              </span>
              <Sparkles size={13} color="#7b97fa" />
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900,
              color: "#ffffff", letterSpacing: "-1.5px", lineHeight: 1.1,
              marginBottom: "20px",
            }}>
              Built for students who{" "}
              <span style={{
                background: "linear-gradient(135deg, #7b97fa 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                refuse to fall behind
              </span>
            </h2>

            {/* Subtext */}
            <p style={{
              fontSize: "17px", color: "rgba(255,255,255,0.5)",
              lineHeight: 1.75, maxWidth: "540px",
              margin: "0 auto 48px", fontWeight: 400,
            }}>
              ProCourse doesn't treat every student the same. It watches how
              you learn, where you struggle, and what you've mastered — then
              builds a path that's uniquely yours.
            </p>

            {/* Stats row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "12px", flexWrap: "wrap", marginBottom: "48px",
            }}>
              {[
                { icon: BookOpen, value: "4",    label: "CS Courses"       },
                { icon: Users,    value: "500+",  label: "Active Students"  },
                { icon: Award,    value: "3",     label: "Content Levels"   },
                { icon: Sparkles, value: "AI",    label: "Powered Engine"   },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "6px", padding: "20px 28px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", minWidth: "110px",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    backgroundColor: "rgba(61,77,232,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} color="#7b97fa" />
                  </div>
                  <span style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>
                    {value}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.3px" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              width: "100%", height: "1px",
              backgroundColor: "rgba(255,255,255,0.08)",
              marginBottom: "28px",
            }} />

            {/* Fine print */}
            <p style={{
              fontSize: "13px", color: "rgba(255,255,255,0.2)",
              fontWeight: 400, lineHeight: 1.6,
            }}>
              Final Year Project · Caleb University, Department of Computer Science · 2026
              <br />
              Nwadigo Tobechukwu Uchechukwu · 22/10372
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}