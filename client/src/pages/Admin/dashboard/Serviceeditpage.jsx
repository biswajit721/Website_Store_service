import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import {
  ArrowLeft, Upload, X, ImagePlus, User2, Plus, Save, Eye,
  ChevronLeft, ChevronRight, Clock, Star, Tag,
  DollarSign, User, ImageIcon, Zap, ExternalLink
} from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
    --blue:#3b82f6; --blue-dim:rgba(59,130,246,0.1);
  }

  .sep { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }

  /* ── TOP BAR ── */
  .sep-topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 32px; background:var(--surface);
    border-bottom:1px solid var(--border);
    position:sticky; top:0; z-index:50; flex-wrap:wrap; gap:12px;
  }
  .sep-topbar-left { display:flex; align-items:center; gap:14px; }
  .sep-back {
    display:inline-flex; align-items:center; gap:7px;
    padding:8px 14px; border-radius:9px;
    background:var(--s2); border:1px solid var(--border);
    color:var(--t2); font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:500; cursor:pointer; transition:all 0.18s;
  }
  .sep-back:hover { background:var(--s3); color:var(--text); }
  .sep-breadcrumb { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--t3); }
  .sep-breadcrumb span { color:var(--text); font-weight:500; }
  .sep-topbar-actions { display:flex; align-items:center; gap:10px; }

  .sep-btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    border:none; cursor:pointer; transition:all 0.2s;
  }
  .sep-btn-green { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.22); }
  .sep-btn-green:hover { background:var(--green-dk); transform:translateY(-1px); }
  .sep-btn-green:disabled { opacity:0.5; pointer-events:none; }
  .sep-btn-ghost { background:var(--s2); color:var(--t2); border:1px solid var(--border); }
  .sep-btn-ghost:hover { background:var(--s3); color:var(--text); }

  /* ── BODY LAYOUT ── */
  .sep-body {
    max-width:1100px; margin:0 auto;
    padding:36px 32px 80px;
    display:grid; grid-template-columns:1fr 320px; gap:28px;
    align-items:start;
  }
  @media(max-width:900px){ .sep-body { grid-template-columns:1fr; } }

  /* ── CARD ── */
  .sep-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:20px; }
  .sep-card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 22px; border-bottom:1px solid var(--border); }
  .sep-card-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:var(--text); }
  .sep-card-sub   { font-size:12px; color:var(--t3); margin-top:1px; }
  .sep-card-body  { padding:22px; }

  /* ── FIELDS ── */
  .sep-g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .sep-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  @media(max-width:600px){ .sep-g2,.sep-g3 { grid-template-columns:1fr; } }
  .sep-full { grid-column:1/-1; }
  .sep-f { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
  .sep-f:last-child { margin-bottom:0; }
  .sep-lbl { font-size:10.5px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--t3); }
  .sep-req { color:var(--green); margin-left:2px; }
  .sep-in, .sep-sel, .sep-ta {
    width:100%; padding:9px 13px;
    background:var(--s2); border:1px solid var(--border);
    border-radius:9px; color:var(--text);
    font-family:'DM Sans',sans-serif; font-size:13.5px;
    outline:none; transition:border-color 0.18s, box-shadow 0.18s; box-sizing:border-box;
  }
  .sep-in::placeholder,.sep-ta::placeholder { color:var(--t3); }
  .sep-in:focus,.sep-sel:focus,.sep-ta:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
  .sep-sel { cursor:pointer; appearance:none; }
  .sep-ta  { resize:vertical; min-height:90px; }
  .sep-in[type="number"]::-webkit-inner-spin-button { opacity:0.25; }

  /* ── IMAGES ── */
  .sep-img-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:10px; margin-bottom:14px; }
  .sep-img-item { position:relative; aspect-ratio:1; }
  .sep-img-item img { width:100%; height:100%; object-fit:cover; border-radius:9px; border:1px solid var(--border); display:block; }
  .sep-img-item.existing img { border-color:rgba(16,185,129,0.25); }
  .sep-img-badge { position:absolute; bottom:5px; left:5px; font-size:9px; font-weight:600; letter-spacing:0.05em; padding:2px 6px; border-radius:4px; text-transform:uppercase; }
  .sep-img-badge.existing { background:rgba(16,185,129,0.85); color:#fff; }
  .sep-img-badge.new      { background:rgba(59,130,246,0.85); color:#fff; }
  .sep-img-rm { position:absolute; top:-5px; right:-5px; width:19px; height:19px; border-radius:50%; background:var(--red); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:transform 0.14s; }
  .sep-img-rm:hover { transform:scale(1.18); }

  .sep-upload-zone { display:flex; flex-direction:column; align-items:center; justify-content:center; border:1.5px dashed rgba(255,255,255,0.09); border-radius:10px; padding:20px 14px; cursor:pointer; transition:all 0.2s ease; background:var(--s2); text-align:center; user-select:none; }
  .sep-upload-zone:hover { border-color:rgba(16,185,129,0.4); background:rgba(16,185,129,0.06); }
  .sep-zone-ico { width:34px; height:34px; border-radius:9px; background:var(--s3); display:flex; align-items:center; justify-content:center; margin-bottom:8px; transition:background 0.2s; }
  .sep-upload-zone:hover .sep-zone-ico { background:rgba(16,185,129,0.18); }
  .sep-zone-txt { font-size:12px; color:var(--t2); }
  .sep-zone-sub { font-size:11px; color:var(--t3); margin-top:2px; }
  .sep-img-note { font-size:11.5px; color:var(--t3); margin-top:8px; padding:8px 12px; background:var(--s2); border-radius:8px; border:1px solid var(--border); }

  /* ── AVATAR ── */
  .sep-av-row { display:flex; align-items:center; gap:14px; }
  .sep-av-img { width:56px; height:56px; border-radius:12px; object-fit:cover; border:2px solid var(--green); flex-shrink:0; }
  .sep-av-ph  { width:56px; height:56px; border-radius:12px; flex-shrink:0; background:var(--s2); border:1.5px dashed rgba(255,255,255,0.09); display:flex; align-items:center; justify-content:center; color:var(--t3); }
  .sep-av-btns { display:flex; flex-direction:column; gap:6px; }
  .sep-av-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:7px; background:var(--s2); border:1px solid var(--border); color:var(--t2); font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; transition:all 0.16s; }
  .sep-av-btn:hover { background:var(--s3); color:var(--text); }

  /* ── SIDEBAR ── */
  .sep-preview-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:16px; }
  .sep-preview-img  { width:100%; height:180px; object-fit:cover; display:block; background:var(--s2); }
  .sep-preview-body { padding:16px; }
  .sep-preview-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:600; color:var(--text); margin-bottom:6px; line-height:1.3; }
  .sep-preview-cat   { display:inline-block; padding:3px 9px; border-radius:100px; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); font-size:11px; margin-bottom:10px; }
  .sep-preview-price { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:var(--text); line-height:1; }
  .sep-preview-orig  { font-size:12px; color:var(--t3); text-decoration:line-through; margin-left:7px; }
  .sep-preview-desc  { font-size:12.5px; color:var(--t3); line-height:1.6; margin-top:10px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

  /* preview open button */
  .sep-preview-open-btn {
    display:flex; align-items:center; justify-content:center; gap:7px;
    width:100%; padding:10px; margin-top:12px;
    background:var(--s2); border:1px solid var(--border); border-radius:10px;
    color:var(--t2); font-family:'DM Sans',sans-serif; font-size:13px;
    cursor:pointer; transition:all 0.18s;
  }
  .sep-preview-open-btn:hover { background:var(--s3); color:var(--text); border-color:var(--border2); }

  .sep-meta-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:16px; }
  .sep-meta-title { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--t3); margin-bottom:14px; }
  .sep-meta-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); font-size:13px; }
  .sep-meta-row:last-child { border-bottom:none; }
  .sep-meta-key { color:var(--t3); }
  .sep-meta-val { color:var(--text); font-weight:500; }

  .sep-changed-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid rgba(245,158,11,0.2); font-size:11.5px; font-weight:500; }

  /* ══════════════════════════════════
     PREVIEW PANEL (same as AdminService)
  ══════════════════════════════════ */
  .vp-backdrop {
    position:fixed; inset:0;
    background:rgba(0,0,0,0.65);
    z-index:400; backdrop-filter:blur(4px);
    animation:vpBgIn 0.22s ease;
  }
  @keyframes vpBgIn { from{opacity:0} to{opacity:1} }

  .vp-panel {
    position:fixed; top:0; right:0; bottom:0;
    width:100%; max-width:560px;
    background:var(--surface);
    border-left:1px solid var(--border2);
    z-index:500;
    display:flex; flex-direction:column;
    box-shadow:-24px 0 80px rgba(0,0,0,0.5);
    animation:vpSlideIn 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow:hidden;
  }
  @keyframes vpSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

  .vp-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 22px; border-bottom:1px solid var(--border); flex-shrink:0;
  }
  .vp-head-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--text); }
  .vp-close {
    width:30px; height:30px; border-radius:8px;
    background:var(--s2); border:1px solid var(--border);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    color:var(--t2); transition:all 0.16s;
  }
  .vp-close:hover { background:var(--s3); color:var(--text); }

  .vp-body {
    flex:1; overflow-y:auto;
    scrollbar-width:thin; scrollbar-color:var(--s3) transparent;
  }
  .vp-body::-webkit-scrollbar { width:4px; }
  .vp-body::-webkit-scrollbar-thumb { background:var(--s3); border-radius:4px; }

  .vp-gallery { position:relative; height:240px; background:var(--s2); flex-shrink:0; }
  .vp-gallery img { width:100%; height:100%; object-fit:cover; display:block; transition:opacity 0.25s ease; }
  .vp-gallery-empty { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--t3); }

  .vp-arrow { position:absolute; top:50%; transform:translateY(-50%); width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.15); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.18s; }
  .vp-arrow:hover { background:rgba(0,0,0,0.8); }
  .vp-arrow-left  { left:12px; }
  .vp-arrow-right { right:12px; }

  .vp-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:5px; }
  .vp-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.35); transition:all 0.2s; cursor:pointer; }
  .vp-dot.active { background:#fff; width:18px; border-radius:3px; }
  .vp-img-count { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.6); color:#fff; font-size:11px; font-weight:500; padding:3px 9px; border-radius:100px; backdrop-filter:blur(4px); }

  .vp-thumbs { display:flex; gap:6px; padding:10px 22px; overflow-x:auto; background:var(--s2); border-bottom:1px solid var(--border); scrollbar-width:none; }
  .vp-thumbs::-webkit-scrollbar { display:none; }
  .vp-thumb { width:52px; height:40px; border-radius:6px; flex-shrink:0; object-fit:cover; cursor:pointer; transition:all 0.18s; border:2px solid transparent; opacity:0.55; }
  .vp-thumb.active { border-color:var(--green); opacity:1; }
  .vp-thumb:hover  { opacity:0.85; }

  .vp-content { padding:20px 22px; }
  .vp-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:var(--text); line-height:1.2; margin-bottom:10px; }
  .vp-tags  { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin-bottom:16px; }
  .vp-tag   { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
  .vp-tag-cat    { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }
  .vp-tag-days   { background:var(--blue-dim);  color:var(--blue);  border:1px solid rgba(59,130,246,0.2); }
  .vp-tag-rating { background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid rgba(245,158,11,0.2); }

  .vp-div { height:1px; background:var(--border); margin:16px 0; }
  .vp-price-row { display:flex; align-items:baseline; gap:10px; margin-bottom:16px; }
  .vp-price { font-family:'Syne',sans-serif; font-size:32px; font-weight:700; color:var(--text); line-height:1; }
  .vp-orig  { font-size:14px; color:var(--t3); text-decoration:line-through; }
  .vp-discount { padding:3px 10px; border-radius:100px; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); font-size:12px; font-weight:600; }

  .vp-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
  .vp-info-item { background:var(--s2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; display:flex; align-items:center; gap:10px; }
  .vp-info-icon { color:var(--green); flex-shrink:0; }
  .vp-info-lbl  { font-size:10.5px; color:var(--t3); text-transform:uppercase; letter-spacing:0.07em; margin-bottom:2px; }
  .vp-info-val  { font-size:13.5px; font-weight:500; color:var(--text); }

  .vp-sec-title { font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--t3); margin-bottom:10px; }
  .vp-desc { font-size:13.5px; color:var(--t2); line-height:1.75; }

  .vp-live-note {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 10px; border-radius:8px;
    background:rgba(245,158,11,0.08); color:#f59e0b;
    border:1px solid rgba(245,158,11,0.2); font-size:12px;
    margin-bottom:14px;
  }
