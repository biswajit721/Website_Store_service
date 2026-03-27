import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Boxes, Users, ShoppingCart,
  Calendar, Tag, LifeBuoy, Bell, FileText,
  Settings, Search, Zap, ArrowLeft, Menu, X,
  ChevronRight, Clock, LogOut, User, Shield,
  ChevronDown, Mail, Phone,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/BaseUrl";
import { toast } from "sonner";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
    --sidebar-w:240px;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .al-root { display:flex; min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }
  .al-sidebar { width:var(--sidebar-w); flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:200; transition:transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .al-sidebar.closed { transform:translateX(calc(-1 * var(--sidebar-w))); }
  .al-logo { display:flex; align-items:center; gap:10px; padding:22px 20px 20px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .al-logo-mark { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--green),var(--green-dk)); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(16,185,129,0.3); flex-shrink:0; }
  .al-logo-text { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:var(--text); line-height:1; }
  .al-logo-sub  { font-size:11px; color:var(--t3); margin-top:2px; }
  .al-nav { flex:1; padding:16px 12px; overflow-y:auto; scrollbar-width:none; }
  .al-nav::-webkit-scrollbar { display:none; }
  .al-nav-group { margin-bottom:6px; }
  .al-nav-group-label { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--t3); padding:0 10px; margin-bottom:6px; margin-top:18px; }
  .al-nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; font-size:13.5px; font-weight:400; color:var(--t2); text-decoration:none; cursor:pointer; transition:all 0.18s ease; margin-bottom:2px; white-space:nowrap; }
  .al-nav-item:hover { background:var(--s2); color:var(--text); }
  .al-nav-item.active { background:var(--green-dim); color:var(--green); font-weight:500; border:1px solid rgba(16,185,129,0.15); }
  .al-nav-item.active svg { color:var(--green); }
  .al-nav-item svg { flex-shrink:0; color:var(--t3); transition:color 0.18s; }
  .al-nav-item:hover svg { color:var(--t2); }
  .al-nav-badge { margin-left:auto; font-size:10.5px; font-weight:600; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); padding:1px 7px; border-radius:100px; }
  .al-sidebar-foot { padding:14px 12px; border-top:1px solid var(--border); flex-shrink:0; }
  .al-back-btn { display:flex; align-items:center; gap:9px; width:100%; padding:9px 12px; border-radius:10px; background:transparent; border:1px solid var(--border); color:var(--t2); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.18s; text-decoration:none; }
  .al-back-btn:hover { background:var(--s2); color:var(--text); border-color:var(--border2); }
  .al-main { flex:1; display:flex; flex-direction:column; margin-left:var(--sidebar-w); min-width:0; transition:margin-left 0.28s cubic-bezier(0.4,0,0.2,1); }
  .al-main.sidebar-closed { margin-left:0; }
  .al-topbar { display:flex; align-items:center; justify-content:space-between; padding:0 28px; height:64px; flex-shrink:0; background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; gap:16px; }
  .al-topbar-left { display:flex; align-items:center; gap:14px; }
  .al-menu-toggle { width:34px; height:34px; border-radius:9px; background:var(--s2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--t2); transition:all 0.18s; }
  .al-menu-toggle:hover { background:var(--s3); color:var(--text); }
  .al-breadcrumb { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--t3); }
  .al-breadcrumb-current { color:var(--text); font-weight:500; }
  .al-search-wrap { display:flex; align-items:center; gap:8px; background:var(--s2); border:1px solid var(--border); border-radius:10px; padding:0 14px; flex:1; max-width:320px; transition:border-color 0.2s; }
  .al-search-wrap:focus-within { border-color:var(--border2); }
  .al-search-input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:8px 4px; width:100%; }
  .al-search-input::placeholder { color:var(--t3); }
  .al-topbar-right { display:flex; align-items:center; gap:10px; }
  .al-topbar-btn { width:36px; height:36px; border-radius:10px; background:var(--s2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--t2); transition:all 0.18s; position:relative; }
  .al-topbar-btn:hover { background:var(--s3); color:var(--text); }
  .al-notif-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:50%; background:var(--green); border:1.5px solid var(--surface); }
  .al-profile-wrap { position:relative; }
  .al-admin-chip { display:flex; align-items:center; gap:8px; padding:5px 10px 5px 5px; background:var(--s2); border:1px solid var(--border); border-radius:100px; cursor:pointer; transition:all 0.18s; user-select:none; }
  .al-admin-chip:hover, .al-admin-chip.open { background:var(--s3); border-color:var(--border2); }
  .al-admin-avatar { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, var(--green), var(--green-dk)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:11px; font-weight:700; color:#fff; flex-shrink:0; }
  .al-admin-info { display:flex; flex-direction:column; }
  .al-admin-name-text { font-size:12.5px; font-weight:600; color:var(--text); line-height:1.2; }
  .al-admin-role-text { font-size:10.5px; color:var(--t3); line-height:1; margin-top:1px; }
  .al-chip-arrow { color:var(--t3); transition:transform 0.2s; flex-shrink:0; }
  .al-admin-chip.open .al-chip-arrow { transform:rotate(180deg); }
  .al-dropdown { position:absolute; top:calc(100% + 10px); right:0; width:272px; background:var(--surface); border:1px solid var(--border2); border-radius:16px; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.55); z-index:500; animation:ddSlide 0.18s cubic-bezier(0.4,0,0.2,1); }
  @keyframes ddSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .al-dd-profile { padding:20px 18px 16px; border-bottom:1px solid var(--border); }
  .al-dd-av-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
  .al-dd-avatar { width:48px; height:48px; border-radius:13px; flex-shrink:0; background:linear-gradient(135deg, var(--green), var(--green-dk)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#fff; box-shadow:0 4px 14px rgba(16,185,129,0.3); }
  .al-dd-full-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--text); margin-bottom:5px; }
  .al-dd-role-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:100px; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); font-size:11px; font-weight:500; }
  .al-dd-meta { display:flex; flex-direction:column; gap:7px; }
  .al-dd-meta-row { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--t2); }
  .al-dd-meta-row svg { color:var(--t3); flex-shrink:0; }
  .al-dd-meta-val { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .al-dd-actions { padding:8px; }
  .al-dd-btn { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border-radius:9px; font-size:13px; color:var(--t2); cursor:pointer; transition:all 0.15s; background:none; border:none; font-family:'DM Sans',sans-serif; text-align:left; }
  .al-dd-btn:hover { background:var(--s2); color:var(--text); }
  .al-dd-btn svg { color:var(--t3); flex-shrink:0; transition:color 0.15s; }
  .al-dd-btn:hover svg { color:var(--t2); }
  .al-dd-sep { height:1px; background:var(--border); margin:4px 8px; }
  .al-dd-btn-logout { color:var(--red) !important; }
  .al-dd-btn-logout svg { color:rgba(239,68,68,0.7) !important; }
  .al-dd-btn-logout:hover { background:var(--red-dim) !important; color:var(--red) !important; }
  .al-dd-btn-logout:hover svg { color:var(--red) !important; }
  .al-content { flex:1; overflow:auto; }
  .al-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:150; backdrop-filter:blur(3px); animation:alFadeIn 0.2s ease; }
  @keyframes alFadeIn { from{opacity:0} to{opacity:1} }
  @media (max-width: 768px) {
    .al-sidebar { transform:translateX(calc(-1 * var(--sidebar-w))); }
    .al-sidebar.open { transform:translateX(0); }
    .al-main { margin-left:0 !important; }
    .al-search-wrap { display:none; }
    .al-admin-info, .al-chip-arrow { display:none; }
  }
