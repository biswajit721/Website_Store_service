"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Clock, ChevronLeft, MessageCircle, Phone, Check, Zap } from "lucide-react"
import TimeSolt from "../components/TimeSolt"
import axios from "axios"
import { BASE_URL } from "../components/BaseUrl"
import { toast } from "sonner"
import LiveDemoModal from "../components/LiveDemoModel";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #f5f0eb;
    --cream-2: #faf7f4;
    --ink: #1a1814;
    --ink-soft: #4a4540;
    --ink-muted: #8a857f;
    --green: #10b981;
    --green-dark: #059669;
    --border: rgba(26,24,20,0.09);
  }

  .sd-root { font-family: 'DM Sans', sans-serif; background: var(--cream-2); }

  /* BACK BAR */
  .sd-back-bar {
    background: #fff; border-bottom: 1px solid var(--border);
    padding: 14px 24px; position: sticky; top: 72px; z-index: 50;
  }
  .sd-back-inner { max-width: 1200px; margin: 0 auto; }
  .sd-back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 500; color: var(--ink-muted);
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: 'DM Sans', sans-serif; transition: color 0.18s;
  }
  .sd-back-btn:hover { color: var(--ink); }

  /* MAIN LAYOUT */
  .sd-layout {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 24px 80px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 40px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .sd-layout { grid-template-columns: 1fr; }
    .sd-sidebar { order: -1; }
  }

  /* GALLERY */
  .sd-gallery {}
  .sd-main-img {
    width: 100%; height: 480px; object-fit: cover;
    border-radius: 16px; cursor: zoom-in;
    transition: opacity 0.25s ease;
    display: block;
  }
  @media (max-width: 640px) { .sd-main-img { height: 280px; } }

  .sd-thumbs { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
  .sd-thumb {
    width: 76px; height: 76px; border-radius: 10px;
    object-fit: cover; cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.18s, opacity 0.18s;
    opacity: 0.65;
  }
  .sd-thumb:hover { opacity: 1; }
  .sd-thumb.active { border-color: var(--green); opacity: 1; }

  /* META */
  .sd-meta { margin-top: 36px; }
  .sd-badges { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; }
  .sd-badge {
    font-size: 11.5px; font-weight: 500; padding: 5px 12px; border-radius: 100px;
  }
  .sd-badge-cat { background: rgba(16,185,129,0.1); color: var(--green-dark); border: 1px solid rgba(16,185,129,0.2); }
  .sd-badge-offer { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.15); }
  .sd-badge-rating {
    display: flex; align-items: center; gap: 4px;
    background: #fff; border: 1px solid var(--border); color: var(--ink-soft);
  }
  .sd-badge-rating .star { color: #f59e0b; }

  .sd-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 44px); font-weight: 600;
    color: var(--ink); line-height: 1.15; letter-spacing: -0.3px;
    margin-bottom: 16px;
  }

  .sd-desc {
    font-size: 15px; font-weight: 300; color: var(--ink-soft);
    line-height: 1.8; margin-bottom: 32px;
  }

  /* SECTIONS */
  .sd-section { margin-bottom: 36px; }
  .sd-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: var(--ink);
    margin-bottom: 18px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .sd-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 480px) { .sd-feature-grid { grid-template-columns: 1fr; } }

  .sd-feature-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; background: #fff;
    border: 1px solid var(--border); border-radius: 10px;
    font-size: 13.5px; color: var(--ink-soft);
  }
  .sd-feature-check {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(16,185,129,0.1); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }

  /* PREVIEW BTN */
  .sd-preview-btn {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 28px;
    background: var(--ink); color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    border: none; border-radius: 8px; cursor: pointer;
    transition: all 0.22s ease;
  }
  .sd-preview-btn:hover { background: #2c2820; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,24,20,0.2); }

  /* ── SIDEBAR ── */
  .sd-sidebar { position: sticky; top: 130px; }

  .sd-price-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; margin-bottom: 16px;
    box-shadow: 0 4px 24px rgba(26,24,20,0.06);
  }

  .sd-price-wrap { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
  .sd-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px; font-weight: 600; color: var(--ink); line-height: 1;
  }
  .sd-original-price {
    font-size: 16px; color: #c4bfba; text-decoration: line-through;
  }
  .sd-discount-badge {
    display: inline-block; margin-bottom: 20px;
    background: rgba(16,185,129,0.1); color: var(--green-dark);
    border: 1px solid rgba(16,185,129,0.2);
    font-size: 12px; font-weight: 600; padding: 4px 12px;
    border-radius: 100px; letter-spacing: 0.03em;
  }

  .sd-delivery-info {
    display: flex; flex-direction: column; gap: 8px;
    margin-bottom: 22px; padding: 14px;
    background: var(--cream-2); border-radius: 10px;
    border: 1px solid var(--border);
  }
  .sd-delivery-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-soft); }
  .sd-delivery-item svg { color: var(--green); flex-shrink: 0; }

  .sd-cta-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    border: none; border-radius: 10px; cursor: pointer;
    transition: all 0.22s ease; margin-bottom: 10px;
    box-shadow: 0 3px 14px rgba(16,185,129,0.3);
    letter-spacing: 0.02em;
  }
  .sd-cta-btn:hover { box-shadow: 0 6px 20px rgba(16,185,129,0.4); transform: translateY(-1px); }

  .sd-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .sd-action-btn {
    padding: 11px;
    background: transparent; color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
    border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s;
  }
  .sd-action-btn:hover { border-color: rgba(26,24,20,0.2); color: var(--ink); background: var(--cream-2); }
  .sd-action-btn-wa:hover { border-color: #25D366; color: #16a34a; background: rgba(37,211,102,0.06); }
  .sd-action-btn-call:hover { border-color: var(--green); color: var(--green-dark); background: rgba(16,185,129,0.06); }

  /* CONTACT NUMBER STRIP */
  .sd-contact-strip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; margin-top: 8px; margin-bottom: 10px;
    background: var(--cream-2); border: 1px solid var(--border);
    border-radius: 9px;
  }
  .sd-contact-strip-label { font-size: 11px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.07em; }
  .sd-contact-strip-num {
    font-size: 13.5px; font-weight: 600; color: var(--ink);
    text-decoration: none; letter-spacing: 0.03em;
    transition: color 0.18s;
  }
  .sd-contact-strip-num:hover { color: var(--green); }

  .sd-meet-btn {
    width: 100%; padding: 11px;
    background: transparent; color: var(--ink-soft);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
    border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
    transition: all 0.2s;
  }
  .sd-meet-btn:hover { border-color: var(--green); color: var(--green); }

  /* SELLER CARD */
  .sd-seller-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 16px; padding: 24px;
    box-shadow: 0 2px 12px rgba(26,24,20,0.04);
  }
  .sd-seller-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .sd-seller-avatar {
    width: 48px; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 600; color: var(--green-dark);
    border: 1px solid rgba(16,185,129,0.2);
  }
  .sd-seller-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  .sd-seller-tag { font-size: 12px; color: var(--ink-muted); display: flex; align-items: center; gap: 5px; }
  .sd-verified-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }

  .sd-contact-btn {
    width: 100%; padding: 11px;
    background: var(--ink); color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s;
  }
  .sd-contact-btn:hover { background: #2c2820; }

  /* PRICING PLANS */
  .plans-wrap { padding: 80px 24px; background: #fff; border-top: 1px solid var(--border); }
  .plans-inner { max-width: 1000px; margin: 0 auto; }
  .plans-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3vw, 42px); font-weight: 600;
    color: var(--ink); text-align: center; margin-bottom: 8px;
  }
  .plans-sub { text-align: center; color: var(--ink-muted); font-size: 14px; margin-bottom: 48px; }

  .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  @media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr; } }

  .plan-card {
    border: 1px solid var(--border); border-radius: 16px;
    padding: 32px; background: var(--cream-2);
    position: relative; transition: all 0.28s ease;
  }
  .plan-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,24,20,0.1); }
  .plan-card.popular {
    background: var(--ink); border-color: transparent;
    box-shadow: 0 8px 40px rgba(26,24,20,0.25);
    transform: scale(1.02);
  }
  .plan-card.popular:hover { transform: scale(1.02) translateY(-4px); }

  .plan-popular-tag {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--green); color: #fff;
    font-size: 11px; font-weight: 600; padding: 4px 16px;
    border-radius: 100px; letter-spacing: 0.05em; white-space: nowrap;
  }

  .plan-name {
    font-size: 12px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; margin-bottom: 18px;
  }
  .plan-card:not(.popular) .plan-name { color: var(--ink-muted); }
  .plan-card.popular .plan-name { color: rgba(245,240,235,0.5); }

  .plan-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px; font-weight: 600; line-height: 1;
    margin-bottom: 4px;
  }
  .plan-card:not(.popular) .plan-price { color: var(--ink); }
  .plan-card.popular .plan-price { color: var(--cream); }
  .plan-price-sub { font-size: 12px; margin-bottom: 24px; }
  .plan-card:not(.popular) .plan-price-sub { color: var(--ink-muted); }
  .plan-card.popular .plan-price-sub { color: rgba(245,240,235,0.35); }

  .plan-divider { height: 1px; margin-bottom: 20px; }
  .plan-card:not(.popular) .plan-divider { background: var(--border); }
  .plan-card.popular .plan-divider { background: rgba(245,240,235,0.1); }

  .plan-features { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; }
  .plan-feat {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px;
  }
  .plan-card:not(.popular) .plan-feat { color: var(--ink-soft); }
  .plan-card.popular .plan-feat { color: rgba(245,240,235,0.7); }
  .plan-check-icon {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .plan-card:not(.popular) .plan-check-icon { background: rgba(16,185,129,0.12); }
  .plan-card.popular .plan-check-icon { background: rgba(16,185,129,0.25); }

  .plan-btn {
    width: 100%; padding: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
    border-radius: 8px; cursor: pointer; transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .plan-card:not(.popular) .plan-btn {
    background: transparent; color: var(--ink);
    border: 1px solid rgba(26,24,20,0.18);
  }
  .plan-card:not(.popular) .plan-btn:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .plan-card.popular .plan-btn {
    background: var(--green); color: #fff; border: none;
    box-shadow: 0 3px 12px rgba(16,185,129,0.4);
  }
  .plan-card.popular .plan-btn:hover { background: var(--green-dark); }

  /* MODAL — removed, using LiveDemoModal component */
`

function ServiceDetails() {
  const location = useLocation()
  const navigate = useNavigate()

  // Try router state first (normal navigation).
  // Fall back to ?d= query param when opened in a new tab.
  let service = location?.state || null
  if (!service) {
    try {
      const params = new URLSearchParams(location.search)
      const d = params.get("d")
      if (d) service = JSON.parse(decodeURIComponent(atob(d)))
    } catch {
      service = null
    }
  }
  const [activeImage, setActiveImage] = useState(service?.image?.[0])
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [activePlan, setActivePlan] = useState("Basic")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [meetingData, setMeetingData] = useState(null)

  if (!service) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#faf7f4", fontFamily: "'DM Sans', sans-serif" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1a1814" }}>No service found</p>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", border: "1px solid rgba(26,24,20,0.15)", borderRadius: 8, cursor: "pointer", background: "transparent", fontSize: 14 }}>
            ← Go Back
          </button>
        </div>
      </>
    )
  }

  const basePrice = Number(String(service.price || service.basePrice || 0).replace(/[^\d.]/g, "")) || 0
  const packages = {
    Basic:    { price: basePrice,        days: 3, revisions: 2, features: ["2 design concepts", "JPG + PNG delivery", "Logo design only"] },
    Standard: { price: basePrice + 500,  days: 5, revisions: 4, features: ["4 design concepts", "Source files included", "High-res export"] },
    Premium:  { price: basePrice + 1000, days: 7, revisions: 6, features: ["6 design concepts", "All file formats", "Commercial rights"] },
  }

  const handleScheduleMeeting = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL.url}/meeting-scheduling`,
        { meetingDate: selectedDate, time: selectedTime },
        { headers: { Authorization: `Bearer ${BASE_URL.token}` }, withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        setMeetingData(res.data?.meeting)
        return true
      } else {
        toast.error(res.data.message)
        return false
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to schedule meeting")
      return false
    }
  }

  const highlights = ["Display optimization", "Premium lighting plan", "Customer flow design", "3D renders included", "Material list", "Execution guide"]
  const demoUrl = service.liveDemoUrl || "https://maker-lane-co.lovable.app/"

  return (
    <>
      <style>{STYLES}</style>
      <div className="sd-root">

        {/* BACK BAR */}
        <div className="sd-back-bar">
          <div className="sd-back-inner">
            <button className="sd-back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={15} strokeWidth={2} />
              Back to Designs
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="sd-layout">

          {/* LEFT CONTENT */}
          <div>
            {/* GALLERY */}
            <div className="sd-gallery">
              <img src={activeImage} alt={service.title} className="sd-main-img" />
              {service.image?.length > 1 && (
                <div className="sd-thumbs">
                  {service.image.map((img, i) => (
                    <img
                      key={i} src={img} alt=""
                      className={`sd-thumb${activeImage === img ? " active" : ""}`}
                      onClick={() => setActiveImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* META */}
            <div className="sd-meta">
              <div className="sd-badges">
                {service.category && <span className="sd-badge sd-badge-cat">{service.category}</span>}
                <span className="sd-badge sd-badge-offer">Limited Offer</span>
                <span className="sd-badge sd-badge-rating">
                  <span className="star">★</span> {service.rating || 4.8}
                  <span style={{ color: "var(--ink-muted)", fontSize: 11 }}>({service.reviews || service.totalReviews || 32} reviews)</span>
                </span>
              </div>

              <h1 className="sd-title">{service.title}</h1>
              <p className="sd-desc">{service.description}</p>

              {/* HIGHLIGHTS */}
              <div className="sd-section">
                <h3 className="sd-section-title">Key Highlights</h3>
                <div className="sd-feature-grid">
                  {highlights.map((h) => (
                    <div key={h} className="sd-feature-item">
                      <div className="sd-feature-check"><Check size={10} color="var(--green)" strokeWidth={2.5} /></div>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE PREVIEW */}
              <div className="sd-section">
                <h3 className="sd-section-title">Live Preview</h3>
                <button className="sd-preview-btn" onClick={() => setShowDemoModal(true)}>
                  <Zap size={15} strokeWidth={2} />
                  View Live Demo
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="sd-sidebar">
            <div className="sd-price-card">
              <div className="sd-price-wrap">
                <span className="sd-price">₹{basePrice}</span>
                <span className="sd-original-price">₹{basePrice + 4000}</span>
              </div>
              <div className="sd-discount-badge">64% OFF — Limited Time</div>

              <div className="sd-delivery-info">
                <div className="sd-delivery-item">
                  <Clock size={14} strokeWidth={2} /> 12 days delivery
                </div>
                <div className="sd-delivery-item">
                  <Zap size={14} strokeWidth={2} /> Instant preview available
                </div>
                <div className="sd-delivery-item">
                  <Check size={14} strokeWidth={2} /> Verified quality guaranteed
                </div>
              </div>

          
<button className="sd-preview-btn flex w-full items-center justify-center" onClick={() => setShowDemoModal(true)}>
                  <Zap size={15} strokeWidth={2} />
                  View Live Demo
                </button>
              <div className="sd-action-grid">
                <a
                  href="https://wa.me/917849082680"
                  target="_blank"
                  rel="noreferrer"
                  className="sd-action-btn sd-action-btn-wa"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25D366", flexShrink: 0 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="tel:+917849082680"
                  className="sd-action-btn sd-action-btn-call"
                  style={{ textDecoration: "none" }}
                >
                  <Phone size={14} strokeWidth={1.8} /> Call Us
                </a>
              </div>


              <button className="sd-meet-btn" onClick={() => setShowScheduleModal(true)}>
                Book a Consultation Meeting
              </button>
            </div>

          </div>

        </div>

        {/* PRICING PLANS */}
        <div className="plans-wrap">
          <div className="plans-inner">
            <h2 className="plans-title">Choose Your Package</h2>
            <p className="plans-sub">Flexible pricing for every budget and requirement</p>
            <div className="plans-grid">
              {Object.entries(packages).map(([plan, pkg]) => {
                const isPopular = plan === "Standard"
                return (
                  <div key={plan} className={`plan-card${isPopular ? " popular" : ""}`}>
                    {isPopular && <span className="plan-popular-tag">MOST POPULAR</span>}
                    <p className="plan-name">{plan}</p>
                    <p className="plan-price">₹{pkg.price}</p>
                    <p className="plan-price-sub">per design · {pkg.days} days delivery</p>
                    <div className="plan-divider" />
                    <ul className="plan-features">
                      {pkg.features.map(f => (
                        <li key={f} className="plan-feat">
                          <span className="plan-check-icon">
                            <Check size={10} color="var(--green)" strokeWidth={2.5} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="plan-btn"
                      onClick={() => { setActivePlan(plan); setShowScheduleModal(true) }}
                    >
                      Choose {plan}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* SCHEDULE MODAL */}
        {showScheduleModal && (
          <TimeSolt
            meetingData={meetingData}
            handleScheduleMeeting={handleScheduleMeeting}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onClose={() => setShowScheduleModal(false)}
            activePlan={activePlan}
            price={packages[activePlan].price}
          />
        )}

        {/* DEMO MODAL */}
        {showDemoModal && (
          <LiveDemoModal
            url={demoUrl}
            title={`Live Preview — ${service.title}`}
            onClose={() => setShowDemoModal(false)}
          />
        )}

      </div>
    </>
  )
}

export default ServiceDetails