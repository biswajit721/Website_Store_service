import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
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

  .auth-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--ink);
  }
  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left  { display: none; }
  }

  /* LEFT PANEL */
  .auth-left {
    position: relative;
    overflow: hidden;
  }
  .auth-left img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.6;
  }
  .auth-left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(26,24,20,0.85) 0%, rgba(26,24,20,0.2) 60%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 48px;
  }
  .auth-left-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 2.5vw, 34px); font-weight: 500; font-style: italic;
    color: var(--cream); line-height: 1.4; margin-bottom: 16px;
    max-width: 380px;
  }
  .auth-left-sub { font-size: 13px; color: rgba(245,240,235,0.5); }

  /* RIGHT PANEL */
  .auth-right {
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 40px 32px;
    background: #0e0e0e;
  }

  .auth-form-wrap {
    width: 100%; max-width: 400px;
  }

  .auth-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 48px; cursor: pointer;
    text-decoration: none;
  }
  .auth-logo-mark {
    width: 34px; height: 34px; border-radius: 8px;
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 10px rgba(16,185,129,0.35);
    font-size: 14px; color: #fff; font-weight: 700;
  }
  .auth-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--cream);
    letter-spacing: 0.01em;
  }

  .auth-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green); margin-bottom: 12px;
  }
  .auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600; color: var(--cream);
    line-height: 1.15; letter-spacing: -0.3px; margin-bottom: 8px;
  }
  .auth-subtitle { font-size: 14px; font-weight: 300; color: rgba(245,240,235,0.45); margin-bottom: 40px; }

  /* FIELD */
  .field { margin-bottom: 22px; }
  .field-label {
    display: block; font-size: 12px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(245,240,235,0.45); margin-bottom: 8px;
  }
  .field-wrap {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 0 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field-wrap:focus-within {
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }
  .field-wrap svg { color: rgba(245,240,235,0.25); flex-shrink: 0; transition: color 0.2s; }
  .field-wrap:focus-within svg { color: var(--green); }
  .field-input {
    width: 100%; padding: 13px 10px;
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--cream);
  }
  .field-input::placeholder { color: rgba(245,240,235,0.2); }
  .toggle-pw {
    background: none; border: none; cursor: pointer;
    color: rgba(245,240,235,0.3); padding: 0; flex-shrink: 0;
    transition: color 0.2s; display: flex; align-items: center;
  }
  .toggle-pw:hover { color: rgba(245,240,235,0.6); }

  /* FORGOT */
  .forgot-row {
    display: flex; justify-content: flex-end;
    margin-top: -14px; margin-bottom: 28px;
  }
  .forgot-link {
    font-size: 12.5px; color: var(--green);
    cursor: pointer; transition: opacity 0.18s;
  }
  .forgot-link:hover { opacity: 0.75; }

  /* SUBMIT */
  .auth-submit {
    width: 100%; padding: 14px;
    background: var(--green); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: 0.03em; border: none; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s ease;
    box-shadow: 0 2px 16px rgba(16,185,129,0.3);
  }
  .auth-submit:hover { background: var(--green-dark); box-shadow: 0 4px 20px rgba(16,185,129,0.4); transform: translateY(-1px); }
  .auth-submit:active { transform: translateY(0); }
  .auth-submit svg { transition: transform 0.18s; }
  .auth-submit:hover svg { transform: translateX(3px); }
  .auth-submit:disabled { opacity: 0.6; pointer-events: none; }

  /* FOOTER */
  .auth-footer {
    margin-top: 32px; text-align: center;
    font-size: 13.5px; color: rgba(245,240,235,0.35);
  }
  .auth-footer-link {
    color: var(--cream); cursor: pointer; font-weight: 500;
    transition: color 0.18s;
  }
  .auth-footer-link:hover { color: var(--green); }

  /* DIVIDER */
  .auth-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 28px 0;
  }
  .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .auth-divider-text { font-size: 11px; color: rgba(245,240,235,0.2); letter-spacing: 0.06em; }
`

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        formData,
        { withCredentials: true }
      )
      if (res.data.success) {
        const { token, user } = res.data
        localStorage.setItem("token", token)
        localStorage.setItem("role", user.role)
        localStorage.setItem("user", JSON.stringify(user))
        setFormData({ email: "", password: "" })
        toast.success(res.data.message)
        setTimeout(() => {
          user.role === "admin" ? navigate("/admin") : navigate("/")
        }, 1200)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-root">

        {/* LEFT PANEL */}
        <div className="auth-left">
          <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80" alt="Interior" />
          <div className="auth-left-overlay">
            <p className="auth-left-quote">"Design is not just what it looks like — design is how it works."</p>
            <p className="auth-left-sub">— Steve Jobs</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form-wrap">

            <div className="auth-logo" onClick={() => navigate("/")}>
              <div className="auth-logo-mark">S</div>
              <span className="auth-logo-text">Servica</span>
            </div>

            <p className="auth-eyebrow">Welcome Back</p>
            <h1 className="auth-title">Sign in to<br />your account</h1>
            <p className="auth-subtitle">Enter your credentials to continue</p>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <Mail size={16} strokeWidth={1.8} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <Lock size={16} strokeWidth={1.8} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="field-input"
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <span className="forgot-link">Forgot password?</span>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <ArrowRight size={15} strokeWidth={2} />}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account?{" "}
              <span className="auth-footer-link" onClick={() => navigate("/register")}>
                Create one
              </span>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login