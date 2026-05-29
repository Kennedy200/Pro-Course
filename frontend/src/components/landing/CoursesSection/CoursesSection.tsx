"use client";
import Link from "next/link";
import { BookOpen, Users, Clock, ChevronRight } from "lucide-react";

const courses = [
  {
    id: "data-structures",
    title: "Data Structures & Algorithms",
    code: "CSC 301",
    description: "Master arrays, linked lists, stacks, queues, trees, graphs, and sorting algorithms. Build the problem-solving foundation every software engineer needs.",
    modules: 8,
    level: "Intermediate",
    students: 142,
    duration: "6 weeks",
    colorBand: "linear-gradient(90deg, #3d4de8, #7b97fa)",
    levelBg: "#eef2ff",
    levelColor: "#3d4de8",
    levelBorder: "#c7d2fe",
    topics: ["Arrays & Strings", "Linked Lists", "Binary Trees", "Graph Traversal", "Sorting"],
  },
  {
    id: "computer-networks",
    title: "Computer Networks",
    code: "CSC 312",
    description: "Understand the OSI model, TCP/IP suite, routing protocols, HTTP/HTTPS, DNS, and network security fundamentals with real-world examples.",
    modules: 7,
    level: "Intermediate",
    students: 118,
    duration: "5 weeks",
    colorBand: "linear-gradient(90deg, #059669, #34d399)",
    levelBg: "#ecfdf5",
    levelColor: "#059669",
    levelBorder: "#a7f3d0",
    topics: ["OSI Model", "TCP/IP", "Routing", "Network Security", "HTTP & DNS"],
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    code: "CSC 320",
    description: "Explore process management, memory allocation, file systems, concurrency, deadlock resolution, and scheduling algorithms in depth.",
    modules: 9,
    level: "Advanced",
    students: 97,
    duration: "7 weeks",
    colorBand: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    levelBg: "#f5f3ff",
    levelColor: "#7c3aed",
    levelBorder: "#ddd6fe",
    topics: ["Process Management", "Memory", "File Systems", "Concurrency", "Scheduling"],
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    code: "CSC 340",
    description: "Learn SDLC models, requirements analysis, UML diagrams, testing strategies, version control workflows, and agile project management.",
    modules: 6,
    level: "Beginner",
    students: 163,
    duration: "4 weeks",
    colorBand: "linear-gradient(90deg, #ea580c, #fb923c)",
    levelBg: "#fff7ed",
    levelColor: "#ea580c",
    levelBorder: "#fed7aa",
    topics: ["SDLC Models", "Requirements", "UML Design", "Testing", "Agile & Scrum"],
  },
];

export function CoursesSection() {
  return (
    <section id="courses" style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            padding: "5px 14px", backgroundColor: "#eef2ff",
            border: "1px solid #c7d2fe", borderRadius: "999px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#3d4de8" }}>
              Real University Content
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900,
            color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1.1,
            marginBottom: "16px",
          }}>
            Undergraduate CS courses,{" "}
            <span style={{ color: "#3d4de8" }}>adapted to you</span>
          </h2>
          <p style={{
            fontSize: "17px", color: "#64748b", lineHeight: 1.7,
            maxWidth: "560px", margin: "0 auto", fontWeight: 400,
          }}>
            Not demo content. Actual Computer Science syllabus material
            structured into three adaptive learning tiers per module.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e8ecf4",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(15,23,42,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
              }}
            >
              {/* Color band */}
              <div style={{ height: "5px", background: course.colorBand }} />

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>

                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, color: "#94a3b8",
                      letterSpacing: "1px", textTransform: "uppercase",
                      fontFamily: "monospace",
                    }}>
                      {course.code}
                    </span>
                    <h3 style={{
                      fontSize: "16px", fontWeight: 800, color: "#0f172a",
                      lineHeight: 1.3, marginTop: "4px",
                    }}>
                      {course.title}
                    </h3>
                  </div>
                  <span style={{
                    padding: "4px 10px", fontSize: "11px", fontWeight: 700,
                    color: course.levelColor, backgroundColor: course.levelBg,
                    border: `1px solid ${course.levelBorder}`,
                    borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {course.level}
                  </span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: "14px", color: "#64748b", lineHeight: 1.7,
                  marginBottom: "16px", fontWeight: 400,
                }}>
                  {course.description}
                </p>

                {/* Topics */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {course.topics.map((t) => (
                    <span key={t} style={{
                      padding: "4px 10px", fontSize: "12px", fontWeight: 500,
                      color: "#475569", backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0", borderRadius: "8px",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Meta */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  borderTop: "1px solid #f1f5f9", paddingTop: "16px",
                  marginBottom: "16px",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                    <BookOpen size={13} /> {course.modules} Modules
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                    <Users size={13} /> {course.students} Students
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                    <Clock size={13} /> {course.duration}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "6px", padding: "11px", fontSize: "14px", fontWeight: 700,
                    color: "#3d4de8", textDecoration: "none", borderRadius: "12px",
                    backgroundColor: "#eef2ff", border: "1px solid #c7d2fe",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d4de8";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#eef2ff";
                    e.currentTarget.style.color = "#3d4de8";
                  }}
                >
                  Enroll & Start Learning <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 400 }}>
            Every course includes quiz-based assessments, three adaptive content levels,
            and AI-powered recommendations tailored to your progress.
          </p>
        </div>
      </div>
    </section>
  );
}