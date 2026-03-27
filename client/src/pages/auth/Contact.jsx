import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../components/BaseUrl";
import { toast } from "sonner";
import {
  User, Phone, Mail, FileText, Calendar,
  MapPin, Video, MessageSquare, ArrowRight,
  CheckCircle, Clock, Shield, Star
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:     #f5f0eb;
    --cream-2:   #faf7f4;
    --ink:       #1a1814;
    --ink-soft:  #4a4540;
    --ink-muted: #8a857f;
    --green:     #10b981;
    --green-dk:  #059669;
    --border:    rgba(26,24,20,0.09);
  }

  .ct-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream-2);
    min-height: 100vh;
  }

  /* ── HERO HEADER ── */
  .ct-hero {
    background: var(--ink);
    padding: 110px 24px 72px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ct-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% -20%, rgba(16,185,129,0.18) 0%, transparent 65%);
    pointer-events: none;
  }
  /* thin decorative rule */
  .ct-hero::after {
    content: '';
    position: absolute; bottom: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent);
  }

  .ct-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green);
    margin-bottom: 20px;
  }
  .ct-hero-eyebrow::before,
  .ct-hero-eyebrow::after {
    content: ''; display: block; width: 28px; height: 1px;
    background: var(--green); opacity: 0.5;
  }

  .ct-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 5.5vw, 68px);
    font-weight: 600; line-height: 1.08;
    color: var(--cream); letter-spacing: -0.5px;
    margin-bottom: 18px;
  }
  .ct-hero-title em { font-style: italic; color: var(--green); }

  .ct-hero-sub {
    font-size: 15px; font-weight: 300;
    color: rgba(245,240,235,0.48);
    max-width: 480px; margin: 0 auto;
    line-height: 1.7;
  }

  /* ── TRUST STRIP ── */
  .ct-trust {
    background: #fff;
    border-bottom: 1px solid var(--border);
    padding: 20px 24px;
  }
  .ct-trust-inner {
    max-width: 860px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 32px;
  }
  .ct-trust-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: var(--ink-muted);
  }
  .ct-trust-item svg { color: var(--green); }
  .ct-trust-item strong { color: var(--ink-soft); font-weight: 500; }

  /* ── BODY LAYOUT ── */
  .ct-body {
    max-width: 1100px; margin: 0 auto;
    padding: 64px 24px 96px;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 40px;
    align-items: start;
  }
  @media (max-width: 960px) {
    .ct-body { grid-template-columns: 1fr; }
    .ct-sidebar { order: -1; }
  }

  /* ── FORM CARD ── */
  .ct-form-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 4px 24px rgba(26,24,20,0.05);
  }
  @media (max-width: 600px) { .ct-form-card { padding: 24px 20px; } }

  .ct-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600; color: var(--ink);
    margin-bottom: 6px;
  }
  .ct-form-sub {
    font-size: 13.5px; color: var(--ink-muted); margin-bottom: 32px;
    line-height: 1.6;
  }

  /* FIELD GRID */
  .ct-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  @media (max-width: 580px) { .ct-grid { grid-template-columns: 1fr; } }
  .ct-full { grid-column: 1 / -1; }

  .ct-field { display: flex; flex-direction: column; gap: 7px; }
  .ct-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.09em;
    text-transform: uppercase; color: var(--ink-muted);
  }
  .ct-input-wrap {
    display: flex; align-items: center;
    background: var(--cream-2);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 0 14px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ct-input-wrap:focus-within {
    background: #fff;
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }
  .ct-input-wrap svg { color: rgba(74,69,64,0.35); flex-shrink: 0; transition: color 0.2s; }
  .ct-input-wrap:focus-within svg { color: var(--green); }

  .ct-input {
    width: 100%; padding: 12px 10px;
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink);
  }
  .ct-input::placeholder { color: rgba(138,133,127,0.55); }
  .ct-input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }

  .ct-select {
    width: 100%; padding: 12px 10px;
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink);
    cursor: pointer; appearance: none;
  }

  .ct-textarea {
    width: 100%; padding: 13px 14px;
    background: var(--cream-2); border: 1px solid var(--border);
    border-radius: 10px; outline: none; resize: vertical;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink);
    min-height: 130px; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .ct-textarea::placeholder { color: rgba(138,133,127,0.55); }
  .ct-textarea:focus {
    background: #fff; border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }

  /* MEETING TYPE TOGGLE */
  .ct-toggle-wrap { display: flex; gap: 8px; }
  .ct-toggle-btn {
    flex: 1; padding: 11px;
    border: 1px solid var(--border); border-radius: 10px;
    background: var(--cream-2); color: var(--ink-muted);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .ct-toggle-btn:hover { border-color: rgba(26,24,20,0.2); color: var(--ink); }
  .ct-toggle-btn.active {
    background: var(--ink); color: var(--cream);
    border-color: var(--ink);
  }
  .ct-toggle-btn.active svg { color: var(--green); }

  /* SUBMIT ROW */
  .ct-submit-row {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px; margin-top: 32px;
    padding-top: 24px; border-top: 1px solid var(--border);
  }
  .ct-submit-note { font-size: 12px; color: var(--ink-muted); max-width: 260px; line-height: 1.5; }

  .ct-submit-btn {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--green), var(--green-dk));
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; letter-spacing: 0.02em;
    border: none; border-radius: 10px; cursor: pointer;
    transition: all 0.22s ease;
    box-shadow: 0 3px 14px rgba(16,185,129,0.3);
    white-space: nowrap;
  }
  .ct-submit-btn:hover { box-shadow: 0 6px 22px rgba(16,185,129,0.42); transform: translateY(-1px); }
  .ct-submit-btn:active { transform: translateY(0); }
  .ct-submit-btn:disabled { opacity: 0.6; pointer-events: none; }
  .ct-submit-btn svg { transition: transform 0.18s; }
  .ct-submit-btn:hover svg { transform: translateX(3px); }

  /* SUCCESS STATE */
  .ct-success {
    text-align: center; padding: 48px 24px;
    animation: fadeUp 0.4s ease;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
  .ct-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(16,185,129,0.1); border: 2px solid rgba(16,185,129,0.25);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .ct-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 600; color: var(--ink); margin-bottom: 10px;
  }
  .ct-success-sub { font-size: 14px; color: var(--ink-muted); margin-bottom: 24px; }
  .ct-success-btn {
    padding: 11px 28px; border: 1px solid var(--border);
    border-radius: 8px; background: transparent; color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; cursor: pointer;
    transition: all 0.2s;
  }
  .ct-success-btn:hover { background: var(--cream); color: var(--ink); }

  /* ── SIDEBAR ── */
  .ct-sidebar {}

  .ct-info-card {
    background: var(--ink);
    border-radius: 20px; padding: 32px;
    margin-bottom: 16px; position: relative; overflow: hidden;
  }
  .ct-info-card::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%);
    pointer-events: none;
  }

  .ct-info-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: var(--cream);
    margin-bottom: 6px;
  }
  .ct-info-sub { font-size: 13px; color: rgba(245,240,235,0.4); margin-bottom: 28px; line-height: 1.6; }

  .ct-info-items { display: flex; flex-direction: column; gap: 16px; }
  .ct-info-item {
    display: flex; align-items: flex-start; gap: 14px;
  }
  .ct-info-icon {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .ct-info-text-title { font-size: 13px; font-weight: 500; color: var(--cream); margin-bottom: 2px; }
  .ct-info-text-sub   { font-size: 12px; color: rgba(245,240,235,0.38); line-height: 1.5; }

  /* PROCESS CARD */
  .ct-process-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    box-shadow: 0 2px 12px rgba(26,24,20,0.04);
  }
  .ct-process-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 600; color: var(--ink); margin-bottom: 20px;
  }
  .ct-steps { display: flex; flex-direction: column; gap: 0; }
  .ct-step {
    display: flex; gap: 14px; position: relative; padding-bottom: 20px;
  }
  .ct-step:last-child { padding-bottom: 0; }
  .ct-step-left { display: flex; flex-direction: column; align-items: center; }
  .ct-step-num {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: var(--green);
  }
  .ct-step-line {
    flex: 1; width: 1px; background: var(--border); margin: 6px 0 0;
  }
  .ct-step:last-child .ct-step-line { display: none; }
  .ct-step-title { font-size: 13.5px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
  .ct-step-desc  { font-size: 12px; color: var(--ink-muted); line-height: 1.5; }
`;

const INITIAL = {
  clientName: "", phone: "", email: "",
  subject: "", DOM: "", location: "",
  meetingType: "online", message: "",
};

function Contact() {
  const [formData, setFormData] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL.url}/meeting/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${BASE_URL.token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData(INITIAL);
        setSubmitted(true);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ct-root">

        {/* HERO */}
        <div className="ct-hero">
          <p className="ct-hero-eyebrow">Let's Connect</p>
          <h1 className="ct-hero-title">
            Book a <em>Consultation</em><br />Meeting
          </h1>
          <p className="ct-hero-sub">
            Tell us about your space and vision — our design team will
            reach out within 24 hours to set things in motion.
          </p>
        </div>

        {/* TRUST STRIP */}
        <div className="ct-trust">
          <div className="ct-trust-inner">
            {[
              { icon: <Clock size={14} strokeWidth={2} />, text: <><strong>24h</strong> response time</> },
              { icon: <Shield size={14} strokeWidth={2} />, text: <><strong>Free</strong> first consultation</> },
              { icon: <Star size={14} strokeWidth={2} />, text: <><strong>4.9★</strong> client satisfaction</> },
              { icon: <CheckCircle size={14} strokeWidth={2} />, text: <><strong>500+</strong> projects delivered</> },
            ].map((t, i) => (
              <div key={i} className="ct-trust-item">
                {t.icon} <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="ct-body">

          {/* FORM */}
          <div className="ct-form-card">
            {submitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">
                  <CheckCircle size={28} color="var(--green)" strokeWidth={1.8} />
                </div>
                <h3 className="ct-success-title">Meeting Request Sent!</h3>
                <p className="ct-success-sub">
                  Thank you — our team will reach out within 24 hours to confirm
                  your consultation details.
                </p>
                <button className="ct-success-btn" onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <h2 className="ct-form-title">Schedule a Meeting</h2>
                <p className="ct-form-sub">Fill in your details and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit}>
                  <div className="ct-grid">

                    {/* NAME */}
                    <div className="ct-field">
                      <label className="ct-label">Full Name</label>
                      <div className="ct-input-wrap">
                        <User size={15} strokeWidth={1.8} />
                        <input name="clientName" value={formData.clientName} onChange={handleChange}
                          type="text" placeholder="John Doe" required className="ct-input" />
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="ct-field">
                      <label className="ct-label">Phone</label>
                      <div className="ct-input-wrap">
                        <Phone size={15} strokeWidth={1.8} />
                        <input name="phone" value={formData.phone} onChange={handleChange}
                          type="tel" placeholder="+91 9876543210" required className="ct-input" />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="ct-field">
                      <label className="ct-label">Email Address</label>
                      <div className="ct-input-wrap">
                        <Mail size={15} strokeWidth={1.8} />
                        <input name="email" value={formData.email} onChange={handleChange}
                          type="email" placeholder="you@example.com" required className="ct-input" />
                      </div>
                    </div>

                    {/* SUBJECT */}
                    <div className="ct-field">
                      <label className="ct-label">Subject</label>
                      <div className="ct-input-wrap">
                        <FileText size={15} strokeWidth={1.8} />
                        <input name="subject" value={formData.subject} onChange={handleChange}
                          type="text" placeholder="Living room redesign" required className="ct-input" />
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="ct-field">
                      <label className="ct-label">Preferred Date</label>
                      <div className="ct-input-wrap">
                        <Calendar size={15} strokeWidth={1.8} />
                        <input name="DOM" value={formData.DOM} onChange={handleChange}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="ct-input" />
                      </div>
                    </div>

                    {/* MEETING TYPE */}
                    <div className="ct-field">
                      <label className="ct-label">Meeting Type</label>
                      <div className="ct-toggle-wrap">
                        <button
                          type="button"
                          className={`ct-toggle-btn${formData.meetingType === "online" ? " active" : ""}`}
                          onClick={() => setFormData({ ...formData, meetingType: "online" })}
                        >
                          <Video size={14} strokeWidth={2} /> Online
                        </button>
                        <button
                          type="button"
                          className={`ct-toggle-btn${formData.meetingType === "Offline" ? " active" : ""}`}
                          onClick={() => setFormData({ ...formData, meetingType: "Offline" })}
                        >
                          <MapPin size={14} strokeWidth={2} /> In-Person
                        </button>
                      </div>
                    </div>

                    {/* LOCATION — only for offline */}
                    {formData.meetingType === "Offline" && (
                      <div className="ct-field ct-full">
                        <label className="ct-label">Meeting Location</label>
                        <div className="ct-input-wrap">
                          <MapPin size={15} strokeWidth={1.8} />
                          <input name="location" value={formData.location} onChange={handleChange}
                            type="text" placeholder="Address or area" className="ct-input" />
                        </div>
                      </div>
                    )}

                    {/* MESSAGE */}
                    <div className="ct-field ct-full">
                      <label className="ct-label">Your Message</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        placeholder="Describe your space, style preferences, or any specific requirements…"
                        rows={5} className="ct-textarea"
                      />
                    </div>
                  </div>

                  <div className="ct-submit-row">
                    <p className="ct-submit-note">
                      We respond within 24 hours. Your details are kept strictly confidential.
                    </p>
                    <button type="submit" className="ct-submit-btn" disabled={loading}>
                      {loading ? "Submitting…" : "Send Request"}
                      {!loading && <ArrowRight size={15} strokeWidth={2} />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="ct-sidebar">

            {/* INFO CARD */}
            <div className="ct-info-card">
              <h3 className="ct-info-title">Why Meet With Us?</h3>
              <p className="ct-info-sub">
                Our design consultations are personalised, free, and pressure-free.
              </p>
              <div className="ct-info-items">
                {[
                  { icon: <Clock size={16} color="var(--green)" strokeWidth={2} />, title: "Quick Turnaround", desc: "Most designs delivered within 7–12 days" },
                  { icon: <Shield size={16} color="var(--green)" strokeWidth={2} />, title: "No Hidden Costs", desc: "Fixed pricing — what you see is what you pay" },
                  { icon: <Star size={16} color="var(--green)" strokeWidth={2} />, title: "Expert Team", desc: "10+ years of interior design experience" },
                  { icon: <CheckCircle size={16} color="var(--green)" strokeWidth={2} />, title: "Satisfaction Guaranteed", desc: "Revisions included in every package" },
                ].map((item, i) => (
                  <div key={i} className="ct-info-item">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div>
                      <div className="ct-info-text-title">{item.title}</div>
                      <div className="ct-info-text-sub">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROCESS CARD */}
            <div className="ct-process-card">
              <h3 className="ct-process-title">How It Works</h3>
              <div className="ct-steps">
                {[
  {
    title: "Choose Your Design",
    desc: "Browse our curated collection of 500+ professionally crafted interior packages and pick the one that fits your vision.",
    icon: "🎨",
  },
  {
    title: "Submit Your Request",
    desc: "Fill in your space details, preferences, and budget. Our team reviews every request personally.",
    icon: "📋",
  },
  {
    title: "Schedule a Meeting",
    desc: "Book a free consultation call at your convenience — online or in-person — to align on details.",
    icon: "📅",
  },
  {
    title: "Start Working on Project",
    desc: "Our design experts begin crafting your personalised interior plan with 3D renders and material lists.",
    icon: "⚡",
  },
  {
    title: "Project Delivered",
    desc: "Receive your complete design package — layouts, lighting plans, execution guides — on or before the deadline.",
    icon: "📦",
  },
  {
    title: "Ongoing Maintenance",
    desc: "We don't disappear after delivery. Our team stays available for revisions, updates, and seasonal refreshes.",
    icon: "🛡️",
  },
].map((s, i) => (
                  <div key={i} className="ct-step">
                    <div className="ct-step-left">
                      <div className="ct-step-num">{s.icon}</div>
                      <div className="ct-step-line" />
                    </div>
                    <div style={{ paddingTop: 3, paddingBottom: 20 }}>
                      <div className="ct-step-title">{s.title}</div>
                      <div className="ct-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;