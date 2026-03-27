import axios from "axios";
import { Search, Menu, X, ChevronDown, Zap, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "./BaseUrl";
import { toast } from "sonner";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Read logged-in user from localStorage
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();
  const userName  = storedUser.fullname || storedUser.name || "User";
  const userEmail = storedUser.email || "";
  const initials  = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL.url}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.clear();
        setTimeout(() => { navigate("/login"); setOpen(false); }, 1800);
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 1000;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .nav-pill {
          max-width: 1120px;
          margin: 16px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 8px 0 20px;
          height: 60px;
          border-radius: 18px;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(18px) saturate(1.8);
          -webkit-backdrop-filter: blur(18px) saturate(1.8);
          border: 1px solid rgba(220,220,220,0.7);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
        }
        .nav-pill.scrolled {
          margin-top: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          border-color: rgba(200,200,200,0.6);
        }

        /* LOGO */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
          text-decoration: none;
        }
        .nav-logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(16,185,129,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-logo:hover .nav-logo-mark {
          transform: scale(1.07) rotate(-3deg);
          box-shadow: 0 4px 14px rgba(16,185,129,0.45);
        }
        .nav-logo-mark svg { color: #fff; }
        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.3px;
          color: #0f172a;
        }
        .nav-logo-text span { color: #10b981; }

        /* SEARCH */
        .nav-search {
          display: none;
          align-items: center;
          gap: 8px;
          flex: 1;
          max-width: 380px;
          height: 38px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1.5px solid transparent;
          background: #f4f4f5;
          transition: all 0.25s ease;
          cursor: text;
        }
        .nav-search.focused {
          background: #fff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }
        .nav-search svg { color: #9ca3af; flex-shrink: 0; transition: color 0.2s; }
        .nav-search.focused svg { color: #10b981; }
        .nav-search input {
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #0f172a;
          width: 100%;
        }
        .nav-search input::placeholder { color: #a1a1aa; }
        @media (min-width: 1024px) { .nav-search { display: flex; } }

        /* DESKTOP LINKS */
        .nav-links {
          display: none;
          align-items: center;
          gap: 2px;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: #52525b;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.18s, background 0.18s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: #0f172a; background: #f4f4f5; }
        .nav-link.active { color: #10b981; background: rgba(16,185,129,0.08); }

        /* DIVIDER */
        .nav-divider {
          width: 1px;
          height: 22px;
          background: #e4e4e7;
          margin: 0 4px;
        }

        /* AUTH BUTTONS */
        .nav-login-btn {
          font-size: 14px;
          font-weight: 500;
          color: #3f3f46;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.18s, background 0.18s;
          text-decoration: none;
          letter-spacing: 0.01em;
        }
        .nav-login-btn:hover { color: #0f172a; background: #f4f4f5; }

        .nav-cta-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          cursor: pointer;
          padding: 8px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(16,185,129,0.30);
          white-space: nowrap;
          text-decoration: none;
        }
        .nav-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(16,185,129,0.40);
          background: linear-gradient(135deg, #0ea875, #047857);
        }
        .nav-cta-btn:active { transform: translateY(0); }

        .nav-logout-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: #52525b;
          background: #f4f4f5;
          border: 1.5px solid #e4e4e7;
          cursor: pointer;
          padding: 7px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
        }
        .nav-logout-btn:hover {
          color: #ef4444;
          border-color: #fca5a5;
          background: #fef2f2;
        }

        /* PROFILE CHIP */
        .nav-profile-wrap { position: relative; }
        .nav-profile-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          background: #f4f4f5; border: 1.5px solid #e4e4e7;
          border-radius: 100px; cursor: pointer;
          transition: all 0.18s ease; user-select: none;
        }
        .nav-profile-chip:hover, .nav-profile-chip.open {
          background: #fff;
          border-color: rgba(16,185,129,0.4);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.08);
        }
        .nav-profile-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          color: #fff; flex-shrink: 0;
        }
        .nav-profile-name { font-size: 13px; font-weight: 500; color: #3f3f46; }
        .nav-profile-arrow { color: #a1a1aa; transition: transform 0.2s; }
        .nav-profile-chip.open .nav-profile-arrow { transform: rotate(180deg); }

        /* PROFILE DROPDOWN */
        .nav-profile-dd {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 240px; background: #fff;
          border: 1px solid rgba(220,220,220,0.8);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
          animation: navDdIn 0.18s cubic-bezier(0.4,0,0.2,1);
          z-index: 2000;
        }
        @keyframes navDdIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        .nav-dd-header {
          padding: 16px 16px 12px;
          border-bottom: 1px solid #f0f0f0;
          background: linear-gradient(135deg, rgba(16,185,129,0.04), transparent);
        }
        .nav-dd-av {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          color: #fff; margin-bottom: 10px;
          box-shadow: 0 3px 12px rgba(16,185,129,0.25);
        }
        .nav-dd-name { font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.2; margin-bottom: 2px; }
        .nav-dd-email { font-size: 11.5px; color: #a1a1aa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .nav-dd-body { padding: 6px; }
        .nav-dd-item {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 9px 12px; border-radius: 9px;
          font-size: 13px; color: #52525b; cursor: pointer;
          transition: all 0.14s; background: none; border: none;
          font-family: 'DM Sans', sans-serif; text-align: left; text-decoration: none;
        }
        .nav-dd-item:hover { background: #f4f4f5; color: #0f172a; }
        .nav-dd-item svg { color: #a1a1aa; flex-shrink: 0; transition: color 0.14s; }
        .nav-dd-item:hover svg { color: #52525b; }
        .nav-dd-sep { height: 1px; background: #f0f0f0; margin: 4px 6px; }
        .nav-dd-item-logout { color: #ef4444 !important; }
        .nav-dd-item-logout svg { color: rgba(239,68,68,0.6) !important; }
        .nav-dd-item-logout:hover { background: #fef2f2 !important; }

        /* MOBILE TOGGLE */
        .nav-mobile-toggle {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f4f4f5;
          border: none; cursor: pointer;
          color: #3f3f46;
          transition: background 0.18s;
          flex-shrink: 0;
        }
        .nav-mobile-toggle:hover { background: #e4e4e7; }
        @media (min-width: 768px) { .nav-mobile-toggle { display: none; } }

        /* MOBILE MENU */
        .nav-mobile-menu {
          max-width: 1120px;
          margin: 8px auto 0;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(220,220,220,0.7);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          animation: slideDown 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-mobile-search {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e4e4e7;
          background: #f9f9f9;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        .nav-mobile-search input {
          background: transparent; border: none; outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #0f172a; width: 100%;
        }
        .nav-mobile-search input::placeholder { color: #a1a1aa; }

        .nav-mobile-links { display: flex; flex-direction: column; gap: 2px; }
        .nav-mobile-link {
          font-size: 15px; font-weight: 500; color: #3f3f46;
          text-decoration: none; padding: 10px 12px; border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-mobile-link:hover { background: #f4f4f5; color: #0f172a; }
        .nav-mobile-link.active { background: rgba(16,185,129,0.09); color: #059669; }

        .nav-mobile-sep { height: 1px; background: #f0f0f0; margin: 12px 0; }

        .nav-mobile-actions { display: flex; flex-direction: column; gap: 8px; }
        .nav-mobile-login {
          font-size: 14.5px; font-weight: 500; color: #52525b;
          text-decoration: none; padding: 10px 12px; border-radius: 10px;
          transition: background 0.15s;
        }
        .nav-mobile-login:hover { background: #f4f4f5; color: #0f172a; }
        .nav-mobile-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff; font-size: 15px; font-weight: 600;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 3px 12px rgba(16,185,129,0.3);
          transition: opacity 0.2s;
          text-decoration: none;
        }
        .nav-mobile-cta:hover { opacity: 0.9; }
        .nav-mobile-logout {
          padding: 11px;
          border-radius: 12px;
          background: #fef2f2;
          color: #ef4444; font-size: 15px; font-weight: 600;
          border: 1.5px solid #fca5a5; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .nav-mobile-logout:hover { background: #fee2e2; }
      `}</style>

      <nav className="nav-root">
        <div className={`nav-pill${scrolled ? " scrolled" : ""}`}>

          {/* LOGO */}
          <div className="nav-logo" onClick={() => navigate("/")}>
            <div className="nav-logo-mark">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="nav-logo-text">
              Servi<span>ca</span>
            </span>
          </div>

          {/* SEARCH — desktop only */}
          <div
            ref={searchRef}
            className={`nav-search${searchFocused ? " focused" : ""}`}
            onClick={() => searchRef.current?.querySelector("input")?.focus()}
          >
            <Search size={15} strokeWidth={2.2} />
            <input
              type="text"
              placeholder="Search services, logos, apps…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* DESKTOP LINKS + AUTH */}
          <div className="nav-links">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="nav-divider" />

            {!token ? (
              <>
                <NavLink to="/login" className="nav-login-btn">
                  Log In
                </NavLink>
                <button
                  className="nav-cta-btn"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
              </>
            ) : (
              /* PROFILE CHIP + DROPDOWN */
              <div className="nav-profile-wrap" ref={profileRef}>
                <div
                  className={`nav-profile-chip${profileOpen ? " open" : ""}`}
                  onClick={() => setProfileOpen(o => !o)}
                >
                  <div className="nav-profile-avatar">{initials}</div>
                  <span className="nav-profile-name">{userName.split(" ")[0]}</span>
                  <ChevronDown size={13} className="nav-profile-arrow" strokeWidth={2} />
                </div>

                {profileOpen && (
                  <div className="nav-profile-dd">
                    <div className="nav-dd-header">
                      <div className="nav-dd-av">{initials}</div>
                      <div className="nav-dd-name">{userName}</div>
                      <div className="nav-dd-email">{userEmail}</div>
                    </div>
                    <div className="nav-dd-body">
                      <button className="nav-dd-item" onClick={() => { setProfileOpen(false); navigate("/profile"); }}>
                        <User size={14} strokeWidth={1.8} /> My Profile
                      </button>
                      <div className="nav-dd-sep" />
                      <button className="nav-dd-item nav-dd-item-logout" onClick={() => { setProfileOpen(false); handleLogout(); }}>
                        <LogOut size={14} strokeWidth={1.8} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="nav-mobile-menu">
            {/* Mobile Search */}
            <div className="nav-mobile-search">
              <Search size={15} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search services…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Links */}
            <div className="nav-mobile-links">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-mobile-link${isActive ? " active" : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="nav-mobile-sep" />

            {/* Mobile Auth */}
            <div className="nav-mobile-actions">
              {!token ? (
                <>
                  <NavLink
                    to="/login"
                    className="nav-mobile-login"
                    onClick={() => setOpen(false)}
                  >
                    Log In
                  </NavLink>
                  <button
                    className="nav-mobile-cta"
                    onClick={() => { navigate("/register"); setOpen(false); }}
                  >
                    Get Started →
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="nav-mobile-login"
                    style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left", padding:"10px 12px" }}
                    onClick={() => { navigate("/profile"); setOpen(false); }}
                  >
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{initials}</div>
                    <span style={{ fontSize:14, fontWeight:500, color:"#3f3f46" }}>{userName}</span>
                  </button>
                  <button className="nav-mobile-logout" onClick={() => { handleLogout(); setOpen(false); }}>
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}