`;

/* ─────────────────────────────────────
   PREVIEW PANEL — live data from form
───────────────────────────────────── */
function PreviewPanel({ form, existingImgs, newImgs, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);

  // merge existing URLs + new blob previews for gallery
  const allImages = [
    ...existingImgs,
    ...newImgs.map(n => n.preview),
  ];
  const hasImgs = allImages.length > 0;

  const prev = () => setImgIdx(i => (i - 1 + allImages.length) % allImages.length);
  const next = () => setImgIdx(i => (i + 1) % allImages.length);

  const discount = form.originalPrice && form.basePrice
    ? Math.round(((Number(form.originalPrice) - Number(form.basePrice)) / Number(form.originalPrice)) * 100)
    : null;

  return (
    <>
      <div className="vp-backdrop" onClick={onClose} />
      <div className="vp-panel">

        {/* HEAD */}
        <div className="vp-head">
          <span className="vp-head-title">Live Preview</span>
          <button className="vp-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="vp-body">

          {/* GALLERY */}
          <div className="vp-gallery">
            {hasImgs ? (
              <>
                <img src={allImages[imgIdx]} alt="preview" key={imgIdx} />
                {allImages.length > 1 && (
                  <>
                    <button className="vp-arrow vp-arrow-left"  onClick={prev}><ChevronLeft  size={16} /></button>
                    <button className="vp-arrow vp-arrow-right" onClick={next}><ChevronRight size={16} /></button>
                    <div className="vp-dots">
                      {allImages.map((_, i) => (
                        <div key={i} className={`vp-dot${i === imgIdx ? " active" : ""}`}
                          onClick={() => setImgIdx(i)} />
                      ))}
                    </div>
                    <div className="vp-img-count">{imgIdx + 1} / {allImages.length}</div>
                  </>
                )}
              </>
            ) : (
              <div className="vp-gallery-empty"><ImageIcon size={40} /></div>
            )}
          </div>

          {/* THUMBNAIL STRIP */}
          {allImages.length > 1 && (
            <div className="vp-thumbs">
              {allImages.map((url, i) => (
                <img key={i} src={url} alt="" className={`vp-thumb${i === imgIdx ? " active" : ""}`}
                  onClick={() => setImgIdx(i)} />
              ))}
            </div>
          )}

          {/* CONTENT */}
          <div className="vp-content">

            {/* live-edit notice */}
            <div className="vp-live-note">
              <Zap size={12} strokeWidth={2} />
              Previewing your unsaved edits in real-time
            </div>

            <div className="vp-title">{form.title || "Service Title"}</div>
            <div className="vp-tags">
              {form.category && <span className="vp-tag vp-tag-cat"><Tag size={11} />{form.category}</span>}
              {form.deliveryTime && <span className="vp-tag vp-tag-days"><Clock size={11} />{form.deliveryTime} days</span>}
            </div>

            <div className="vp-div" />

            {/* PRICE */}
            <div className="vp-price-row">
              <span className="vp-price">₹{form.basePrice || "—"}</span>
              {form.originalPrice && <span className="vp-orig">₹{form.originalPrice}</span>}
              {discount && discount > 0 && <span className="vp-discount">{discount}% OFF</span>}
            </div>

            {/* INFO GRID */}
            <div className="vp-info-grid">
              <div className="vp-info-item">
                <User size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Author</div>
                  <div className="vp-info-val">{form.author || "—"}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <DollarSign size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Display Price</div>
                  <div className="vp-info-val">{form.displayPrice || `₹${form.basePrice || "—"}`}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <Clock size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Delivery</div>
                  <div className="vp-info-val">{form.deliveryTime ? `${form.deliveryTime} days` : "—"}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <ImageIcon size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Images</div>
                  <div className="vp-info-val">{allImages.length} total</div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            {form.description && (
              <>
                <div className="vp-sec-title">Description</div>
                <p className="vp-desc">{form.description}</p>
              </>
            )}

            {/* DEMO URL */}
            {form.liveDemoUrl && (
              <>
                <div className="vp-div" />
                <div className="vp-sec-title">Live Demo</div>
                <a href={form.liveDemoUrl} target="_blank" rel="noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:6, color:"var(--blue)", fontSize:13.5, textDecoration:"none" }}>
                  <ExternalLink size={13} /> {form.liveDemoUrl}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────
   MAIN EDIT PAGE
───────────────────────────────────── */
export default function ServiceEditPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const service   = location.state?.service;

  const [categories,    setCategories]    = useState([]);
  const [saving,        setSaving]        = useState(false);
  const [showPreview,   setShowPreview]   = useState(false);   // ← controls panel

  const [form, setForm] = useState({
    title:         service?.title         || "",
    author:        service?.author        || "",
    category:      service?.category      || "",
    description:   service?.description   || "",
    basePrice:     service?.basePrice     || "",
    originalPrice: service?.originalPrice || "",
    displayPrice:  service?.displayPrice  || "",
    liveDemoUrl:   service?.liveDemoUrl   || "",
    deliveryTime:  service?.deliveryTime  || "",
  });

  const [existingImgs,  setExistingImgs]  = useState(service?.image  || []);
  const [newImgs,       setNewImgs]       = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(service?.avatar || null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [hasChanges,    setHasChanges]    = useState(false);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${BASE_URL.url}/category/`)
      .then(r => { if (r.data.success) setCategories(r.data.category); })
      .catch(console.error);
  }, []);

  if (!service) {
    return (
      <>
        <style>{S}</style>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"var(--bg)", fontFamily:"'DM Sans',sans-serif" }}>
          <p style={{ color:"var(--text)", fontSize:18 }}>No service data found.</p>
          <button className="sep-btn sep-btn-ghost" onClick={() => navigate("/admin/services")}>
            <ArrowLeft size={14} /> Back to Services
          </button>
        </div>
      </>
    );
  }

  const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setHasChanges(true); };

  const addNewImgs = (e) => {
    const files = Array.from(e.target.files);
    setNewImgs(p => [...p, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = "";
    setHasChanges(true);
  };

  const rmExistingImg = (idx) => { setExistingImgs(p => p.filter((_, i) => i !== idx)); setHasChanges(true); };
  const rmNewImg = (idx) => {
    const next = [...newImgs];
    URL.revokeObjectURL(next[idx].preview);
    next.splice(idx, 1);
    setNewImgs(next);
    setHasChanges(true);
  };

  const addAvatar = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (newAvatarFile) URL.revokeObjectURL(avatarPreview);
    setNewAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
    e.target.value = "";
    setHasChanges(true);
  };

  const rmAvatar = () => {
    if (newAvatarFile) URL.revokeObjectURL(avatarPreview);
    setNewAvatarFile(null);
    setAvatarPreview(null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.basePrice) { toast.error("Title, category and base price are required"); return; }
    if (existingImgs.length === 0 && newImgs.length === 0) { toast.error("At least one service image is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      existingImgs.forEach(url => fd.append("keepImages", url));
      newImgs.forEach(img => fd.append("image", img.file));
      if (newAvatarFile) fd.append("avatar", newAvatarFile);
      else if (!avatarPreview) fd.append("removeAvatar", "true");

      const res = await axios.put(`${BASE_URL.url}/service/${service._id}`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Service updated successfully");
        setHasChanges(false);
        setTimeout(() => navigate("/admin/services"), 1000);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const totalImages = existingImgs.length + newImgs.length;
  const previewImg  = newImgs[0]?.preview || existingImgs[0] || null;

  return (
    <>
      <style>{S}</style>
      <div className="sep">

        {/* TOP BAR */}
        <div className="sep-topbar">
          <div className="sep-topbar-left">
            <button className="sep-back" onClick={() => navigate("/admin/services")}>
              <ArrowLeft size={14} strokeWidth={2} /> Back
            </button>
            <div className="sep-breadcrumb">
              Services <span style={{ color:"var(--t3)", margin:"0 6px" }}>›</span>
              <span>Edit Service</span>
            </div>
          </div>
          <div className="sep-topbar-actions">
            {hasChanges && (
              <span className="sep-changed-badge">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />
                Unsaved changes
              </span>
            )}
            {/* Preview now opens the panel, no navigation */}
            <button className="sep-btn sep-btn-ghost" onClick={() => setShowPreview(true)}>
              <Eye size={14} strokeWidth={2} /> Preview
            </button>
            <button className="sep-btn sep-btn-green" onClick={handleSave} disabled={saving}>
              <Save size={14} strokeWidth={2} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="sep-body">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* BASIC INFO */}
            <div className="sep-card">
              <div className="sep-card-head">
                <div>
                  <div className="sep-card-title">Basic Information</div>
                  <div className="sep-card-sub">Title, category, seller and description</div>
                </div>
              </div>
              <div className="sep-card-body">
                <div className="sep-g2">
                  <div className="sep-f">
                    <label className="sep-lbl">Title <span className="sep-req">*</span></label>
                    <input className="sep-in" name="title" value={form.title} onChange={set} placeholder="Service title" />
                  </div>
                  <div className="sep-f">
                    <label className="sep-lbl">Category <span className="sep-req">*</span></label>
                    <select className="sep-sel" name="category" value={form.category} onChange={set}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="sep-f">
                    <label className="sep-lbl">Seller / Author</label>
                    <input className="sep-in" name="author" value={form.author} onChange={set} placeholder="Studio or person name" />
                  </div>
                  <div className="sep-f">
                    <label className="sep-lbl">Delivery Time (days)</label>
                    <input className="sep-in" name="deliveryTime" type="number" min={1} value={form.deliveryTime} onChange={set} placeholder="7" />
                  </div>
                  <div className="sep-f sep-full">
                    <label className="sep-lbl">Live Demo URL</label>
                    <input className="sep-in" name="liveDemoUrl" type="url" value={form.liveDemoUrl} onChange={set} placeholder="https://…" />
                  </div>
                  <div className="sep-f sep-full">
                    <label className="sep-lbl">Description</label>
                    <textarea className="sep-ta" name="description" value={form.description} onChange={set} rows={4}
                      placeholder="Describe this service package…" />
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className="sep-card">
              <div className="sep-card-head">
                <div>
                  <div className="sep-card-title">Pricing</div>
                  <div className="sep-card-sub">Set base, original and display pricing</div>
                </div>
              </div>
              <div className="sep-card-body">
                <div className="sep-g3">
                  <div className="sep-f">
                    <label className="sep-lbl">Base Price (₹) <span className="sep-req">*</span></label>
                    <input className="sep-in" name="basePrice" type="number" min={0} value={form.basePrice} onChange={set} placeholder="3999" />
                  </div>
                  <div className="sep-f">
                    <label className="sep-lbl">Original Price (₹)</label>
                    <input className="sep-in" name="originalPrice" type="number" min={0} value={form.originalPrice} onChange={set} placeholder="7999" />
                  </div>
                  <div className="sep-f">
                    <label className="sep-lbl">Display Label</label>
                    <input className="sep-in" name="displayPrice" value={form.displayPrice} onChange={set} placeholder='e.g. "From ₹3,999"' />
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGES */}
            <div className="sep-card">
              <div className="sep-card-head">
                <div>
                  <div className="sep-card-title">Service Images</div>
                  <div className="sep-card-sub">{totalImages} image{totalImages !== 1 ? "s" : ""} — existing shown with green border</div>
                </div>
              </div>
              <div className="sep-card-body">
                {totalImages > 0 && (
                  <div className="sep-img-grid">
                    {existingImgs.map((url, i) => (
                      <div key={`ex-${i}`} className="sep-img-item existing">
                        <img src={url} alt="" />
                        <span className="sep-img-badge existing">saved</span>
                        <button type="button" className="sep-img-rm" onClick={() => rmExistingImg(i)}>
                          <X size={9} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    {newImgs.map((img, i) => (
                      <div key={`new-${i}`} className="sep-img-item">
                        <img src={img.preview} alt="" />
                        <span className="sep-img-badge new">new</span>
                        <button type="button" className="sep-img-rm" onClick={() => rmNewImg(i)}>
                          <X size={9} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <label htmlFor="sep-img-inp" style={{ cursor:"pointer" }}>
                      <div style={{ aspectRatio:"1", border:"1.5px dashed rgba(255,255,255,0.09)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", background:"var(--s2)", color:"var(--t3)" }}>
                        <Plus size={18} />
                      </div>
                    </label>
                  </div>
                )}
                <label htmlFor="sep-img-inp">
                  <div className="sep-upload-zone">
                    <div className="sep-zone-ico"><ImagePlus size={16} color="var(--t2)" /></div>
                    <div className="sep-zone-txt">Click to add more images</div>
                    <div className="sep-zone-sub">PNG · JPG · WEBP · up to 10 MB</div>
                  </div>
                </label>
                <input id="sep-img-inp" type="file" multiple accept="image/*" onChange={addNewImgs} style={{ display:"none" }} />
                <p className="sep-img-note">ℹ️ Existing images (green border) are kept unless removed. New uploads are added alongside them.</p>
              </div>
            </div>

            {/* AVATAR */}
            <div className="sep-card">
              <div className="sep-card-head"><div className="sep-card-title">Seller Avatar</div></div>
              <div className="sep-card-body">
                <div className="sep-av-row">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" className="sep-av-img" />
                    : <div className="sep-av-ph"><User2 size={22} /></div>
                  }
                  <div className="sep-av-btns">
                    <label htmlFor="sep-av-inp">
                      <div className="sep-av-btn"><Upload size={12} strokeWidth={2} />{avatarPreview ? "Change Avatar" : "Upload Avatar"}</div>
                    </label>
                    {avatarPreview && (
                      <button type="button" className="sep-av-btn" onClick={rmAvatar}
                        style={{ color:"var(--red)", borderColor:"rgba(239,68,68,0.2)" }}>
                        <X size={12} /> Remove
                      </button>
                    )}
                  </div>
                  <input id="sep-av-inp" type="file" accept="image/*" onChange={addAvatar} style={{ display:"none" }} />
                </div>
              </div>
            </div>

          </div>{/* end left col */}

          {/* ── SIDEBAR ── */}
          <div className="sep-sidebar">

            {/* Mini preview card */}
            <div className="sep-preview-card">
              {previewImg
                ? <img src={previewImg} alt="preview" className="sep-preview-img" />
                : <div className="sep-preview-img" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <ImagePlus size={32} color="var(--t3)" />
                  </div>
              }
              <div className="sep-preview-body">
                <div className="sep-preview-title">{form.title || "Service Title"}</div>
                {form.category && <div className="sep-preview-cat">{form.category}</div>}
                <div>
                  <span className="sep-preview-price">₹{form.basePrice || "—"}</span>
                  {form.originalPrice && <span className="sep-preview-orig">₹{form.originalPrice}</span>}
                </div>
                {form.description && <p className="sep-preview-desc">{form.description}</p>}
              </div>
              {/* open full preview panel */}
              <div style={{ padding:"0 16px 16px" }}>
                <button className="sep-preview-open-btn" onClick={() => setShowPreview(true)}>
                  <Eye size={14} strokeWidth={2} /> Open Full Preview
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div className="sep-meta-card">
              <div className="sep-meta-title">Service Info</div>
              {[
                { key:"ID",       val: service._id?.slice(-8) || "—" },
                { key:"Images",   val: `${totalImages} image${totalImages !== 1 ? "s" : ""}` },
                { key:"Delivery", val: form.deliveryTime ? `${form.deliveryTime} days` : "—" },
                { key:"Author",   val: form.author || "—" },
                { key:"Demo URL", val: form.liveDemoUrl ? "Set" : "Not set" },
              ].map(row => (
                <div key={row.key} className="sep-meta-row">
                  <span className="sep-meta-key">{row.key}</span>
                  <span className="sep-meta-val">{row.val}</span>
                </div>
              ))}
            </div>

            <button className="sep-btn sep-btn-green" style={{ width:"100%", justifyContent:"center" }}
              onClick={handleSave} disabled={saving}>
              <Save size={15} strokeWidth={2} />
              {saving ? "Saving changes…" : "Save Changes"}
            </button>

          </div>
        </div>
      </div>

      {/* PREVIEW PANEL — no navigation, reads live form state */}
      {showPreview && (
        <PreviewPanel
          form={form}
          existingImgs={existingImgs}
          newImgs={newImgs}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}