`;

const NAV_GROUPS = [
  { label: "Core", items: [
    { to: "/admin",            icon: LayoutDashboard, text: "Overview",        end: true },
    { to: "/admin/services",   icon: Boxes,           text: "Services" },
    { to: "/admin/users",      icon: Users,           text: "Users" },
    { to: "/admin/categories", icon: Tag,             text: "Categories" },
  ]},
  { label: "Meetings", items: [
    { to: "/admin/meetings",   icon: Calendar, text: "Contact Meetings" },
    { to: "/admin/scheduling", icon: Clock,    text: "Scheduled Calls" },
  ]},
  { label: "Commerce", items: [
    { to: "/admin/orders", icon: ShoppingCart, text: "Orders" },
  ]},
  { label: "System", items: [
    { to: "/admin/support",       icon: LifeBuoy, text: "Support" },
    { to: "/admin/notifications", icon: Bell,     text: "Notifications", badge: "3" },
    { to: "/admin/reports",       icon: FileText, text: "Reports" },
    { to: "/admin/settings",      icon: Settings, text: "Settings" },
  ]},
];

const ROUTE_LABELS = {
  "/admin": "Overview", "/admin/services": "Services",
  "/admin/services/edit": "Edit Service", "/admin/users": "Users",
  "/admin/categories": "Categories", "/admin/meetings": "Contact Meetings",
  "/admin/scheduling": "Scheduled Calls", "/admin/orders": "Orders",
  "/admin/support": "Support", "/admin/notifications": "Notifications",
  "/admin/reports": "Reports", "/admin/settings": "Settings",
  "/admin/profile": "My Profile",
};

export default function AdminLayout() {
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dropdownOpen,      setDropdownOpen]      = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropRef  = useRef(null);

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const adminName   = storedUser.fullname || storedUser.name || "Admin";
  const adminEmail  = storedUser.email    || "—";
  const adminMobile = storedUser.mobile   || storedUser.phone || null;
  const adminRole   = storedUser.role     || "admin";
  const initials    = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const pageLabel   = ROUTE_LABELS[location.pathname] || "Admin";
  const isMobile    = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const closeMobile = () => setMobileSidebarOpen(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL.url}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
    } catch {}
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 800);
  };

  const Sidebar = (
    <aside className={`al-sidebar${isMobile ? (mobileSidebarOpen ? " open" : "") : (sidebarOpen ? "" : " closed")}`}>
      <div className="al-logo">
        <div className="al-logo-mark"><Zap size={17} color="#fff" strokeWidth={2.5} /></div>
        <div><div className="al-logo-text">Servica</div><div className="al-logo-sub">Admin Panel</div></div>
      </div>
      <nav className="al-nav">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="al-nav-group">
            <div className="al-nav-group-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end}
                onClick={isMobile ? closeMobile : undefined}
                className={({ isActive }) => `al-nav-item${isActive ? " active" : ""}`}>
                <item.icon size={16} strokeWidth={1.8} />
                {item.text}
                {item.badge && <span className="al-nav-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="al-sidebar-foot">
        <a href="/" className="al-back-btn"><ArrowLeft size={14} strokeWidth={2} /> Back to Site</a>
      </div>
    </aside>
  );

  return (
    <>
      <style>{S}</style>
      <div className="al-root">
        {Sidebar}
        {mobileSidebarOpen && <div className="al-overlay" onClick={closeMobile} />}
        <main className={`al-main${sidebarOpen ? "" : " sidebar-closed"}`}>
          <div className="al-topbar">
            <div className="al-topbar-left">
              <button className="al-menu-toggle" onClick={() => { if (isMobile) setMobileSidebarOpen(o => !o); else setSidebarOpen(o => !o); }}>
                {(isMobile ? mobileSidebarOpen : sidebarOpen) ? <X size={16} /> : <Menu size={16} />}
              </button>
              <div className="al-breadcrumb">
                <span>Admin</span><ChevronRight size={13} />
                <span className="al-breadcrumb-current">{pageLabel}</span>
              </div>
            </div>
            <div className="al-search-wrap">
              <Search size={14} color="var(--t3)" />
              <input className="al-search-input" placeholder="Search anything…" />
            </div>
            <div className="al-topbar-right">
              <div className="al-topbar-btn"><Bell size={16} strokeWidth={1.8} /><span className="al-notif-dot" /></div>
              <div className="al-profile-wrap" ref={dropRef}>
                <div className={`al-admin-chip${dropdownOpen ? " open" : ""}`} onClick={() => setDropdownOpen(o => !o)}>
                  <div className="al-admin-avatar">{initials}</div>
                  <div className="al-admin-info">
                    <div className="al-admin-name-text">{adminName.split(" ")[0]}</div>
                    <div className="al-admin-role-text">{adminRole}</div>
                  </div>
                  <ChevronDown size={13} className="al-chip-arrow" strokeWidth={2} />
                </div>

                {dropdownOpen && (
                  <div className="al-dropdown">
                    <div className="al-dd-profile">
                      <div className="al-dd-av-row">
                        <div className="al-dd-avatar">{initials}</div>
                        <div>
                          <div className="al-dd-full-name">{adminName}</div>
                          <div className="al-dd-role-badge"><Shield size={10} strokeWidth={2.5} />{adminRole.charAt(0).toUpperCase() + adminRole.slice(1)}</div>
                        </div>
                      </div>
                      <div className="al-dd-meta">
                        <div className="al-dd-meta-row"><Mail size={12} strokeWidth={1.8} /><span className="al-dd-meta-val">{adminEmail}</span></div>
                        {adminMobile && <div className="al-dd-meta-row"><Phone size={12} strokeWidth={1.8} /><span className="al-dd-meta-val">{adminMobile}</span></div>}
                      </div>
                    </div>
                    <div className="al-dd-actions">
                      {/* My Profile → /admin/profile */}
                      <button className="al-dd-btn" onClick={() => { setDropdownOpen(false); navigate("/admin/profile"); }}>
                        <User size={14} strokeWidth={1.8} /> My Profile
                      </button>
                      <button className="al-dd-btn" onClick={() => { setDropdownOpen(false); navigate("/"); }}>
                        <ArrowLeft size={14} strokeWidth={1.8} /> Back to Site
                      </button>
                      <div className="al-dd-sep" />
                      <button className="al-dd-btn al-dd-btn-logout" onClick={handleLogout}>
                        <LogOut size={14} strokeWidth={1.8} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="al-content"><Outlet /></div>
        </main>
      </div>
    </>
  );
}