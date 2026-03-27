import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import {
  User, Mail, Phone, Shield, Save,
  ArrowLeft, Pencil, X, Check,
} from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
  }

  .ap { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; padding:36px 32px 80px; }

  .ap-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:12px; }
  .ap-header-left { display:flex; align-items:center; gap:12px; }
  .ap-back { display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:9px; background:var(--s2); border:1px solid var(--border); color:var(--t2); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.18s; }
  .ap-back:hover { background:var(--s3); color:var(--text); }
  .ap-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:var(--text); }
  .ap-sub   { font-size:13px; color:var(--t2); margin-top:2px; }

  .ap-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; border:none; cursor:pointer; transition:all 0.2s; }
  .ap-btn-green { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.25); }
  .ap-btn-green:hover { background:var(--green-dk); transform:translateY(-1px); }
  .ap-btn-green:disabled { opacity:0.5; pointer-events:none; }
  .ap-btn-ghost { background:var(--s2); color:var(--t2); border:1px solid var(--border); }
  .ap-btn-ghost:hover { background:var(--s3); color:var(--text); }

  .ap-layout { display:grid; grid-template-columns:280px 1fr; gap:24px; align-items:start; max-width:900px; }
  @media(max-width:800px) { .ap-layout { grid-template-columns:1fr; } }

  /* AVATAR CARD */
  .ap-avatar-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; text-align:center; }
  .ap-avatar {
    width:96px; height:96px; border-radius:24px; margin:0 auto 16px;
    background:linear-gradient(135deg, var(--green), var(--green-dk));
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-size:36px; font-weight:700; color:#fff;
    box-shadow:0 6px 24px rgba(16,185,129,0.35);
  }
  .ap-avatar-name { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:var(--text); margin-bottom:6px; }
  .ap-avatar-role { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:100px; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); font-size:12px; font-weight:500; margin-bottom:20px; }

  .ap-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .ap-stat { background:var(--s2); border:1px solid var(--border); border-radius:10px; padding:12px; text-align:center; }
  .ap-stat-val { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:var(--text); line-height:1; }
  .ap-stat-lbl { font-size:11px; color:var(--t3); text-transform:uppercase; letter-spacing:0.07em; margin-top:4px; }

  /* FORM CARD */
  .ap-form-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .ap-form-head { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid var(--border); }
  .ap-form-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:600; color:var(--text); }
  .ap-form-sub   { font-size:12px; color:var(--t3); margin-top:2px; }
  .ap-form-body  { padding:24px; }

  .ap-field { margin-bottom:20px; }
  .ap-field:last-child { margin-bottom:0; }
  .ap-label { font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--t3); margin-bottom:7px; display:block; }

  /* VIEW ROW */
  .ap-view-row { display:flex; align-items:center; gap:12px; padding:11px 14px; background:var(--s2); border:1px solid var(--border); border-radius:10px; }
  .ap-view-icon { color:var(--t3); flex-shrink:0; }
  .ap-view-val  { font-size:13.5px; color:var(--text); flex:1; }
  .ap-view-empty { color:var(--t3); font-style:italic; }

  /* EDIT INPUT */
  .ap-input-wrap { display:flex; align-items:center; background:var(--s2); border:1px solid var(--border); border-radius:10px; padding:0 14px; transition:border-color 0.18s, box-shadow 0.18s; }
  .ap-input-wrap:focus-within { border-color:var(--green); box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
  .ap-input-wrap.disabled-wrap { opacity:0.5; cursor:not-allowed; }
  .ap-input-icon { color:var(--t3); flex-shrink:0; margin-right:10px; transition:color 0.18s; }
  .ap-input-wrap:focus-within .ap-input-icon { color:var(--green); }
  .ap-input { width:100%; padding:11px 0; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13.5px; color:var(--text); }
  .ap-input::placeholder { color:var(--t3); }
  .ap-input:disabled { color:var(--t3); cursor:not-allowed; }

  .ap-divider { height:1px; background:var(--border); margin:24px 0; }
  .ap-section-title { font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); margin-bottom:16px; }
  .ap-readonly-note { font-size:11px; color:var(--t3); margin-top:5px; }
  .ap-changed { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid rgba(245,158,11,0.2); font-size:11.5px; font-weight:500; }
