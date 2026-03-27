import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../components/BaseUrl";
import { toast } from "sonner";
import {
  User, Mail, Phone, ArrowLeft,
  Pencil, X, Save, Check, Shield,
  Home, Star, Calendar,
} from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:     #f5f0eb;
    --cream-2:   #faf7f4;
    --ink:       #1a1814;
    --ink-soft:  #4a4540;
    --ink-muted: #8a857f;
    --green:     #10b981;
    --green-dk:  #059669;
    --green-dim: rgba(16,185,129,0.1);
    --border:    rgba(26,24,20,0.09);
    --border-2:  rgba(26,24,20,0.16);
  }

  .up-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream-2);
    min-height: 100vh;
   
    padding-top: 96px; /* navbar height */
  }

  /* ── HERO BANNER ── */
  .up-hero {
    background: var(--ink);
    padding: 52px 24px 100px;
    position: relative; overflow: hidden;
  }
  .up-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 0%, rgba(16,185,129,0.14) 0%, transparent 60%);
    pointer-events: none;
  }
  .up-hero-inner { max-width: 900px; margin: 0 auto; position: relative; }
  .up-hero-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green); margin-bottom: 12px;
  }
  .up-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 50px); font-weight: 600;
    color: #f5f0eb; line-height: 1.12; letter-spacing: -0.3px;
  }
  .up-hero-title em { font-style: italic; color: var(--green); }

  /* ── MAIN CARD (overlaps hero) ── */
  .up-main {
    max-width: 900px; margin: -60px auto 0;
    padding: 0 24px 80px;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 760px) {
    .up-main { grid-template-columns: 1fr; margin-top: -40px; }
  }

  /* ── AVATAR CARD ── */
  .up-av-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px 22px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(26,24,20,0.07);
    position: sticky; top: 110px;
  }

  .up-avatar {
    width: 88px; height: 88px; border-radius: 22px;
    background: linear-gradient(135deg, var(--green), var(--green-dk));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 600; color: #fff;
    margin: 0 auto 16px;
    box-shadow: 0 6px 24px rgba(16,185,129,0.3);
    transition: transform 0.3s ease;
  }
  .up-avatar:hover { transform: scale(1.04) rotate(-2deg); }

  .up-av-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--ink); margin-bottom: 5px; line-height: 1.2;
  }
  .up-av-email { font-size: 12.5px; color: var(--ink-muted); margin-bottom: 14px; }
  .up-av-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    background: var(--green-dim); color: var(--green-dk);
    border: 1px solid rgba(16,185,129,0.2); font-size: 11.5px; font-weight: 500;
    margin-bottom: 22px;
  }

  .up-av-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    padding-top: 18px; border-top: 1px solid var(--border);
  }
  .up-av-stat { padding: 12px 8px; text-align: center; }
  .up-av-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: var(--ink); line-height: 1;
  }
  .up-av-stat-lbl { font-size: 10.5px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px; }

  /* ── FORM CARD ── */
  .up-form-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(26,24,20,0.07);
     z-index:99;
  }

  .up-form-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 26px; border-bottom: 1px solid var(--border);
  }
  .up-form-head-left {}
  .up-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--ink);
  }
  .up-form-sub { font-size: 12.5px; color: var(--ink-muted); margin-top: 2px; }

  .up-form-body { padding: 26px; }

  /* SECTION */
  .up-sec-title {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--ink-muted);
    margin-bottom: 16px; padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  /* FIELD */
  .up-field { margin-bottom: 18px; }
  .up-field:last-child { margin-bottom: 0; }
  .up-label {
    display: block; font-size: 11px; font-weight: 500;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--ink-muted); margin-bottom: 7px;
  }

  /* VIEW ROW */
  .up-view-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; background: var(--cream-2);
    border: 1px solid var(--border); border-radius: 10px;
  }
  .up-view-icon { color: var(--ink-muted); flex-shrink: 0; }
  .up-view-val  { font-size: 13.5px; color: var(--ink); flex: 1; }
  .up-view-empty { color: var(--ink-muted); font-style: italic; }

  /* EDIT INPUT */
  .up-input-wrap {
    display: flex; align-items: center;
    background: var(--cream-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 0 14px;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .up-input-wrap:focus-within {
    background: #fff; border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }
  .up-input-wrap.is-disabled { opacity: 0.55; cursor: not-allowed; }
  .up-in-icon { color: var(--ink-muted); flex-shrink: 0; margin-right: 10px; transition: color 0.18s; }
  .up-input-wrap:focus-within .up-in-icon { color: var(--green); }
  .up-input {
    width: 100%; padding: 11px 0; background: transparent;
    border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink);
  }
  .up-input::placeholder { color: var(--ink-muted); }
  .up-input:disabled { color: var(--ink-muted); cursor: not-allowed; }
  .up-readonly-note { font-size: 11px; color: var(--ink-muted); margin-top: 5px; }

  /* DIVIDER */
  .up-divider { height: 1px; background: var(--border); margin: 22px 0; }

  /* BUTTONS */
  .up-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 20px; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    border: none; cursor: pointer; transition: all 0.2s;
  }
  .up-btn-green {
    background: linear-gradient(135deg, var(--green), var(--green-dk));
    color: #fff; box-shadow: 0 2px 12px rgba(16,185,129,0.28);
  }
  .up-btn-green:hover { box-shadow: 0 4px 18px rgba(16,185,129,0.4); transform: translateY(-1px); }
  .up-btn-green:disabled { opacity: 0.5; pointer-events: none; }
  .up-btn-ghost { background: var(--cream-2); color: var(--ink-soft); border: 1px solid var(--border); }
  .up-btn-ghost:hover { background: var(--cream); color: var(--ink); border-color: var(--border-2); }

  /* UNSAVED BADGE */
  .up-unsaved {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 100px;
    background: rgba(245,158,11,0.08); color: #b45309;
    border: 1px solid rgba(245,158,11,0.2); font-size: 11.5px; font-weight: 500;
  }

  /* BACK LINK */
  .up-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(245,240,235,0.7); font-family: 'DM Sans', sans-serif;
    font-size: 13px; cursor: pointer; transition: all 0.18s;
    text-decoration: none; margin-bottom: 20px; width: fit-content;
  }
  .up-back:hover { background: rgba(255,255,255,0.16); color: #f5f0eb; }
`;

// ── Defined OUTSIDE component to avoid remount-on-render focus bug ──
function ViewRow({ icon: Icon, value }) {
  return (
    <div className="up-view-row">
      <Icon size={15} className="up-view-icon" strokeWidth={1.8} />
      <span className={`up-view-val${!value ? " up-view-empty" : ""}`}>
        {value || "Not set"}
      </span>
    </div>
  );
}

function EditInput({ icon: Icon, name, value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <div className={`up-input-wrap${disabled ? " is-disabled" : ""}`}>
      <Icon size={15} className="up-in-icon" strokeWidth={1.8} />
      <input
        className="up-input"
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

export default function UserProfile() {
  const navigate = useNavigate();

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const initForm = {
    fullname: stored.fullname || stored.name || "",
    email:    stored.email    || "",
    mobile:   stored.mobile   || stored.phone || "",
  };

  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [form,       setForm]       = useState(initForm);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const userId  = stored.id || stored._id;
  const role    = stored.role || "user";
  const initials = (form.fullname || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }, []);

  const handleCancel = () => {
    setForm(initForm);
    setHasChanges(false);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.fullname.trim()) { toast.error("Full name is required"); return; }
    const mob = form.mobile.replace(/\D/g, "");
    if (mob && mob.length !== 10) { toast.error("Mobile must be exactly 10 digits"); return; }

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
      <div className="up-root">

        {/* HERO */}
        <div className="up-hero">
          <div className="up-hero-inner">
            <button className="up-back" onClick={() => navigate("/")}>
              <ArrowLeft size={13} strokeWidth={2} /> Back to Home
            </button>
            <p className="up-hero-eyebrow">Account</p>
            <h1 className="up-hero-title">
              Your <em>Profile</em>
            </h1>
          </div>
        </div>

        {/* MAIN */}
        <div className="up-main">

          {/* AVATAR SIDEBAR */}
          <div>
            <div className="up-av-card">
              <div className="up-avatar">{initials}</div>
              <div className="up-av-name">{form.fullname || "User"}</div>
              <div className="up-av-email">{form.email}</div>
              <div className="up-av-badge">
                <Shield size={11} strokeWidth={2.5} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>

              {/* <div className="up-av-stats">
                <div className="up-av-stat">
                  <div className="up-av-stat-val">0</div>
                  <div className="up-av-stat-lbl">Bookings</div>
                </div>
                <div className="up-av-stat">
                  <div className="up-av-stat-val">0</div>
                  <div className="up-av-stat-lbl">Meetings</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* FORM */}
          <div className="up-form-card">
            <div className="up-form-head">
              <div>
                <div className="up-form-title">Personal Details</div>
                <div className="up-form-sub">
                  {editing ? "Make your changes and save" : "Click Edit to update your information"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {hasChanges && (
                  <span className="up-unsaved">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                    Unsaved
                  </span>
                )}
                {!editing ? (
                  <button className="up-btn up-btn-green" onClick={() => setEditing(true)}>
                    <Pencil size={13} strokeWidth={2} /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="up-btn up-btn-ghost" onClick={handleCancel}>
                      <X size={13} /> Cancel
                    </button>
                    <button className="up-btn up-btn-green" onClick={handleSave} disabled={saving}>
                      <Save size={13} strokeWidth={2} />
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="up-form-body">

              {/* PERSONAL INFO */}
              <div className="up-sec-title">Personal Information</div>

              <div className="up-field">
                <label className="up-label">Full Name</label>
                {editing
                  ? <EditInput icon={User} name="fullname" value={form.fullname} onChange={handleChange} placeholder="Your full name" />
                  : <ViewRow icon={User} value={form.fullname} />
                }
              </div>

              <div className="up-field">
                <label className="up-label">Mobile Number</label>
                {editing
                  ? <EditInput icon={Phone} name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" type="tel" />
                  : <ViewRow icon={Phone} value={form.mobile} />
                }
              </div>

              <div className="up-divider" />

              {/* ACCOUNT INFO */}
              <div className="up-sec-title">Account Information</div>

              <div className="up-field">
                <label className="up-label">Email Address</label>
                {editing ? (
                  <>
                    <EditInput icon={Mail} name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" type="email"  />
                    <p className="up-readonly-note">Email address cannot be changed.</p>
                  </>
                ) : (
                  <ViewRow icon={Mail} value={form.email} />
                )}
              </div>

              <div className="up-field">
                <label className="up-label">Account Role</label>
                <ViewRow icon={Shield} value={role.charAt(0).toUpperCase() + role.slice(1)} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}