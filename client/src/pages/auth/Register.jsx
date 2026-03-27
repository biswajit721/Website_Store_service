"use client"

import axios from "axios"
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../components/BaseUrl"
import { toast } from "sonner"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #f5f0eb;
    --ink: #1a1814;
    --ink-soft: #4a4540;
    --ink-muted: #8a857f;
    --green: #10b981;
    --green-dark: #059669;
    --border: rgba(26,24,20,0.1);
  }

  .reg-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--ink);
  }
  @media (max-width: 768px) {
    .reg-root { grid-template-columns: 1fr; }
    .reg-left  { display: none; }
  }

  /* LEFT */
  .reg-left { position: relative; overflow: hidden; }
  .reg-left img { width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
  .reg-left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(26,24,20,0.9) 0%, rgba(26,24,20,0.25) 55%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 48px;
  }
  .reg-left-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 3vw, 42px); font-weight: 600; color: var(--cream);
    line-height: 1.2; margin-bottom: 16px;
  }
  .reg-left-title em { font-style: italic; color: var(--green); }
  .reg-perks { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .reg-perk {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; color: rgba(245,240,235,0.6);
  }
  .reg-perk-dot {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(16,185,129,0.18);
    border: 1px solid rgba(16,185,129,0.4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 10px; color: var(--green);
  }

  /* RIGHT */
  .reg-right {
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 40px 32px; background: #0e0e0e;
    overflow-y: auto;
  }
  .reg-form-wrap { width: 100%; max-width: 420px; }

  .reg-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 40px; cursor: pointer;
  }
  .reg-logo-mark {
    width: 34px; height: 34px; border-radius: 8px;
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #fff; font-weight: 700;
    box-shadow: 0 2px 10px rgba(16,185,129,0.35);
  }
  .reg-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--cream);
  }

  .reg-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green); margin-bottom: 10px;
  }
  .reg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 600; color: var(--cream);
    line-height: 1.15; margin-bottom: 6px;
  }
  .reg-sub { font-size: 13.5px; font-weight: 300; color: rgba(245,240,235,0.4); margin-bottom: 32px; }

  /* GRID FIELDS */
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) { .field-grid { grid-template-columns: 1fr; } }
  .field-full { grid-column: 1 / -1; }

  .field { margin-bottom: 0; }
  .field-label {
    display: block; font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(245,240,235,0.4); margin-bottom: 7px;
  }
  .field-wrap {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 0 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field-wrap:focus-within {
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }
  .field-wrap svg { color: rgba(245,240,235,0.22); flex-shrink: 0; transition: color 0.2s; }
  .field-wrap:focus-within svg { color: var(--green); }
  .field-input {
    width: 100%; padding: 11px 10px;
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px;
    color: var(--cream);
  }
  .field-input::placeholder { color: rgba(245,240,235,0.18); }
  .toggle-pw {
    background: none; border: none; cursor: pointer;
    color: rgba(245,240,235,0.25); padding: 0; flex-shrink: 0;
    display: flex; align-items: center; transition: color 0.2s;
  }
  .toggle-pw:hover { color: rgba(245,240,235,0.55); }

  .reg-submit {
    width: 100%; margin-top: 24px; padding: 14px;
    background: var(--green); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: 0.03em; border: none; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s ease;
    box-shadow: 0 2px 16px rgba(16,185,129,0.3);
  }
  .reg-submit:hover { background: var(--green-dark); box-shadow: 0 4px 20px rgba(16,185,129,0.4); transform: translateY(-1px); }
  .reg-submit:active { transform: translateY(0); }
  .reg-submit:disabled { opacity: 0.6; pointer-events: none; }
  .reg-submit svg { transition: transform 0.18s; }
  .reg-submit:hover svg { transform: translateX(3px); }

  .reg-footer {
    margin-top: 24px; text-align: center;
    font-size: 13px; color: rgba(245,240,235,0.3);
  }
  .reg-footer-link {
    color: var(--cream); font-weight: 500; cursor: pointer; transition: color 0.18s;
  }
  .reg-footer-link:hover { color: var(--green); }

  .terms-note {
    margin-top: 16px; text-align: center;
    font-size: 11.5px; color: rgba(245,240,235,0.2);
    line-height: 1.6;
  }
  .terms-note a { color: rgba(245,240,235,0.4); cursor: pointer; }
`

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "", email: "", password: "", confirmPassword: "", mobile: "",
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${BASE_URL.url}/auth/register`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        toast.success(res.data.message || "Account created successfully")
        setTimeout(() => navigate("/login"), 2500)
      } else {
        toast.error(res.data?.message || "Registration failed")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = "text", placeholder, icon: Icon, suffix }) => (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="field-wrap">
        <Icon size={15} strokeWidth={1.8} />
        <input
          type={type} name={name} value={formData[name]}
          onChange={handleChange} placeholder={placeholder}
          className="field-input" required
        />
        {suffix}
      </div>
    </div>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="reg-root">

        {/* LEFT PANEL */}
        <div className="reg-left">
          <img src="https://images.unsplash.com/photo-1616137148650-4aa14051b5c4?w=1200&q=80" alt="Interior" />
          <div className="reg-left-overlay">
            <h2 className="reg-left-title">Join <em>Servica</em><br />& Transform Your Space</h2>
            <ul className="reg-perks">
              {["500+ premium design packages", "Transparent fixed pricing", "Expert design consultations", "Instant live previews"].map(p => (
                <li key={p} className="reg-perk">
                  <span className="reg-perk-dot">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="reg-right">
          <div className="reg-form-wrap">

            <div className="reg-logo" onClick={() => navigate("/")}>
              <div className="reg-logo-mark">S</div>
              <span className="reg-logo-text">Servica</span>
            </div>

            <p className="reg-eyebrow">Get Started</p>
            <h1 className="reg-title">Create your<br />free account</h1>
            <p className="reg-sub">Join thousands of happy clients</p>

            <form onSubmit={handleSubmit}>
              <div className="field-grid">
                <div className="field field-full">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrap">
                    <User size={15} strokeWidth={1.8} />
                    <input type="text" name="fullname" value={formData.fullname}
                      onChange={handleChange} placeholder="John Doe" className="field-input" required />
                  </div>
                </div>

                <div className="field field-full">
                  <label className="field-label">Email Address</label>
                  <div className="field-wrap">
                    <Mail size={15} strokeWidth={1.8} />
                    <input type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="you@example.com" className="field-input" required />
                  </div>
                </div>

                <div className="field field-full">
                  <label className="field-label">Phone Number</label>
                  <div className="field-wrap">
                    <Phone size={15} strokeWidth={1.8} />
                    <input type="tel" name="mobile" value={formData.mobile}
                      onChange={handleChange} placeholder="+91 9876543210" className="field-input" required />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="field-wrap">
                    <Lock size={15} strokeWidth={1.8} />
                    <input type={showPw ? "text" : "password"} name="password" value={formData.password}
                      onChange={handleChange} placeholder="••••••••" className="field-input" required />
                    <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Confirm</label>
                  <div className="field-wrap">
                    <Lock size={15} strokeWidth={1.8} />
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword}
                      onChange={handleChange} placeholder="••••••••" className="field-input" required />
                    <button type="button" className="toggle-pw" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="reg-submit" disabled={loading}>
                {loading ? "Creating Account…" : "Create Account"}
                {!loading && <ArrowRight size={15} strokeWidth={2} />}
              </button>
            </form>

            <p className="reg-footer">
              Already have an account?{" "}
              <span className="reg-footer-link" onClick={() => navigate("/login")}>Sign in</span>
            </p>
            <p className="terms-note">
              By creating an account, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Register