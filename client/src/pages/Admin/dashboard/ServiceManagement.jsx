import { useEffect, useState } from "react";
import {
  Plus, Eye, Pencil, Trash2, Search, X,
  Clock, Star, Zap, ExternalLink, ChevronLeft,
  ChevronRight, ImageIcon, Tag, DollarSign, User
} from "lucide-react";
import ServiceForm from "../UI/ServiceForm";
import axios from "axios";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
    --blue:#3b82f6; --blue-dim:rgba(59,130,246,0.1);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,0.1);
  }

  /* ── PAGE ── */
  .as { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .as-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:12px; }
  .as-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; }
  .as-sub    { font-size:13px; color:var(--t2); margin-bottom:24px; }
  .as-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
  .as-search { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 14px; transition:border-color 0.2s; }
  .as-search:focus-within { border-color:var(--border2); }
  .as-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:9px 6px; width:200px; }
  .as-search input::placeholder { color:var(--t3); }
  .as-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; border:none; cursor:pointer; transition:all 0.2s; }
  .as-btn-green { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.25); }
  .as-btn-green:hover { background:var(--green-dk); transform:translateY(-1px); }
  .as-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:auto; }
  .as-table { width:100%; border-collapse:collapse; min-width:820px; }
  .as-table thead tr { background:var(--s2); }
  .as-table th { padding:12px 18px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); border-bottom:1px solid var(--border); white-space:nowrap; }
  .as-table td { padding:14px 18px; font-size:13.5px; color:var(--t2); border-bottom:1px solid var(--border); vertical-align:middle; }
  .as-table tbody tr:last-child td { border-bottom:none; }
  .as-table tbody tr { transition:background 0.15s; cursor:default; }
  .as-table tbody tr:hover { background:var(--s2); }
  .as-td-main { color:var(--text) !important; font-weight:500; }
  .as-td-sub  { font-size:12px; color:var(--t3); margin-top:2px; }
  .as-thumb { width:48px; height:36px; border-radius:6px; object-fit:cover; border:1px solid var(--border); }
  .as-svc-cell { display:flex; align-items:center; gap:12px; }
  .as-badge { display:inline-block; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
  .badge-active  { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }
  .badge-pending { background:var(--amber-dim); color:var(--amber); border:1px solid rgba(245,158,11,0.2); }
  .as-price { font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:var(--text); }
  .as-orig  { font-size:11.5px; color:var(--t3); text-decoration:line-through; margin-left:5px; }
  .as-actions { display:flex; align-items:center; gap:8px; }
  .as-icon-btn { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.18s; }
  .as-icon-view { background:var(--green-dim); color:var(--green); }
  .as-icon-view:hover { background:rgba(16,185,129,0.2); }
  .as-icon-edit { background:var(--blue-dim); color:var(--blue); }
  .as-icon-edit:hover { background:rgba(59,130,246,0.2); }
  .as-icon-del  { background:var(--red-dim); color:var(--red); }
  .as-icon-del:hover { background:rgba(239,68,68,0.2); }
  .as-empty { text-align:center; padding:60px 24px; color:var(--t3); }
  .as-empty h3 { font-family:'Syne',sans-serif; font-size:18px; color:var(--t2); margin-bottom:6px; }

  /* ── VIEW PANEL OVERLAY ── */
  .vp-backdrop {
    position:fixed; inset:0;
    background:rgba(0,0,0,0.65);
    z-index:400;
    backdrop-filter:blur(4px);
    animation:vpBgIn 0.22s ease;
  }
  @keyframes vpBgIn { from{opacity:0} to{opacity:1} }

  /* slide-in panel from right */
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

  /* panel header */
  .vp-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 22px; border-bottom:1px solid var(--border); flex-shrink:0;
  }
  .vp-head-left { display:flex; align-items:center; gap:10px; }
  .vp-head-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--text); }
  .vp-close {
    width:30px; height:30px; border-radius:8px;
    background:var(--s2); border:1px solid var(--border);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    color:var(--t2); transition:all 0.16s;
  }
  .vp-close:hover { background:var(--s3); color:var(--text); }

  /* panel scrollable body */
  .vp-body {
    flex:1; overflow-y:auto; padding:0;
    scrollbar-width:thin; scrollbar-color:var(--s3) transparent;
  }
  .vp-body::-webkit-scrollbar { width:4px; }
  .vp-body::-webkit-scrollbar-thumb { background:var(--s3); border-radius:4px; }

  /* image gallery */
  .vp-gallery { position:relative; height:240px; background:var(--s2); flex-shrink:0; }
  .vp-gallery img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:opacity 0.25s ease;
  }
  .vp-gallery-empty {
    width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    color:var(--t3);
  }

  /* gallery nav arrows */
  .vp-arrow {
    position:absolute; top:50%; transform:translateY(-50%);
    width:32px; height:32px; border-radius:50%;
    background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.15);
    color:#fff; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:background 0.18s;
  }
  .vp-arrow:hover { background:rgba(0,0,0,0.8); }
  .vp-arrow-left  { left:12px; }
  .vp-arrow-right { right:12px; }

  /* dot indicators */
  .vp-dots {
    position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
    display:flex; gap:5px;
  }
  .vp-dot {
    width:6px; height:6px; border-radius:50%;
    background:rgba(255,255,255,0.35); transition:all 0.2s;
  }
  .vp-dot.active { background:#fff; width:18px; border-radius:3px; }

  /* image badge */
  .vp-img-count {
    position:absolute; top:12px; right:12px;
    background:rgba(0,0,0,0.6); color:#fff;
    font-size:11px; font-weight:500; padding:3px 9px; border-radius:100px;
    backdrop-filter:blur(4px);
  }

  /* thumbnail strip */
  .vp-thumbs {
    display:flex; gap:6px; padding:10px 22px;
    overflow-x:auto; background:var(--s2);
    border-bottom:1px solid var(--border);
    scrollbar-width:none;
  }
  .vp-thumbs::-webkit-scrollbar { display:none; }
  .vp-thumb {
    width:52px; height:40px; border-radius:6px; flex-shrink:0;
    object-fit:cover; cursor:pointer; transition:all 0.18s;
    border:2px solid transparent; opacity:0.55;
  }
  .vp-thumb.active { border-color:var(--green); opacity:1; }
  .vp-thumb:hover  { opacity:0.85; }

  /* content sections */
  .vp-content { padding:20px 22px; }

  .vp-title-row { margin-bottom:12px; }
  .vp-title {
    font-family:'Syne',sans-serif; font-size:20px; font-weight:700;
    color:var(--text); line-height:1.2; margin-bottom:10px;
  }
  .vp-tags { display:flex; flex-wrap:wrap; align-items:center; gap:7px; }
  .vp-tag {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500;
  }
  .vp-tag-cat    { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }
  .vp-tag-days   { background:var(--blue-dim);  color:var(--blue);  border:1px solid rgba(59,130,246,0.2); }
  .vp-tag-rating { background:var(--amber-dim); color:var(--amber); border:1px solid rgba(245,158,11,0.2); }

  /* divider */
  .vp-div { height:1px; background:var(--border); margin:18px 0; }

  /* price block */
  .vp-price-row { display:flex; align-items:baseline; gap:10px; margin-bottom:16px; }
  .vp-price {
    font-family:'Syne',sans-serif; font-size:32px; font-weight:700;
    color:var(--text); line-height:1;
  }
  .vp-orig { font-size:14px; color:var(--t3); text-decoration:line-through; }
  .vp-discount {
    padding:3px 10px; border-radius:100px;
    background:rgba(16,185,129,0.12); color:var(--green);
    border:1px solid rgba(16,185,129,0.2); font-size:12px; font-weight:600;
  }

  /* info grid */
  .vp-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
  .vp-info-item {
    background:var(--s2); border:1px solid var(--border);
    border-radius:10px; padding:12px 14px;
    display:flex; align-items:center; gap:10px;
  }
  .vp-info-icon { color:var(--green); flex-shrink:0; }
  .vp-info-lbl  { font-size:10.5px; color:var(--t3); text-transform:uppercase; letter-spacing:0.07em; margin-bottom:2px; }
  .vp-info-val  { font-size:13.5px; font-weight:500; color:var(--text); }

  /* description */
  .vp-sec-title { font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--t3); margin-bottom:10px; }
  .vp-desc { font-size:13.5px; color:var(--t2); line-height:1.75; }

  /* panel footer */
  .vp-foot {
    padding:16px 22px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:10px; flex-shrink:0;
    background:var(--surface);
  }
  .vp-foot-btn {
    flex:1; padding:11px; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    border:none; cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .vp-foot-edit { background:var(--blue-dim); color:var(--blue); border:1px solid rgba(59,130,246,0.2); }
  .vp-foot-edit:hover { background:rgba(59,130,246,0.18); }
  .vp-foot-del  { background:var(--red-dim); color:var(--red); border:1px solid rgba(239,68,68,0.2); }
  .vp-foot-del:hover  { background:rgba(239,68,68,0.18); }
  .vp-foot-demo {
    background:var(--green); color:#fff;
    box-shadow:0 2px 10px rgba(16,185,129,0.25);
  }
  .vp-foot-demo:hover { background:var(--green-dk); }
`;

/* ─────────────── VIEW PANEL ─────────────── */
function ViewPanel({ service, onClose, onEdit, onDelete }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = service.image || [];
  const hasImgs = images.length > 0;

  const prev = () => setImgIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx(i => (i + 1) % images.length);

  const discount = service.originalPrice && service.basePrice
    ? Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100)
    : null;

  return (
    <>
      {/* backdrop */}
      <div className="vp-backdrop" onClick={onClose} />

      {/* slide-in panel */}
      <div className="vp-panel">

        {/* HEAD */}
        <div className="vp-head">
          <div className="vp-head-left">
            <div className="vp-head-title">Service Details</div>
          </div>
          <button className="vp-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="vp-body">

          {/* GALLERY */}
          <div className="vp-gallery">
            {hasImgs ? (
              <>
                <img src={images[imgIdx]} alt={service.title} key={imgIdx} />
                {images.length > 1 && (
                  <>
                    <button className="vp-arrow vp-arrow-left"  onClick={prev}><ChevronLeft  size={16} /></button>
                    <button className="vp-arrow vp-arrow-right" onClick={next}><ChevronRight size={16} /></button>
                    <div className="vp-dots">
                      {images.map((_, i) => (
                        <div key={i} className={`vp-dot${i === imgIdx ? " active" : ""}`}
                          onClick={() => setImgIdx(i)} style={{ cursor:"pointer" }} />
                      ))}
                    </div>
                  </>
                )}
                {images.length > 1 && (
                  <div className="vp-img-count">{imgIdx + 1} / {images.length}</div>
                )}
              </>
            ) : (
              <div className="vp-gallery-empty"><ImageIcon size={40} /></div>
            )}
          </div>

          {/* THUMBNAIL STRIP */}
          {images.length > 1 && (
            <div className="vp-thumbs">
              {images.map((url, i) => (
                <img key={i} src={url} alt="" className={`vp-thumb${i === imgIdx ? " active" : ""}`}
                  onClick={() => setImgIdx(i)} />
              ))}
            </div>
          )}

          {/* CONTENT */}
          <div className="vp-content">

            {/* Title + tags */}
            <div className="vp-title-row">
              <div className="vp-title">{service.title}</div>
              <div className="vp-tags">
                {service.category && (
                  <span className="vp-tag vp-tag-cat"><Tag size={11} />{service.category}</span>
                )}
                {service.deliveryTime && (
                  <span className="vp-tag vp-tag-days"><Clock size={11} />{service.deliveryTime} days</span>
                )}
                {service.rating && (
                  <span className="vp-tag vp-tag-rating"><Star size={11} />{service.rating} ({service.totalReviews || 0})</span>
                )}
              </div>
            </div>

            <div className="vp-div" />

            {/* Price */}
            <div className="vp-price-row">
              <span className="vp-price">₹{service.basePrice}</span>
              {service.originalPrice && <span className="vp-orig">₹{service.originalPrice}</span>}
              {discount && <span className="vp-discount">{discount}% OFF</span>}
            </div>

            {/* Info grid */}
            <div className="vp-info-grid">
              <div className="vp-info-item">
                <User size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Author</div>
                  <div className="vp-info-val">{service.author || "—"}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <DollarSign size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Display Price</div>
                  <div className="vp-info-val">{service.displayPrice || `₹${service.basePrice}`}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <Clock size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Delivery</div>
                  <div className="vp-info-val">{service.deliveryTime ? `${service.deliveryTime} days` : "—"}</div>
                </div>
              </div>
              <div className="vp-info-item">
                <ImageIcon size={15} className="vp-info-icon" strokeWidth={1.8} />
                <div>
                  <div className="vp-info-lbl">Images</div>
                  <div className="vp-info-val">{images.length} uploaded</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <>
                <div className="vp-sec-title">Description</div>
                <p className="vp-desc">{service.description}</p>
              </>
            )}

            {/* Live demo link */}
            {service.liveDemoUrl && (
              <>
                <div className="vp-div" />
                <div className="vp-sec-title">Live Demo</div>
                <a href={service.liveDemoUrl} target="_blank" rel="noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:6, color:"var(--blue)", fontSize:13.5, textDecoration:"none" }}>
                  <ExternalLink size={13} /> {service.liveDemoUrl}
                </a>
              </>
            )}

          </div>{/* end vp-content */}
        </div>{/* end vp-body */}

        {/* FOOTER ACTIONS */}
        <div className="vp-foot">
          <button className="vp-foot-btn vp-foot-edit" onClick={onEdit}>
            <Pencil size={14} strokeWidth={2} /> Edit Service
          </button>
          <button className="vp-foot-btn vp-foot-del" onClick={onDelete}>
            <Trash2 size={14} strokeWidth={2} /> Delete
          </button>
          {service.liveDemoUrl && (
            <a href={service.liveDemoUrl} target="_blank" rel="noreferrer"
              className="vp-foot-btn vp-foot-demo" style={{ textDecoration:"none" }}>
              <Zap size={14} strokeWidth={2} /> Live Demo
            </a>
          )}
        </div>

      </div>
    </>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function AdminService() {
  const [services,  setServices]  = useState([]);
  const [openAdd,   setOpenAdd]   = useState(false);
  const [viewSvc,   setViewSvc]   = useState(null);   // service to view in panel
  const [search,    setSearch]    = useState("");
  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL.url}/service/`, { headers })
      .then(r => { if (r.data.success) setServices(r.data.service); })
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const res = await axios.delete(`${BASE_URL.url}/service/${id}`, { headers });
      if (res.data.success) {
        setServices(p => p.filter(s => s._id !== id));
        setViewSvc(null);
        toast.success("Service deleted");
      } else toast.error(res.data.message);
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{S}</style>
      <div className="as">

        <div className="as-header">
          <div>
            <h1 className="as-title">Services</h1>
            <p className="as-sub">{services.length} total services</p>
          </div>
          <button className="as-btn as-btn-green" onClick={() => setOpenAdd(true)}>
            <Plus size={16} strokeWidth={2.5} /> Add Service
          </button>
        </div>

        <div className="as-toolbar">
          <div className="as-search">
            <Search size={15} color="var(--t3)" />
            <input placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:13, color:"var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="as-table-wrap">
          <table className="as-table">
            <thead>
              <tr>
                <th>Service</th><th>Category</th><th>Author</th>
                <th>Pricing</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="as-empty"><h3>No services found</h3></div></td></tr>
              ) : filtered.map(svc => (
                <tr key={svc._id}>
                  <td>
                    <div className="as-svc-cell">
                      {svc.image?.[0]
                        ? <img src={svc.image[0]} alt="" className="as-thumb" />
                        : <div className="as-thumb" style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"var(--s2)" }}>
                            <ImageIcon size={14} color="var(--t3)" />
                          </div>
                      }
                      <div>
                        <div className="as-td-main" style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {svc.title}
                        </div>
                        <div className="as-td-sub">{svc.deliveryTime ? `${svc.deliveryTime} days` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td>{svc.category || "—"}</td>
                  <td>{svc.author || "—"}</td>
                  <td>
                    <span className="as-price">₹{svc.basePrice}</span>
                    {svc.originalPrice && <span className="as-orig">₹{svc.originalPrice}</span>}
                  </td>
                  <td>
                    <span className={`as-badge ${svc.status === "Pending" ? "badge-pending" : "badge-active"}`}>
                      {svc.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="as-actions">
                      {/* EYE → opens the panel */}
                      <button className="as-icon-btn as-icon-view" title="View details"
                        onClick={() => setViewSvc(svc)}>
                        <Eye size={14} />
                      </button>
                      {/* PENCIL → navigate to edit page */}
                      <button className="as-icon-btn as-icon-edit" title="Edit"
                        onClick={() => navigate("/admin/services/edit", { state: { service: svc } })}>
                        <Pencil size={14} />
                      </button>
                      {/* TRASH → delete */}
                      <button className="as-icon-btn as-icon-del" title="Delete"
                        onClick={() => handleDelete(svc._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD SERVICE MODAL */}
        {openAdd && (
          <ServiceForm
            onClose={() => setOpenAdd(false)}
            onCreated={svc => setServices(p => [...p, svc])}
          />
        )}

        {/* VIEW PANEL */}
        {viewSvc && (
          <ViewPanel
            service={viewSvc}
            onClose={() => setViewSvc(null)}
            onEdit={() => {
              setViewSvc(null);
              navigate("/admin/services/edit", { state: { service: viewSvc } });
            }}
            onDelete={() => handleDelete(viewSvc._id)}
          />
        )}

      </div>
    </>
  );
}