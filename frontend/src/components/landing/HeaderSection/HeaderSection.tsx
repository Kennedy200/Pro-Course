"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, BookOpen, TrendingUp, Sparkles, Users, ArrowRight, CheckCircle } from "lucide-react";

export function HeaderSection() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ backgroundColor: "#f8faff", position: "relative", overflow: "hidden" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(248,250,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "0 32px",
          height: "64px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "relative",
        }}>

          {/* LEFT — Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
            <Image src="/logo.png" alt="ProCourse" width={32} height={32} style={{ borderRadius: "9px" }} />
            <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              Pro<span style={{ color: "#3d4de8" }}>Course</span>
            </span>
          </Link>

          {/* CENTER — Nav links, desktop only */}
          {!isMobile && (
            <nav style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: "2px",
            }}>
              {[
                { label: "Features",     href: "#features"     },
                { label: "Courses",      href: "#courses"      },
                { label: "How It Works", href: "#how-it-works" },
                { label: "About",        href: "#about"        },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    padding: "8px 16px", fontSize: "14px", fontWeight: 600,
                    color: "#64748b", textDecoration: "none", borderRadius: "8px",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#0f172a";
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

            {/* Desktop: Sign In + Get Started */}
            {!isMobile && (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "8px 16px", fontSize: "14px", fontWeight: 600,
                    color: "#64748b", textDecoration: "none", borderRadius: "8px",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#0f172a";
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: "9px 20px", fontSize: "14px", fontWeight: 700,
                    color: "#ffffff", textDecoration: "none", borderRadius: "10px",
                    backgroundColor: "#3d4de8",
                    boxShadow: "0 2px 8px rgba(61,77,232,0.28)",
                    transition: "all 0.15s", display: "inline-flex", alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3139d4";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(61,77,232,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d4de8";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(61,77,232,0.28)";
                  }}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile: hamburger only */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  padding: "8px", borderRadius: "10px", border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff", cursor: "pointer", color: "#64748b",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobile && (
          <div style={{
            maxHeight: menuOpen ? "420px" : "0px",
            overflow: "hidden", transition: "max-height 0.3s ease",
            backgroundColor: "#ffffff",
            borderTop: menuOpen ? "1px solid #f1f5f9" : "none",
          }}>
            <div style={{ padding: "12px 20px 20px" }}>
              {[
                { label: "Features",     href: "#features"     },
                { label: "Courses",      href: "#courses"      },
                { label: "How It Works", href: "#how-it-works" },
                { label: "About",        href: "#about"        },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block", padding: "11px 14px", fontSize: "14px",
                    fontWeight: 600, color: "#374151", textDecoration: "none",
                    borderRadius: "10px", marginBottom: "2px",
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div style={{
                borderTop: "1px solid #f1f5f9", marginTop: "10px",
                paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <Link
                  href="/login"
                  style={{
                    textAlign: "center", padding: "11px", fontSize: "14px",
                    fontWeight: 600, color: "#0f172a", textDecoration: "none",
                    borderRadius: "10px", backgroundColor: "#f8faff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  style={{
                    textAlign: "center", padding: "11px", fontSize: "14px",
                    fontWeight: 700, color: "#ffffff", textDecoration: "none",
                    borderRadius: "10px", backgroundColor: "#3d4de8",
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", position: "relative",
      }}>

        {/* Radial glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(61,77,232,0.07) 0%, transparent 70%)",
        }} />

        {/* Dot pattern */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none", opacity: 0.35,
          backgroundImage: "radial-gradient(rgba(61,77,232,0.18) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }} />

        <div style={{
          maxWidth: "820px", margin: "0 auto", padding: "0 24px",
          textAlign: "center", position: "relative", zIndex: 1,
        }}>

          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "6px 16px", backgroundColor: "#eef2ff",
            border: "1px solid #c7d2fe", borderRadius: "999px", marginBottom: "28px",
          }}>
            <Sparkles size={13} color="#3d4de8" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#3d4de8" }}>
              AI-Powered Adaptive Learning
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(42px, 6.5vw, 76px)", fontWeight: 900,
            color: "#0f172a", lineHeight: 1.04, letterSpacing: "-2.5px",
            marginBottom: "22px",
          }}>
            Learn Smarter,{" "}
            <span style={{ color: "#3d4de8", position: "relative", display: "inline-block" }}>
              Not Harder
              <svg
                style={{ position: "absolute", bottom: "-4px", left: "0", width: "100%", height: "8px" }}
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q50,0 100,5 Q150,10 200,4"
                  stroke="#c7d2fe" strokeWidth="3" fill="none" strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: "17px", color: "#64748b", lineHeight: 1.75,
            maxWidth: "540px", margin: "0 auto 40px", fontWeight: 400,
          }}>
            ProCourse adapts every module to your pace. Score low — get remedial
            content. Score high — advance faster. Your learning path,
            intelligently personalized.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "12px", flexWrap: "wrap", marginBottom: "52px",
          }}>
            <Link
              href="/register"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "13px 28px", fontSize: "15px", fontWeight: 700,
                color: "#ffffff", textDecoration: "none", borderRadius: "12px",
                backgroundColor: "#3d4de8", boxShadow: "0 4px 16px rgba(61,77,232,0.32)",
              }}
            >
              Start Learning Free <ArrowRight size={17} />
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "13px 28px", fontSize: "15px", fontWeight: 700,
                color: "#334155", textDecoration: "none", borderRadius: "12px",
                backgroundColor: "#ffffff", border: "1.5px solid #e2e8f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              Sign In to Continue
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "10px", flexWrap: "wrap", marginBottom: "60px",
          }}>
            {[
              { icon: BookOpen,   value: "4",    label: "Real Courses"    },
              { icon: TrendingUp, value: "3",    label: "Content Levels"  },
              { icon: Sparkles,   value: "AI",   label: "Adaptive Engine" },
              { icon: Users,      value: "100%", label: "Personalized"    },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "6px", padding: "16px 22px", backgroundColor: "#ffffff",
                border: "1px solid #e8ecf4", borderRadius: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)", minWidth: "108px",
              }}>
                <div style={{
                  width: "36px", height: "36px", backgroundColor: "#eef2ff",
                  borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color="#3d4de8" />
                </div>
                <span style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>{value}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.2px" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress card */}
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e8ecf4",
            borderRadius: "20px", padding: "22px 24px",
            boxShadow: "0 20px 48px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.04)",
            maxWidth: "460px", margin: "0 auto", textAlign: "left",
          }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #3d4de8 0%, #7b97fa 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <TrendingUp size={19} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                  Adaptive Path Active
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                  Data Structures & Algorithms · CSC 301
                </div>
              </div>
              <div style={{
                padding: "4px 10px", backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0", borderRadius: "999px",
                fontSize: "11px", fontWeight: 700, color: "#16a34a",
                display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap",
              }}>
                <span style={{
                  width: "6px", height: "6px", backgroundColor: "#22c55e",
                  borderRadius: "50%", display: "inline-block",
                }} />
                Proficient
              </div>
            </div>

            {/* Module rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Module 1: Arrays & Strings", pct: 100, status: "done"   },
                { label: "Module 2: Linked Lists",     pct: 75,  status: "active" },
                { label: "Module 3: Trees & Graphs",   pct: 0,   status: "locked" },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 800,
                    backgroundColor: m.status === "done" ? "#22c55e" : m.status === "active" ? "#3d4de8" : "#f1f5f9",
                    color: m.status === "locked" ? "#94a3b8" : "#fff",
                  }}>
                    {m.status === "done" ? "✓" : m.status === "active" ? "→" : "○"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
                      {m.label}
                    </div>
                    <div style={{ height: "5px", backgroundColor: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "999px", width: `${m.pct}%`,
                        background: m.status === "done"
                          ? "#22c55e"
                          : m.status === "active"
                          ? "linear-gradient(90deg, #3d4de8, #7b97fa)"
                          : "transparent",
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", minWidth: "30px", textAlign: "right" }}>
                    {m.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* AI chip */}
            <div style={{
              padding: "10px 14px", backgroundColor: "#eef2ff",
              borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <Sparkles size={14} color="#3d4de8" />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#3d4de8" }}>
                AI recommends: Review <strong>recursion</strong> before advancing to Module 3
              </span>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{
            marginTop: "32px", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "24px", flexWrap: "wrap",
          }}>
            {["No credit card required", "Free for students", "Instant access"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={14} color="#22c55e" />
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}