`;

// ─── CRITICAL FIX ────────────────────────────────────────────────────────────
// Field is defined OUTSIDE the component. When defined inside, React treats it
// as a new component type on every render → input unmounts/remounts → focus lost.
// ─────────────────────────────────────────────────────────────────────────────
function ViewRow({ icon: Icon, value }) {
  return (
    <div className="ap-view-row">
      <Icon size={15} className="ap-view-icon" strokeWidth={1.8} />
      <span className={`ap-view-val${!value ? " ap-view-empty" : ""}`}>
        {value || "Not set"}
      </span>
    </div>
  );
}

function EditInput({ icon: Icon, name, value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <div className={`ap-input-wrap${disabled ? " disabled-wrap" : ""}`}>
      <Icon size={15} className="ap-input-icon" strokeWidth={1.8} />
      <input
        className="ap-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
}

export default function AdminProfile() {
  const navigate = useNavigate();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const initialForm = {
    fullname: stored.fullname || stored.name || "",
    email:    stored.email    || "",
    mobile:   stored.mobile   || stored.phone || "",
  };

  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [form,       setForm]       = useState(initialForm);

  const token   = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const role    = stored.role || "admin";
  const userId  = stored.id   || stored._id;
  const initials = (form.fullname || "A").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Stable onChange — won't cause Field remount
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }, []);

  const handleCancel = () => {
    setForm(initialForm);
    setHasChanges(false);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.fullname.trim()) { toast.error("Full name is required"); return; }
    const mobile = form.mobile.replace(/\s/g, "");
    if (mobile && !/^\d{10}$/.test(mobile)) {
      toast.error("Mobile must be exactly 10 digits"); return;
    }
    setSaving(true);
    try {
      const res = await axios.put(
        `${BASE_URL.url}/auth/${userId}`,
        { fullname: form.fullname.trim(), mobile: form.mobile.trim() },
        { headers, withCredentials: true }
      );
      if (res.data.success) {
        const updated = { ...stored, fullname: form.fullname.trim(), mobile: form.mobile.trim() };
        localStorage.setItem("user", JSON.stringify(updated));
        toast.success("Profile updated successfully");
        setHasChanges(false);
        setEditing(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="ap">

        {/* HEADER */}
        <div className="ap-header">
          <div className="ap-header-left">
            <button className="ap-back" onClick={() => navigate("/admin")}>
              <ArrowLeft size={14} strokeWidth={2} /> Dashboard
            </button>
            <div>
              <div className="ap-title">My Profile</div>
              <div className="ap-sub">View and update your account details</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {hasChanges && (
              <span className="ap-changed">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />
                Unsaved changes
              </span>
            )}
            {!editing ? (
              <button className="ap-btn ap-btn-green" onClick={() => setEditing(true)}>
                <Pencil size={14} strokeWidth={2} /> Edit Profile
              </button>
            ) : (
              <>
                <button className="ap-btn ap-btn-ghost" onClick={handleCancel}>
                  <X size={14} /> Cancel
                </button>
                <button className="ap-btn ap-btn-green" onClick={handleSave} disabled={saving}>
                  <Save size={14} strokeWidth={2} />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="ap-layout">

          {/* AVATAR SIDEBAR */}
          <div>
            <div className="ap-avatar-card">
              <div className="ap-avatar">{initials}</div>
              <div className="ap-avatar-name">{form.fullname || "Admin"}</div>
              <div className="ap-avatar-role">
                <Shield size={11} strokeWidth={2.5} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
              {/* <div className="ap-stat-grid">
                <div className="ap-stat">
                  <div className="ap-stat-val">—</div>
                  <div className="ap-stat-lbl">Services</div>
                </div>
                <div className="ap-stat">
                  <div className="ap-stat-val">—</div>
                  <div className="ap-stat-lbl">Meetings</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* FORM */}
          <div className="ap-form-card">
            <div className="ap-form-head">
              <div>
                <div className="ap-form-title">Account Details</div>
                <div className="ap-form-sub">
                  {editing ? "Edit your information below" : "Click Edit Profile to make changes"}
                </div>
              </div>
              {editing && (
                <span style={{ fontSize:11.5, color:"var(--t3)", display:"flex", alignItems:"center", gap:5 }}>
                  <Check size={11} style={{ color:"var(--green)" }} /> Editing mode
                </span>
              )}
            </div>

            <div className="ap-form-body">

              {/* ── PERSONAL INFO ── */}
              <div className="ap-section-title">Personal Information</div>

              <div className="ap-field">
                <label className="ap-label">Full Name</label>
                {editing
                  ? <EditInput icon={User} name="fullname" value={form.fullname} onChange={handleChange} placeholder="Your full name" />
                  : <ViewRow icon={User} value={form.fullname} />
                }
              </div>

              <div className="ap-field">
                <label className="ap-label">Mobile Number</label>
                {editing
                  ? <EditInput icon={Phone} name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" type="tel" />
                  : <ViewRow icon={Phone} value={form.mobile} />
                }
              </div>

              <div className="ap-divider" />

              {/* ── ACCOUNT INFO ── */}
              <div className="ap-section-title">Account Information</div>

              <div className="ap-field">
                <label className="ap-label">Email Address</label>
                {editing ? (
                  <>
                    <EditInput icon={Mail} name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" type="email" disabled={true} />
                    <p className="ap-readonly-note">Email address cannot be changed.</p>
                  </>
                ) : (
                  <ViewRow icon={Mail} value={form.email} />
                )}
              </div>

              <div className="ap-field">
                <label className="ap-label">Role</label>
                <ViewRow icon={Shield} value={role.charAt(0).toUpperCase() + role.slice(1)} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}