import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cta-root {
          position: relative;
          overflow: hidden;
          padding: 120px 24px;
          background: #0e0e0e;
          font-family: 'DM Sans', sans-serif;
        }

        /* Ambient orbs */
        .cta-orb-1 {
          position: absolute;
          top: -80px; left: -80px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-orb-2 {
          position: absolute;
          bottom: -100px; right: -60px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Thin decorative lines */
        .cta-line-h {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
        }
        .cta-line-h.top { top: 48px; }
        .cta-line-h.bottom { bottom: 48px; }

        .cta-inner {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 28px;
        }
        .cta-eyebrow::before,
        .cta-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #10b981;
          opacity: 0.6;
        }

        .cta-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 62px);
          font-weight: 600;
          line-height: 1.12;
          color: #f5f0eb;
          letter-spacing: -0.5px;
          margin-bottom: 24px;
        }
        .cta-heading em {
          font-style: italic;
          color: #10b981;
        }

        .cta-sub {
          font-size: 16px;
          font-weight: 300;
          color: rgba(245,240,235,0.55);
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 52px;
        }

        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: #10b981;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 0 0 rgba(16,185,129,0.4);
        }
        .cta-btn-primary:hover {
          background: #0ea875;
          box-shadow: 0 4px 24px rgba(16,185,129,0.35);
          transform: translateY(-1px);
        }
        .cta-btn-primary svg { transition: transform 0.2s ease; }
        .cta-btn-primary:hover svg { transform: translateX(3px); }

        .cta-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: transparent;
          color: rgba(245,240,235,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.03em;
          border: 1px solid rgba(245,240,235,0.15);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cta-btn-ghost:hover {
          background: rgba(245,240,235,0.06);
          border-color: rgba(245,240,235,0.3);
          color: #f5f0eb;
        }

        /* Social proof strip */
        .cta-proof {
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 48px;
        }
        .cta-proof-item {
          text-align: center;
        }
        .cta-proof-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: #f5f0eb;
          line-height: 1;
        }
        .cta-proof-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.35);
          margin-top: 6px;
        }
        .cta-proof-sep {
          width: 1px;
          height: 44px;
          background: rgba(255,255,255,0.08);
        }

        @media (max-width: 640px) {
          .cta-proof-sep { display: none; }
          .cta-proof { gap: 32px; }
        }
      `}</style>

      <section className="cta-root">
        <div className="cta-orb-1" />
        <div className="cta-orb-2" />
        <div className="cta-line-h top" />
        <div className="cta-line-h bottom" />

        <div className="cta-inner">
          <p className="cta-eyebrow">Start Your Project</p>

          <h2 className="cta-heading">
            Find the Perfect Design <br />
            for <em>Your Space</em>
          </h2>

          <p className="cta-sub">
            Browse hundreds of professionally curated packages, or speak directly
            with our design team for a bespoke consultation.
          </p>

          <div className="cta-actions">
            <button
              className="cta-btn-primary"
              onClick={() => navigate("/services")}
            >
              Browse All Designs
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <button  className="cta-btn-ghost"
            onClick={() => navigate("/contact")}
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              Talk to an Expert
            </button>
          </div>

          {/* Social proof */}
          <div className="cta-proof">
            <div className="cta-proof-item">
              <div className="cta-proof-num">500+</div>
              <div className="cta-proof-label">Design Packages</div>
            </div>
            <div className="cta-proof-sep" />
            <div className="cta-proof-item">
              <div className="cta-proof-num">1,200+</div>
              <div className="cta-proof-label">Happy Clients</div>
            </div>
            <div className="cta-proof-sep" />
            <div className="cta-proof-item">
              <div className="cta-proof-num">4.9★</div>
              <div className="cta-proof-label">Avg. Rating</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}