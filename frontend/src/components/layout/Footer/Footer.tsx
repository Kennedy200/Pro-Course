"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, Globe, GitBranch } from "lucide-react";
import { footer } from "framer-motion/m";
import { use } from "react";

const footerLinks = {
  Platform: [
    { label: "Features",     href: "#features"     },
    { label: "Courses",      href: "#courses"      },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs"     },
    { label: "Help Center",   href: "/help"     },
    { label: "Research",      href: "/research" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms"   },
  ],
};

const socials = [
  { icon: Globe,     href: "#",                            label: "Website" },
  { icon: GitBranch, href: "#",                            label: "GitHub"  },
  { icon: Mail,      href: "mailto:hello@procourse.app",   label: "Email"   },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f172a" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 32px 40px" }}>

        {/* Top grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "64px",
        }}>

          {/* Brand col */}
          <div>
            <Link
              href="/"
              style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}
            >
              <Image
                src="/logo.png"
                alt="ProCourse"
                width={32}
                height={32}
                style={{ borderRadius: "9px" }}
              />
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                Pro<span style={{ color: "#7b97fa" }}>Course</span>
              </span>
            </Link>
            <p style={{
              fontSize: "14px", color: "#475569",
              lineHeight: 1.75, maxWidth: "260px",
              marginBottom: "24px",
            }}>
              An adaptive learning platform that personalizes your education
              journey based on your performance and interaction patterns.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#475569", textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#475569";
                  }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: "13px", fontWeight: 700, color: "#ffffff",
                marginBottom: "16px", letterSpacing: "0.3px",
              }}>
                {category}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "14px", color: "#475569",
                        textDecoration: "none", transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.07)",
          marginBottom: "28px",
        }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ fontSize: "13px", color: "#334155", fontWeight: 400 }}>
            © {new Date().getFullYear()} ProCourse. Built for Caleb University.
          </p>
          <p style={{ fontSize: "12px", color: "#1e293b", fontWeight: 400 }}>
            Final Year Project — Nwadigo Tobechukwu Uchechukwu · 22/10372
          </p>
        </div>
      </div>
    </footer>
  );
}