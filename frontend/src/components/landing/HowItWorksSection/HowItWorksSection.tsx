"use client";
import { FileText, PenSquare, Cpu, Unlock, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Enroll & Access Your First Module",
    description:
      "Browse available courses, enroll with one click, and immediately access your first learning module. Content is clean, structured, and easy to read — no clutter, no confusion.",
    iconBg: "#eef2ff",
    iconColor: "#3d4de8",
    iconBorder: "#c7d2fe",
    numColor: "#3d4de8",
  },
  {
    number: "02",
    icon: PenSquare,
    title: "Study the Material & Take the Quiz",
    description:
      "Read through module content at your own pace. The system quietly tracks time spent and completion status. When you're ready, take the end-of-module quiz.",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    iconBorder: "#fed7aa",
    numColor: "#ea580c",
  },
  {
    number: "03",
    icon: Cpu,
    title: "The AI Engine Evaluates Your Score",
    description:
      "A trained ML model analyses your quiz score alongside your interaction patterns — time on page, revisit count, access frequency — and determines your current learning state.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    iconBorder: "#bbf7d0",
    numColor: "#16a34a",
  },
  {
    number: "04",
    icon: Unlock,
    title: "Your Content Adapts Automatically",
    description:
      "Below 50%: foundational remedial content is unlocked. 50–70%: targeted practice exercises. Above 70%: the next module opens. No manual action required — it just happens.",
    iconBg: "#eef2ff",
    iconColor: "#3d4de8",
    iconBorder: "#c7d2fe",
    numColor: "#3d4de8",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Lecturers Monitor Everything",
    description:
      "Instructors see a live dashboard of class-wide progress, module-level struggle points, and individual student trajectories — giving them the data to intervene early and effectively.",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    iconBorder: "#fed7aa",
    numColor: "#ea580c",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: "#f8faff", padding: "96px 24px" }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            padding: "5px 14px", backgroundColor: "#eef2ff",
            border: "1px solid #c7d2fe", borderRadius: "999px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#3d4de8" }}>
              How It Works
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900,
            color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1,
            marginBottom: "16px",
          }}>
            Five steps from enrollment{" "}
            <span style={{ color: "#3d4de8" }}>to mastery</span>
          </h2>
          <p style={{
            fontSize: "17px", color: "#64748b", lineHeight: 1.7,
            maxWidth: "520px", margin: "0 auto", fontWeight: 400,
          }}>
            The entire adaptive learning loop — from first login to full
            module mastery — explained in five clear stages.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>

          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: "31px",
            top: "64px",
            bottom: "64px",
            width: "1px",
            backgroundColor: "#e2e8f0",
            zIndex: 0,
          }} />

          {steps.map((step, idx) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Step icon box */}
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: step.iconBg,
                border: `2px solid ${step.iconBorder}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                gap: "2px",
              }}>
                <step.icon size={18} color={step.iconColor} />
                <span style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: step.numColor,
                  letterSpacing: "0.5px",
                  fontFamily: "monospace",
                }}>
                  {step.number}
                </span>
              </div>

              {/* Content card */}
              <div style={{
                flex: 1,
                backgroundColor: "#ffffff",
                border: "1px solid #e8ecf4",
                borderRadius: "16px",
                padding: "20px 24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  lineHeight: 1.75,
                  fontWeight: 400,
                  margin: 0,
                }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}