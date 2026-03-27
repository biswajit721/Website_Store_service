/**
 * LiveDemoModal
 * Tries to load the URL in an iframe. If the site blocks embedding
 * (X-Frame-Options / CSP frame-ancestors), shows a friendly fallback
 * with an "Open in New Tab" button instead of a broken grey box.
 *
 * Usage:
 *   import LiveDemoModal from "../components/LiveDemoModal";
 *   {show && <LiveDemoModal url={service.liveDemoUrl} onClose={() => setShow(false)} />}
 */

import { useState, useRef } from "react";
import { X, ExternalLink, Monitor, AlertTriangle, Loader } from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ldm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.82);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 20px;
    backdrop-filter: blur(8px);
    animation: ldmFade 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  @keyframes ldmFade { from{opacity:0} to{opacity:1} }

  .ldm-box {
    background: #161b27;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    width: 100%; max-width: 980px;
    max-height: 92vh;
    display: flex; flex-direction: column;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    animation: ldmUp 0.25s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  @keyframes ldmUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  /* HEAD */
  .ldm-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px; border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .ldm-head-left { display: flex; align-items: center; gap: 10px; }
  .ldm-url-badge {
    display: flex; align-items: center; gap: 7px;
    padding: 5px 12px; border-radius: 100px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    font-size: 12px; color: rgba(232,234,240,0.5);
    max-width: 360px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ldm-url-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; flex-shrink: 0; }
  .ldm-head-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #e8eaf0; }

  .ldm-head-actions { display: flex; align-items: center; gap: 8px; }
  .ldm-open-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 8px;
    background: #10b981; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
    border: none; cursor: pointer; transition: background 0.18s;
    text-decoration: none; white-space: nowrap;
  }
  .ldm-open-btn:hover { background: #059669; }

  .ldm-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: rgba(232,234,240,0.5); transition: all 0.16s;
  }
  .ldm-close:hover { background: rgba(255,255,255,0.1); color: #e8eaf0; }

  /* CONTENT AREA */
  .ldm-content { flex: 1; position: relative; min-height: 480px; }
  @media (max-width: 640px) { .ldm-content { min-height: 340px; } }

  /* LOADER */
  .ldm-loader {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; background: #1e2535;
    color: rgba(232,234,240,0.4); font-size: 13px;
    transition: opacity 0.3s;
  }
  .ldm-loader.hidden { opacity: 0; pointer-events: none; }
  .ldm-spin {
    animation: ldmSpin 0.9s linear infinite;
    color: #10b981;
  }
  @keyframes ldmSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* IFRAME */
  .ldm-iframe {
    width: 100%; height: 100%;
    border: none; display: block;
    position: absolute; inset: 0;
  }

  /* BLOCKED FALLBACK */
  .ldm-blocked {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0; padding: 32px; text-align: center;
    background: #1e2535;
  }
  .ldm-blocked-icon {
    width: 72px; height: 72px; border-radius: 18px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .ldm-blocked-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 700; color: #e8eaf0;
    margin-bottom: 10px;
  }
  .ldm-blocked-sub {
    font-size: 13.5px; color: rgba(139,147,168,0.8); line-height: 1.65;
    max-width: 400px; margin-bottom: 28px;
  }
  .ldm-blocked-url {
    font-size: 12px; color: rgba(139,147,168,0.45);
    background: rgba(255,255,255,0.04); padding: 6px 14px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.07); margin-bottom: 28px;
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ldm-blocked-cta {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 28px; border-radius: 10px;
    background: #10b981; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 3px 16px rgba(16,185,129,0.3);
    text-decoration: none;
  }
  .ldm-blocked-cta:hover { background: #059669; box-shadow: 0 5px 22px rgba(16,185,129,0.4); transform: translateY(-1px); }

  .ldm-blocked-note {
    margin-top: 18px; font-size: 11.5px;
    color: rgba(139,147,168,0.35); line-height: 1.5;
  }

  /* FOOTER */
  .ldm-foot {
    padding: 12px 22px; border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; flex-wrap: wrap; gap: 10px;
  }
  .ldm-foot-note { font-size: 11.5px; color: rgba(139,147,168,0.35); }
`;

export default function LiveDemoModal({ url, title = "Live Preview", onClose }) {
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "blocked"
  const iframeRef = useRef(null);

  // When iframe loads successfully
  const handleLoad = () => {
    // If the iframe was blocked, the browser fires onLoad but the contentDocument
    // is about:blank or inaccessible — we check by trying to see the location.
    // Most blocked iframes still fire onLoad with empty content.
    try {
      const doc = iframeRef.current?.contentDocument;
      // If we can access contentDocument and its URL is about:blank, it was blocked
      if (doc && (doc.URL === "about:blank" || doc.body?.innerHTML === "")) {
        setStatus("blocked");
      } else {
        setStatus("loaded");
      }
    } catch {
      // Cross-origin — we can't access the document, but it loaded = success
      setStatus("loaded");
    }
  };

  // onError fires if the network request itself fails
  const handleError = () => setStatus("blocked");

  // Detect X-Frame-Options block via a fetch-based check on mount
  // (doesn't always work due to CORS, but catches some cases early)
  // We rely mainly on the load/error handlers + a timeout fallback.
  const handleLoadWithTimeout = () => {
    // Give the iframe 4 seconds to show content; if it's still "loading", assume blocked
    setTimeout(() => {
      setStatus(prev => prev === "loading" ? "blocked" : prev);
    }, 4000);
  };

  return (
    <>
      <style>{S}</style>
      <div className="ldm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="ldm-box">

          {/* HEAD */}
          <div className="ldm-head">
            <div className="ldm-head-left">
              <span className="ldm-head-title">{title}</span>
              {url && (
                <div className="ldm-url-badge">
                  <span className="ldm-url-dot" />
                  {url}
                </div>
              )}
            </div>
            <div className="ldm-head-actions">
              <a
                href={url} target="_blank" rel="noreferrer"
                className="ldm-open-btn"
              >
                <ExternalLink size={13} strokeWidth={2} />
                Open in New Tab
              </a>
              <button className="ldm-close" onClick={onClose}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="ldm-content">

            {/* Loading spinner */}
            <div className={`ldm-loader${status !== "loading" ? " hidden" : ""}`}>
              <Loader size={28} className="ldm-spin" />
              <span>Loading preview…</span>
            </div>

            {/* Iframe — always rendered so onLoad fires */}
            {status !== "blocked" && (
              <iframe
                ref={iframeRef}
                src={url}
                className="ldm-iframe"
                title="Live Demo"
                onLoad={handleLoad}
                onError={handleError}
                ref={el => {
                  iframeRef.current = el;
                  if (el) handleLoadWithTimeout();
                }}
                style={{ opacity: status === "loaded" ? 1 : 0, transition: "opacity 0.3s" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            )}

            {/* Blocked fallback */}
            {status === "blocked" && (
              <div className="ldm-blocked">
                <div className="ldm-blocked-icon">
                  <AlertTriangle size={30} color="#f59e0b" strokeWidth={1.8} />
                </div>
                <div className="ldm-blocked-title">Preview Unavailable</div>
                <p className="ldm-blocked-sub">
                  This website has restricted embedding in iframes for security reasons.
                  You can still view the full demo by opening it directly in a new browser tab.
                </p>
                {url && <div className="ldm-blocked-url">{url}</div>}
                <a
                  href={url} target="_blank" rel="noreferrer"
                  className="ldm-blocked-cta"
                >
                  <ExternalLink size={16} strokeWidth={2} />
                  Open Demo in New Tab
                </a>
                <p className="ldm-blocked-note">
                  The demo is fully functional — this is only a browser security restriction.
                </p>
              </div>
            )}
          </div>

          {/* FOOT */}
          <div className="ldm-foot">
            <span className="ldm-foot-note">
              {status === "loaded" && "✓ Preview loaded successfully"}
              {status === "loading" && "Loading…"}
              {status === "blocked" && "Embedding blocked by the target website"}
            </span>
            {url && (
              <a href={url} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: "#10b981", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                <ExternalLink size={11} /> View full site
              </a>
            )}
          </div>

        </div>
      </div>
    </>
  );
}