"use client";
import { Brain, Target, BarChart3, Layers, GraduationCap, ShieldCheck, Zap, BookMarked } from "lucide-react";
import { use } from "react";

const features = [
  {
    icon: Brain,
    title: "AI Adaptation Engine",
    description: "A trained ML classifier analyzes your quiz scores, time-on-module, and revisit frequency to predict your learning state and route you to exactly the right content.",
    bg: "#eef2ff",
    iconColor: "#3d4de8",
    border: "#c7d2fe",
    large: true,
  },
  {
    icon: Target,
    title: "Rule-Based Routing",
    description: "Below 50% triggers remedial content, 50–70% serves practice exercises, above 70% unlocks the next module. Transparent, fair, instant.",
    bg: "#fff7ed",
    iconColor: "#ea580c",
    border: "#fed7aa",
    large: false,
  },
  {
    icon: BarChart3,
    title: "Live Lecturer Analytics",
    description: "Real-time dashboards showing class completion rates, per-module struggle zones, and at-risk students.",
    bg: "#f0fdf4",
    iconColor: "#16a34a",
    border: "#bbf7d0",
    large: false,
  },
  {
    icon: Layers,
    title: "3-Tier Content Levels",
    description: "Every module has Foundational, Intermediate, and Advanced layers. Students only ever see what they need.",
    bg: "#eef2ff",
    iconColor: "#3d4de8",
    border: "#c7d2fe",
    large: false,
  },
  {
    icon: GraduationCap,
    title: "Real University Courses",
    description: "Actual undergraduate CS content: Data Structures, Computer Networks, Operating Systems, and Software Engineering.",
    bg: "#fff7ed",
    iconColor: "#ea580c",
    border: "#fed7aa",
    large: false,
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Three distinct portals — Admin governs the platform, Lecturers manage courses, Students navigate their personalized paths.",
    bg: "#f0fdf4",
    iconColor: "#16a34a",
    border: "#bbf7d0",
    large: false,
  },
  {
    icon: Zap,
    title: "Instant Post-Quiz Feedback",
    description: "The moment a quiz is submitted, the system scores it, determines the student's learning state, and adapts the content path in real time.",
    bg: "#eef2ff",
    iconColor: "#3d4de8",
    border: "#c7d2fe",
    large: false,
  },
  {
    icon: BookMarked,
    title: "Full Interaction History",
    description: "Every page visit, time-on-content, and completion event is recorded. Your history makes every future recommendation smarter.",
    bg: "#fff7ed",
    iconColor: "#ea580c",
    border: "#fed7aa",
    large: false,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" style={{ backgroundColor: "#f8faff", padding: "96px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", backgroundColor: "#eef2ff",
            border: "1px solid #c7d2fe", borderRadius: "999px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#3d4de8" }}>
              Platform Capabilities
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900,
            color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1,
            marginBottom: "16px",
          }}>
            Everything you need to{" "}
            <span style={{ color: "#3d4de8" }}>learn effectively</span>
          </h2>
          <p style={{
            fontSize: "17px", color: "#64748b", lineHeight: 1.7,
            maxWidth: "560px", margin: "0 auto", fontWeight: 400,
          }}>
            ProCourse combines adaptive learning science with clean engineering
            to deliver a platform that genuinely responds to each student.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {features.map((f, idx) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${f.border}`,
                borderRadius: "20px",
                padding: "28px",
                transition: "all 0.2s ease",
                cursor: "default",
                gridColumn: idx === 0 ? "span 2" : "span 1",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(15,23,42,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                backgroundColor: f.bg, border: `1px solid ${f.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
              }}>
                <f.icon size={20} color={f.iconColor} />
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "15px", fontWeight: 700, color: "#0f172a",
                marginBottom: "8px", lineHeight: 1.4,
              }}>
                {f.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: "14px", color: "#64748b",
                lineHeight: 1.7, fontWeight: 400,
              }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}