import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, Zap } from "lucide-react"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #f5f0eb;
    --ink: #1a1814;
    --ink-soft: #4a4540;
    --ink-muted: #8a857f;
    --green: #10b981;
    --green-dark: #059669;
  }

  .footer-root {
    font-family: 'DM Sans', sans-serif;
    background: #0e0e0e;
    color: rgba(245,240,235,0.45);
    position: relative;
    overflow: hidden;
  }
  .footer-root::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent);
  }

  /* NEWSLETTER STRIP */
  .footer-nl {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 48px 24px;
  }
  .footer-nl-inner {
    max-width: 1120px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 24px;
  }
  .footer-nl-text {}
  .footer-nl-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--green); margin-bottom: 8px;
  }
  .footer-nl-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 600; color: var(--cream); line-height: 1.2;
  }

  .footer-nl-form {
    display: flex; gap: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; overflow: hidden;
    transition: border-color 0.2s;
  }
  .footer-nl-form:focus-within { border-color: rgba(16,185,129,0.4); }
  .footer-nl-input {
    padding: 12px 18px; background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px;
    color: var(--cream); width: 240px;
  }
  .footer-nl-input::placeholder { color: rgba(245,240,235,0.2); }
  .footer-nl-btn {
    padding: 12px 18px;
    background: var(--green); color: #fff;
    border: none; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .footer-nl-btn:hover { background: var(--green-dark); }
  .footer-nl-btn svg { transition: transform 0.18s; }
  .footer-nl-btn:hover svg { transform: translateX(2px); }

  /* MAIN GRID */
  .footer-main {
    padding: 64px 24px 48px;
    max-width: 1120px; margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
  }
  @media (max-width: 960px) { .footer-main { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 580px) { .footer-main { grid-template-columns: 1fr; } }

  /* BRAND */
  .footer-brand {}
  .footer-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .footer-logo-mark {
    width: 36px; height: 36px; border-radius: 9px;
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 10px rgba(16,185,129,0.3);
  }
  .footer-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--cream);
  }

  .footer-tagline {
    font-size: 13.5px; font-weight: 300; line-height: 1.75;
    color: rgba(245,240,235,0.38); max-width: 280px; margin-bottom: 28px;
  }

  .footer-socials { display: flex; gap: 8px; }
  .footer-social {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; color: rgba(245,240,235,0.4);
  }
  .footer-social:hover {
    background: rgba(16,185,129,0.12);
    border-color: rgba(16,185,129,0.3);
    color: var(--green);
  }

  /* COLUMNS */
  .footer-col-title {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--cream);
    margin-bottom: 20px;
  }
  .footer-col-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; }
  .footer-col-link {
    font-size: 13.5px; font-weight: 300; color: rgba(245,240,235,0.38);
    cursor: pointer; transition: color 0.18s; width: fit-content;
    position: relative;
  }
  .footer-col-link::after {
    content: ''; position: absolute;
    bottom: -1px; left: 0; right: 0; height: 1px;
    background: var(--green); transform: scaleX(0);
    transform-origin: left; transition: transform 0.2s ease;
  }
  .footer-col-link:hover { color: var(--cream); }
  .footer-col-link:hover::after { transform: scaleX(1); }

  /* BOTTOM */
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 24px;
  }
  .footer-bottom-inner {
    max-width: 1120px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .footer-copy { font-size: 12.5px; color: rgba(245,240,235,0.22); }
  .footer-credit { font-size: 12px; color: rgba(245,240,235,0.18); }
  .footer-credit span { color: #ef4444; }

  .footer-badges { display: flex; gap: 8px; }
  .footer-badge {
    font-size: 11px; padding: 4px 10px; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(245,240,235,0.25);
  }
`

const columns = [
  {
    title: "Services",
    links: ["Logo Design", "Web Development", "Mobile Apps", "UI/UX Design", "Branding"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"],
  },
  {
    title: "Support",
    links: ["Help Center", "Trust & Safety", "Terms of Service", "Privacy Policy", "Cookie Policy"],
  },
]

export default function Footer() {
  return (
    <>
      <style>{STYLES}</style>
      <footer className="footer-root">

        {/* NEWSLETTER */}
        {/* <div className="footer-nl">
          <div className="footer-nl-inner">
            <div className="footer-nl-text">
              <p className="footer-nl-eyebrow">Stay Inspired</p>
              <p className="footer-nl-title">Get design ideas in your inbox</p>
            </div>
            <div className="footer-nl-form">
              <input
                type="email"
                placeholder="your@email.com"
                className="footer-nl-input"
              />
              <button className="footer-nl-btn">
                Subscribe <ArrowRight size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div> */}

        {/* MAIN GRID */}
        <div className="footer-main">
          {/* BRAND */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-mark">
                <Zap size={17} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="footer-logo-name">Servica</span>
            </div>
            <p className="footer-tagline">
              Connect with talented design professionals and transform your space with
              premium, ready-to-execute interior packages.
            </p>
            <div className="footer-socials">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="footer-social">
                  <Icon size={15} strokeWidth={1.8} />
                </div>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}
          {columns.map(col => (
            <div key={col.title}>
              <p className="footer-col-title">{col.title}</p>
              <ul className="footer-col-links">
                {col.links.map(link => (
                  <li key={link} className="footer-col-link">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="footer-copy">© 2025 Servica. All rights reserved.</p>
            <div className="footer-badges">
              <span className="footer-badge">500+ Designs</span>
              <span className="footer-badge">4.9★ Rating</span>
            </div>
            <p className="footer-credit">
              Made with <span>♥</span> for interior lovers
            </p>
          </div>
        </div>

      </footer>
    </>
  )
}