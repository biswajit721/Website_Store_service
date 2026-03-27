import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Globe, MessageSquare, Palette,
  PenTool, Smartphone, Star, TrendingUp, Video,
  ArrowRight, Play, Clock, BadgeCheck,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../components/BaseUrl";
import CTASection from "./CTASection";
import LiveDemoModal from "../components/LiveDemoModel";

const iconMap = { Palette, Globe, Code2, Smartphone, Video, PenTool, TrendingUp, MessageSquare };

const HOME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #f5f0eb;
    --ink: #1a1814;
    --ink-soft: #4a4540;
    --ink-muted: #8a857f;
    --green: #10b981;
    --green-dark: #059669;
    --border: rgba(26,24,20,0.1);
  }

  .home-root { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: #faf7f4;
    padding-top: 96px;
    overflow: hidden;
  }
  @media (max-width: 1024px) { .hero { grid-template-columns: 1fr; min-height: auto; } }

  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 64px 80px 80px;
    position: relative;
  }
  @media (max-width: 1280px) { .hero-left { padding: 64px 40px; } }
  @media (max-width: 640px)  { .hero-left { padding: 48px 24px; } }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px 6px 6px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 100px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--green-dark);
    width: fit-content;
    margin-bottom: 32px;
    letter-spacing: 0.01em;
  }
  .hero-tag-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--green);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 4.5vw, 68px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: var(--ink);
    margin-bottom: 28px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--green);
  }

  .hero-desc {
    font-size: 16px;
    font-weight: 300;
    color: var(--ink-soft);
    line-height: 1.75;
    max-width: 440px;
    margin-bottom: 48px;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 64px;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px;
    background: var(--ink);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    letter-spacing: 0.02em;
    border: none; border-radius: 4px; cursor: pointer;
    transition: all 0.22s ease;
  }
  .btn-primary:hover { background: #2c2820; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,24,20,0.2); }
  .btn-primary svg { transition: transform 0.18s; }
  .btn-primary:hover svg { transform: translateX(3px); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px;
    background: transparent;
    color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    border: 1px solid var(--border);
    border-radius: 4px; cursor: pointer;
    transition: all 0.22s ease;
  }
  .btn-outline:hover { border-color: rgba(26,24,20,0.3); color: var(--ink); background: rgba(26,24,20,0.03); }

  .play-circle {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--ink);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .btn-outline:hover .play-circle { background: var(--green); }

  .hero-stats {
    display: flex;
    gap: 40px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 600;
    color: var(--ink); line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 12px; font-weight: 400;
    color: var(--ink-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Hero right */
  .hero-right {
    position: relative;
    background: #ede8e1;
    overflow: visible;
  }
  @media (max-width: 1024px) { .hero-right { height: 480px; } }

  .hero-right img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 8s ease;
  }
  /* clip only the image, not the float card */
  .hero-right-img-clip {
    position: absolute; inset: 0; overflow: hidden;
  }
  .hero-right:hover img { transform: scale(1.04); }

  /* Floating card */
  .hero-float-card {
    position: absolute;
    bottom: 32px; left: -24px;
    background: #fff;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    display: flex; align-items: center; gap: 14px;
    border: 1px solid rgba(0,0,0,0.06);
    animation: floatCard 3s ease-in-out infinite;
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  .hero-float-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #10b981, #059669);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hero-float-title { font-size: 14px; font-weight: 600; color: var(--ink); line-height: 1; margin-bottom: 3px; }
  .hero-float-sub   { font-size: 12px; color: var(--ink-muted); }

  /* ── CATEGORIES ── */
  .section-categories {
    padding: 120px 24px;
    background: var(--cream);
  }
  .section-header {
    text-align: center;
    margin-bottom: 72px;
  }
  .section-eyebrow {
    display: inline-block;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--green);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 3.5vw, 52px);
    font-weight: 600;
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -0.3px;
  }
  .section-sub {
    margin-top: 14px;
    font-size: 15px; font-weight: 300;
    color: var(--ink-muted);
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    max-width: 1120px;
    margin: 0 auto;
  }

  .cat-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .cat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(16,185,129,0.04), transparent);
    opacity: 0;
    transition: opacity 0.28s;
  }
  .cat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,24,20,0.10); border-color: rgba(16,185,129,0.25); }
  .cat-card:hover::before { opacity: 1; }

  .cat-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 12px;
    background: #f5f0eb;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    transition: background 0.22s;
  }
  .cat-card:hover .cat-icon-wrap { background: rgba(16,185,129,0.1); }
  .cat-card:hover .cat-icon-wrap svg { color: var(--green) !important; }

  .cat-name {
    font-size: 15px; font-weight: 600;
    color: var(--ink); margin-bottom: 6px;
  }
  .cat-desc { font-size: 13px; color: var(--ink-muted); line-height: 1.55; }

  /* ── SERVICES ── */
  .section-services {
    padding: 120px 24px;
    background: #faf7f4;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    max-width: 1120px;
    margin: 0 auto;
  }
  @media (max-width: 760px) {
    .services-grid { grid-template-columns: 1fr; }
  }

  .svc-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    cursor: pointer;
  }
  .svc-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(26,24,20,0.12); }

  .svc-img-wrap {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: #ede8e1;
  }
  .svc-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  .svc-card:hover .svc-img-wrap img { transform: scale(1.06); }

  .svc-badge {
    position: absolute;
    top: 16px;
    font-size: 11.5px; font-weight: 500;
    padding: 5px 12px;
    border-radius: 100px;
  }
  .svc-badge-cat {
    left: 16px;
    background: rgba(255,255,255,0.92);
    color: var(--ink-soft);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0,0,0,0.06);
  }
  .svc-badge-days {
    right: 16px;
    background: rgba(16,185,129,0.9);
    color: #fff;
    display: flex; align-items: center; gap: 5px;
    backdrop-filter: blur(8px);
  }

  .svc-discount {
    position: absolute;
    bottom: 16px; right: 16px;
    background: var(--ink);
    color: var(--cream);
    font-size: 11px; font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.04em;
  }

  .svc-body { padding: 24px; }

  .svc-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600;
    color: var(--ink);
    margin-bottom: 8px;
    line-height: 1.3;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .svc-desc {
    font-size: 13.5px; color: var(--ink-muted);
    line-height: 1.6;
    margin-bottom: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .svc-meta {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
  }
  .svc-rating {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: var(--ink-soft);
  }
  .svc-rating-star { color: #f59e0b; font-size: 14px; }
  .svc-rating-count { color: var(--ink-muted); font-size: 12px; }

  .svc-pricing { display: flex; align-items: baseline; gap: 8px; }
  .svc-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600;
    color: var(--ink); line-height: 1;
  }
  .svc-original { font-size: 13px; color: #c4bfba; text-decoration: line-through; }

  .svc-actions { display: flex; gap: 10px; }

  .svc-btn-preview {
    flex: 1; padding: 11px;
    background: var(--ink);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    border: none; border-radius: 6px; cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
  }
  .svc-btn-preview:hover { background: #2c2820; }

  .svc-btn-details {
    flex: 1; padding: 11px;
    background: transparent;
    color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    border: 1px solid var(--border);
    border-radius: 6px; cursor: pointer;
    transition: all 0.2s ease;
  }
  .svc-btn-details:hover { border-color: rgba(26,24,20,0.25); color: var(--ink); background: rgba(26,24,20,0.03); }

  /* ── MODAL — removed, now using LiveDemoModal component ── */
`;

// ─── HOW IT WORKS MODAL ──────────────────────────────────────────────────────
const HIW_CSS = `
  @keyframes hiwOverlayIn { from{opacity:0} to{opacity:1} }
  @keyframes hiwCardIn    { from{opacity:0;transform:translateY(-32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .hiw-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(26,24,20,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 80px 24px 40px;
    animation: hiwOverlayIn 0.22s ease;
    overflow-y: auto;
  }

  .hiw-card {
    background: #fff;
    border-radius: 22px;
    width: 100%; max-width: 680px;
    box-shadow: 0 32px 80px rgba(26,24,20,0.22);
    overflow: hidden;
    animation: hiwCardIn 0.3s cubic-bezier(0.34,1.4,0.64,1);
  }

  .hiw-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 26px 32px 22px;
    border-bottom: 1px solid rgba(26,24,20,0.08);
    background: linear-gradient(135deg, #faf7f4 0%, #fff 100%);
  }
  .hiw-head-left {}
  .hiw-eyebrow {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: #10b981; margin-bottom: 6px;
  }
  .hiw-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600; color: #1a1814; line-height: 1.15;
  }
  .hiw-title em { font-style: italic; color: #10b981; }

  .hiw-close {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: rgba(26,24,20,0.06); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #8a857f; transition: all 0.18s;
  }
  .hiw-close:hover { background: rgba(26,24,20,0.1); color: #1a1814; }

  .hiw-body { padding: 32px; }

  .hiw-steps { display: flex; flex-direction: column; }

  .hiw-step {
    display: flex; gap: 18px;
    opacity: 0; transform: translateY(10px);
    animation: hiwStepIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  @keyframes hiwStepIn { to { opacity:1; transform:translateY(0); } }

  /* stagger each step */
  .hiw-step:nth-child(1) { animation-delay: 0.08s; }
  .hiw-step:nth-child(2) { animation-delay: 0.16s; }
  .hiw-step:nth-child(3) { animation-delay: 0.24s; }
  .hiw-step:nth-child(4) { animation-delay: 0.32s; }
  .hiw-step:nth-child(5) { animation-delay: 0.40s; }
  .hiw-step:nth-child(6) { animation-delay: 0.48s; }

  .hiw-step-track { display: flex; flex-direction: column; align-items: center; }

  .hiw-num {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid rgba(16,185,129,0.3);
    background: rgba(16,185,129,0.06);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 600; color: #10b981;
    transition: all 0.2s;
  }
  .hiw-step:hover .hiw-num {
    background: #10b981; color: #fff; border-color: #10b981;
    box-shadow: 0 4px 14px rgba(16,185,129,0.3);
  }

  .hiw-connector {
    flex: 1; width: 1.5px; min-height: 28px;
    background: linear-gradient(to bottom, rgba(16,185,129,0.25), rgba(16,185,129,0.08));
    margin: 5px 0;
  }
  .hiw-step:last-child .hiw-connector { display: none; }

  .hiw-content { padding: 8px 0 28px 4px; flex: 1; }
  .hiw-step:last-child .hiw-content { padding-bottom: 0; }

  .hiw-step-title {
    font-size: 15px; font-weight: 600; color: #1a1814;
    margin-bottom: 4px; line-height: 1.3;
    transition: color 0.18s;
  }
  .hiw-step:hover .hiw-step-title { color: #10b981; }

  .hiw-step-desc { font-size: 13px; color: #8a857f; line-height: 1.6; }

  .hiw-step-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    margin-top: 8px;
    transition: all 0.2s;
  }
  .hiw-step:hover .hiw-step-icon { background: rgba(16,185,129,0.14); }

  /* footer */
  .hiw-foot {
    padding: 18px 32px;
    background: #faf7f4;
    border-top: 1px solid rgba(26,24,20,0.07);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .hiw-foot-note { font-size: 12.5px; color: #8a857f; }
  .hiw-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; border-radius: 8px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; border: none; cursor: pointer;
    box-shadow: 0 2px 10px rgba(16,185,129,0.28); transition: all 0.2s;
  }
  .hiw-cta-btn:hover { box-shadow: 0 4px 18px rgba(16,185,129,0.4); transform: translateY(-1px); }

  /* bullet points inside each step */
  .hiw-bullets {
    display: flex; flex-direction: column; gap: 6px;
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid rgba(26,24,20,0.06);
  }
  .hiw-bullet {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12.5px; color: #6b6560; line-height: 1.5;
  }
  .hiw-bullet-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981; flex-shrink: 0; margin-top: 6px;
  }
`;

const HIW_STEPS = [
  {
    title: "Choose Your Design",
    desc: "Browse our curated collection of 500+ professionally crafted interior packages.",
    icon: "🎨",
    bullets: [
      "Filter by room type, style, or budget",
      "Preview live demos before committing",
      "Compare packages side-by-side",
      "Save favourites for later review",
    ],
  },
  {
    title: "Submit Your Request",
    desc: "Tell us about your space and vision through our simple consultation form.",
    icon: "📋",
    bullets: [
      "Share room dimensions and photos",
      "Describe your style preferences",
      "Set your timeline and budget",
      "Our team reviews every request personally within 24h",
    ],
  },
  {
    title: "Schedule a Meeting",
    desc: "Book a free one-on-one consultation — online or at your location.",
    icon: "📅",
    bullets: [
      "Pick a time that suits your schedule",
      "Choose online video call or in-person visit",
      "Discuss specific requirements in detail",
      "Get expert recommendations on the call",
    ],
  },
  {
    title: "Start Working on Project",
    desc: "Our design experts begin crafting your fully personalised interior plan.",
    icon: "⚡",
    bullets: [
      "Dedicated designer assigned to your project",
      "3D renders and mood boards created",
      "Material, furniture & lighting lists prepared",
      "Regular progress updates shared with you",
    ],
  },
  {
    title: "Project Delivered",
    desc: "Receive your complete, execution-ready design package on or before deadline.",
    icon: "📦",
    bullets: [
      "Full layout plans and floor drawings",
      "Detailed execution and installation guide",
      "Vendor contacts and purchase links included",
      "Revisions covered within the package",
    ],
  },
  {
    title: "Ongoing Maintenance",
    desc: "We stay with you long after delivery — your space evolves, and so do we.",
    icon: "🛡️",
    bullets: [
      "Seasonal refresh consultations available",
      "Priority support for any design queries",
      "Updates as your needs or tastes change",
      "Annual review sessions with your designer",
    ],
  },
];



function HowItWorksModal({ onClose }) {
  // close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <>
      <style>{HIW_CSS}</style>
      <div className="hiw-overlay" onClick={handleBackdrop}>
        <div className="hiw-card">

          {/* HEAD */}
          <div className="hiw-head">
            <div className="hiw-head-left">
              <p className="hiw-eyebrow">Our Process</p>
              <h2 className="hiw-title">How It <em>Works</em></h2>
            </div>
            <button className="hiw-close" onClick={onClose}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* STEPS */}
          <div className="hiw-body">
            <div className="hiw-steps">
              {HIW_STEPS.map((step, i) => (
                <div key={i} className="hiw-step">
                  <div className="hiw-step-track">
                    <div className="hiw-num">{i + 1}</div>
                    <div className="hiw-connector" />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                    <div className="hiw-content">
                      <div className="hiw-step-title">{step.title}</div>
                      <div className="hiw-step-desc">{step.desc}</div>
                      {step.bullets && (
                        <div className="hiw-bullets">
                          {step.bullets.map((b, j) => (
                            <div key={j} className="hiw-bullet">
                              <span className="hiw-bullet-dot" />
                              {b}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="hiw-step-icon">{step.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOT */}
          <div className="hiw-foot">
            <span className="hiw-foot-note">Ready to transform your space?</span>
            <button className="hiw-cta-btn" onClick={onClose}>
              Get Started <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function Home() {
  const [category, setCategory]     = useState([]);
  const [services, setServices]     = useState([]);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoUrl, setDemoUrl]             = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const navigate = useNavigate();

  const fetchCategpory = async () => {
    try {
      const res = await axios.get(`${BASE_URL.url}/category`, { withCredentials: true });
      if (res.data.success) setCategory(res.data.category);
    } catch (e) { console.error(e); }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL.url}/service`, { withCredentials: true });
      if (res.data.success) setServices(res.data.service);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchCategpory();
    fetchServices();
  }, []);

  const openDemo = (url) => {
    setDemoUrl(url || "https://maker-lane-co.lovable.app/");
    setShowDemoModal(true);
  };

  // Encode service data into URL so right-click → "Open in new tab" works
  const encodeService = (service) => {
    try { return btoa(encodeURIComponent(JSON.stringify(service))); } catch { return ""; }
  };
  const getServiceHref = (service) => {
    const encoded = encodeService(service);
    return encoded ? `/service-details?d=${encoded}` : "/service-details";
  };

  return (
    <>
      <style>{HOME_STYLES}</style>
      <div className="home-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-left">
            <span className="hero-tag">
              <span className="hero-tag-dot">✦</span>
              500+ Designs Available
            </span>

            <h1 className="hero-title">
              Curated Interior<br />
              Designs for <em>Every</em><br />
              Living Space
            </h1>

            <p className="hero-desc">
              Professionally crafted packages with fixed pricing,
              fast timelines, and instant previews — no guesswork, just results.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/services")}>
                Explore Designs <ArrowRight size={15} strokeWidth={2} />
              </button>
              <button className="btn-outline" onClick={() => setShowHowItWorks(true)}>
                <span className="play-circle">
                  <Play size={13} fill="#fff" color="#fff" />
                </span>
                How It Works
              </button>
            </div>

            <div className="hero-stats">
              {[
                { num: "500+", label: "Designs" },
                { num: "1,000+", label: "Happy Clients" },
                { num: "4.9★", label: "Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-right-img-clip">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
                alt="Luxury interior design"
              />
            </div>
            <div className="hero-float-card">
              <div className="hero-float-icon">
                <BadgeCheck size={20} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <div className="hero-float-title">Starting from ₹3,999</div>
                <div className="hero-float-sub">Ready-made packages</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section-categories">
          <div className="section-header">
            <span className="section-eyebrow">Browse by Style</span>
            <h2 className="section-title">Design Categories</h2>
            <p className="section-sub">Browse by room type or package</p>
          </div>

          <div className="categories-grid">
            {category.map((item, i) => {
              const Icon = iconMap[item.icon] || Code2;
              return (
                <div
                  key={i}
                  className="cat-card"
                  onClick={() => navigate("/services", { state: { category: item.name } })}
                >
                  <div className="cat-icon-wrap">
                    <Icon size={22} color="#6b6560" strokeWidth={1.8} />
                  </div>
                  <div className="cat-name">{item.name}</div>
                  <div className="cat-desc">{item.count || item.description}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="section-services">
          <div className="section-header">
            <span className="section-eyebrow">Curated Packages</span>
            <h2 className="section-title">Featured Design Packages</h2>
            <p className="section-sub">Ready-to-execute interiors with transparent pricing</p>
          </div>

          <div className="services-grid">
            {services.map((service, i) => {
              const discount = service.originalPrice && service.basePrice
                ? Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100)
                : null;

              return (
                // <a> wrapper enables right-click → "Open in new tab" natively.
                // Left-click is intercepted by onClick to use React Router (no reload).
                <a
                  key={i}
                  href={getServiceHref(service)}
                  onClick={(e) => { e.preventDefault(); navigate("/service-details", { state: service }); }}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="svc-card">
                    <div className="svc-img-wrap">
                      <img
                        src={service.image?.[0]}
                        alt={service.title}
                      />
                      {service.category && (
                        <span className="svc-badge svc-badge-cat">{service.category}</span>
                      )}
                      {service.deliveryTime && (
                        <span className="svc-badge svc-badge-days">
                          <Clock size={11} strokeWidth={2} />
                          {service.deliveryTime} Days
                        </span>
                      )}
                      {discount && (
                        <span className="svc-discount">{discount}% OFF</span>
                      )}
                    </div>

                    <div className="svc-body">
                      <h3 className="svc-title">{service.title}</h3>
                      <p className="svc-desc">{service.description}</p>

                      <div className="svc-meta">
                        <div className="svc-rating">
                          <span className="svc-rating-star">★</span>
                          {service.rating || 4.8}
                          <span className="svc-rating-count">({service.totalReviews || 32})</span>
                        </div>
                        <div className="svc-pricing">
                          <span className="svc-price">₹{service.basePrice}</span>
                          {service.originalPrice && (
                            <span className="svc-original">₹{service.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="svc-actions">
                        <button
                          className="svc-btn-preview"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDemo(service.liveDemoUrl); }}
                        >
                          Live Preview
                        </button>
                        <button
                          className="svc-btn-details"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate("/service-details", { state: service }); }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── DEMO MODAL ── */}
        {showDemoModal && (
          <LiveDemoModal
            url={demoUrl}
            title="Live Preview"
            onClose={() => setShowDemoModal(false)}
          />
        )}

        {/* ── HOW IT WORKS MODAL ── */}
        {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}

        <CTASection />
      </div>
    </>
  );
}

export default Home;