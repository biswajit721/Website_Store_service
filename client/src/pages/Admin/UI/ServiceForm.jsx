import axios from "axios";
import { useEffect, useState } from "react";
import { Upload, X, ImagePlus, User2, Plus } from "lucide-react";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
  }

  .sf-overlay {
    position:fixed; inset:0;
    background:rgba(0,0,0,0.82);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; padding:20px;
    backdrop-filter:blur(10px);
    animation:sfFade 0.18s ease;
  }
  @keyframes sfFade { from{opacity:0} to{opacity:1} }

  .sf-modal {
    background:var(--surface);
    border:1px solid var(--border2);
    border-radius:20px;
    width:100%; max-width:700px;
    height:90vh;
    display:flex; flex-direction:column;
    box-shadow:0 48px 120px rgba(0,0,0,0.7);
    animation:sfUp 0.22s cubic-bezier(0.4,0,0.2,1);
    overflow:hidden;
  }
  @keyframes sfUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .sf-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 26px 18px;
    border-bottom:1px solid var(--border);
    flex-shrink:0;
  }
  .sf-head-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:var(--text); }
  .sf-head-sub   { font-size:12px; color:var(--t3); margin-top:2px; }
  .sf-close {
    width:30px; height:30px; border-radius:8px;
    background:var(--s2); border:1px solid var(--border);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    color:var(--t2); transition:all 0.16s; flex-shrink:0;
  }
  .sf-close:hover { background:var(--s3); color:var(--text); }

  /* KEY: body is the scroll container */
  .sf-body {
    flex:1;
    overflow-y:auto;
    padding:22px 26px;
    scrollbar-width:thin;
    scrollbar-color:var(--s3) transparent;
  }
  .sf-body::-webkit-scrollbar { width:4px; }
  .sf-body::-webkit-scrollbar-thumb { background:var(--s3); border-radius:4px; }

  .sf-sec { margin-bottom:26px; }
  .sf-sec-lbl {
    font-size:10.5px; font-weight:600; letter-spacing:0.15em;
    text-transform:uppercase; color:var(--t3);
    margin-bottom:14px; padding-bottom:9px;
    border-bottom:1px solid var(--border);
  }

  .sf-g2 { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
  .sf-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:13px; }
  @media(max-width:520px){ .sf-g2,.sf-g3 { grid-template-columns:1fr; } }
  .sf-full { grid-column:1/-1; }

  .sf-f { display:flex; flex-direction:column; gap:6px; }
  .sf-lbl {
    font-size:10.5px; font-weight:500; letter-spacing:0.08em;
    text-transform:uppercase; color:var(--t3);
  }
  .sf-req { color:var(--green); margin-left:2px; }

  .sf-in, .sf-sel, .sf-ta {
    width:100%; padding:9px 13px;
    background:var(--s2); border:1px solid var(--border);
    border-radius:9px; color:var(--text);
    font-family:'DM Sans',sans-serif; font-size:13px;
    outline:none; transition:border-color 0.18s, box-shadow 0.18s;
    box-sizing:border-box;
  }
  .sf-in::placeholder, .sf-ta::placeholder { color:var(--t3); }
  .sf-in:focus,.sf-sel:focus,.sf-ta:focus {
    border-color:var(--green);
    box-shadow:0 0 0 3px rgba(16,185,129,0.1);
  }
  .sf-sel { cursor:pointer; appearance:none; }
  .sf-ta  { resize:vertical; min-height:82px; }
  .sf-in[type="number"]::-webkit-inner-spin-button { opacity:0.25; }

  /* upload zone */
  .sf-zone {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    border:1.5px dashed rgba(255,255,255,0.09); border-radius:11px;
    padding:22px 16px; cursor:pointer; transition:all 0.2s ease;
    background:var(--s2); text-align:center; user-select:none;
  }
  .sf-zone:hover { border-color:rgba(16,185,129,0.45); background:rgba(16,185,129,0.06); }
  .sf-zone-ico {
    width:36px; height:36px; border-radius:9px;
    background:var(--s3); display:flex; align-items:center; justify-content:center;
    margin-bottom:8px; transition:background 0.2s;
  }
  .sf-zone:hover .sf-zone-ico { background:rgba(16,185,129,0.18); }
  .sf-zone-txt { font-size:12.5px; color:var(--t2); }
  .sf-zone-sub { font-size:11px; color:var(--t3); margin-top:2px; }

  /* image previews */
  .sf-thumbs { display:grid; grid-template-columns:repeat(auto-fill,minmax(70px,1fr)); gap:8px; margin-top:10px; }
  .sf-thumb-wrap { position:relative; aspect-ratio:1; }
  .sf-thumb-wrap img { width:100%; height:100%; object-fit:cover; border-radius:7px; border:1px solid var(--border); display:block; }
  .sf-thumb-rm {
    position:absolute; top:-5px; right:-5px;
    width:18px; height:18px; border-radius:50%;
    background:var(--red); color:#fff; border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:transform 0.14s;
  }
  .sf-thumb-rm:hover { transform:scale(1.18); }
  .sf-thumb-add {
    aspect-ratio:1; border:1.5px dashed rgba(255,255,255,0.09); border-radius:7px;
    display:flex; align-items:center; justify-content:center;
    background:var(--s2); color:var(--t3); cursor:pointer; transition:all 0.18s;
  }
  .sf-thumb-add:hover { border-color:rgba(16,185,129,0.4); color:var(--green); }

  /* avatar */
  .sf-av-row { display:flex; align-items:center; gap:14px; }
  .sf-av-img {
    width:50px; height:50px; border-radius:12px;
    object-fit:cover; border:2px solid var(--green); flex-shrink:0;
  }
  .sf-av-ph {
    width:50px; height:50px; border-radius:12px; flex-shrink:0;
    background:var(--s2); border:1.5px dashed rgba(255,255,255,0.09);
    display:flex; align-items:center; justify-content:center; color:var(--t3);
  }
  .sf-av-btns { display:flex; flex-direction:column; gap:6px; }
  .sf-av-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 12px; border-radius:7px;
    background:var(--s2); border:1px solid var(--border);
    color:var(--t2); font-family:'DM Sans',sans-serif;
    font-size:12px; font-weight:500; cursor:pointer; transition:all 0.16s;
  }
  .sf-av-btn:hover { background:var(--s3); color:var(--text); }

  /* foot — sticky at bottom of modal */
  .sf-foot {
    display:flex; align-items:center; justify-content:space-between;
    padding:15px 26px; border-top:1px solid var(--border);
    flex-shrink:0; flex-wrap:wrap; gap:10px;
    background:var(--surface);
  }
  .sf-foot-note { font-size:11.5px; color:var(--t3); }

  .sf-btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    border:none; cursor:pointer; transition:all 0.18s;
  }
  .sf-btn-g  { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.22); }
  .sf-btn-g:hover { background:var(--green-dk); transform:translateY(-1px); }
  .sf-btn-g:disabled { opacity:0.5; pointer-events:none; }
  .sf-btn-gh { background:var(--s2); color:var(--t2); border:1px solid var(--border); }
  .sf-btn-gh:hover { background:var(--s3); color:var(--text); }
`;

const EMPTY = {
  title:"", author:"", category:"", description:"",
  basePrice:"", displayPrice:"", originalPrice:"",
  liveDemoUrl:"", deliveryTime:"",
};

const ServiceForm = ({ onClose, onCreated }) => {
  const [categories, setCategories] = useState([]);
  const [images,     setImages]     = useState([]);
  const [avatar,     setAvatar]     = useState(null);
  const [formData,   setFormData]   = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${BASE_URL.url}/category/`)
      .then(r => { if (r.data.success) setCategories(r.data.category); })
      .catch(console.error);
  }, []);

  const handle = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addImgs = (e) => {
    const files = Array.from(e.target.files);
    setImages(p => [...p, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = "";
  };

  const rmImg = (i) => {
    const next = [...images];
    URL.revokeObjectURL(next[i].preview);
    next.splice(i, 1);
    setImages(next);
  };

  const addAv = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (avatar) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file: f, preview: URL.createObjectURL(f) });
    e.target.value = "";
  };

  const rmAv = () => { if (avatar) URL.revokeObjectURL(avatar.preview); setAvatar(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.basePrice) {
      toast.error("Title, category and base price are required"); return;
    }
    if (images.length === 0) {
      toast.error("At least one service image is required"); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      images.forEach(img => fd.append("image", img.file));
      if (avatar) fd.append("avatar", avatar.file);

      const res = await axios.post(`${BASE_URL.url}/service/`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Service created");
        if (onCreated) onCreated(res.data.data || res.data.service);
        onClose();
      } else {
        toast.error(res.data.message || "Failed to create service");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="sf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="sf-modal">

          {/* HEAD */}
          <div className="sf-head">
            <div>
              <div className="sf-head-title">Add New Service</div>
              <div className="sf-head-sub">Fill in all details — the body scrolls</div>
            </div>
            <button className="sf-close" type="button" onClick={onClose}><X size={14} /></button>
          </div>

          {/* form wraps both scrollable body + sticky foot */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>

            {/* ── SCROLLABLE BODY ── */}
            <div className="sf-body">

              {/* BASIC INFO */}
              <div className="sf-sec">
                <div className="sf-sec-lbl">Basic Information</div>
                <div className="sf-g2">
                  <div className="sf-f">
                    <label className="sf-lbl">Title <span className="sf-req">*</span></label>
                    <input className="sf-in" name="title" value={formData.title} onChange={handle}
                      placeholder="e.g. Modern Living Room Design" required />
                  </div>
                  <div className="sf-f">
                    <label className="sf-lbl">Category <span className="sf-req">*</span></label>
                    <select className="sf-sel" name="category" value={formData.category} onChange={handle} required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="sf-f">
                    <label className="sf-lbl">Seller / Author</label>
                    <input className="sf-in" name="author" value={formData.author} onChange={handle} placeholder="Studio or person name" />
                  </div>
                  <div className="sf-f">
                    <label className="sf-lbl">Delivery Time (days)</label>
                    <input className="sf-in" name="deliveryTime" type="number" min={1}
                      value={formData.deliveryTime} onChange={handle} placeholder="7" />
                  </div>
                  <div className="sf-f sf-full">
                    <label className="sf-lbl">Live Demo URL</label>
                    <input className="sf-in" name="liveDemoUrl" type="url"
                      value={formData.liveDemoUrl} onChange={handle} placeholder="https://demo.example.com" />
                  </div>
                  <div className="sf-f sf-full">
                    <label className="sf-lbl">Description</label>
                    <textarea className="sf-ta" name="description" value={formData.description} onChange={handle}
                      placeholder="Describe what's included in this service package…" rows={4} />
                  </div>
                </div>
              </div>

              {/* PRICING */}
              <div className="sf-sec">
                <div className="sf-sec-lbl">Pricing</div>
                <div className="sf-g3">
                  <div className="sf-f">
                    <label className="sf-lbl">Base Price (₹) <span className="sf-req">*</span></label>
                    <input className="sf-in" name="basePrice" type="number" min={0}
                      value={formData.basePrice} onChange={handle} placeholder="3999" required />
                  </div>
                  <div className="sf-f">
                    <label className="sf-lbl">Original Price (₹)</label>
                    <input className="sf-in" name="originalPrice" type="number" min={0}
                      value={formData.originalPrice} onChange={handle} placeholder="7999" />
                  </div>
                  <div className="sf-f">
                    <label className="sf-lbl">Display Label</label>
                    <input className="sf-in" name="displayPrice" value={formData.displayPrice}
                      onChange={handle} placeholder='e.g. "From ₹3,999"' />
                  </div>
                </div>
              </div>

              {/* SERVICE IMAGES */}
              <div className="sf-sec">
                <div className="sf-sec-lbl">Service Images <span className="sf-req">*</span></div>
                <label htmlFor="sf-img-inp">
                  <div className="sf-zone">
                    <div className="sf-zone-ico"><ImagePlus size={17} color="var(--t2)" /></div>
                    <div className="sf-zone-txt">Click to upload service images</div>
                    <div className="sf-zone-sub">PNG · JPG · WEBP · up to 10 MB · multiple allowed</div>
                  </div>
                </label>
                <input id="sf-img-inp" type="file" multiple accept="image/*" onChange={addImgs} style={{ display:"none" }} />

                {images.length > 0 && (
                  <div className="sf-thumbs">
                    {images.map((img, i) => (
                      <div key={i} className="sf-thumb-wrap">
                        <img src={img.preview} alt="" />
                        <button type="button" className="sf-thumb-rm" onClick={() => rmImg(i)}>
                          <X size={9} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <label htmlFor="sf-img-inp">
                      <div className="sf-thumb-add"><Plus size={17} /></div>
                    </label>
                  </div>
                )}
              </div>

              {/* AVATAR */}
              <div className="sf-sec">
                <div className="sf-sec-lbl">Seller Avatar</div>
                <div className="sf-av-row">
                  {avatar
                    ? <img src={avatar.preview} alt="av" className="sf-av-img" />
                    : <div className="sf-av-ph"><User2 size={20} /></div>
                  }
                  <div className="sf-av-btns">
                    <label htmlFor="sf-av-inp">
                      <div className="sf-av-btn">
                        <Upload size={12} strokeWidth={2} />
                        {avatar ? "Change Avatar" : "Upload Avatar"}
                      </div>
                    </label>
                    {avatar && (
                      <button type="button" className="sf-av-btn" onClick={rmAv}
                        style={{ color:"var(--red)", borderColor:"rgba(239,68,68,0.2)" }}>
                        <X size={12} /> Remove
                      </button>
                    )}
                  </div>
                  <input id="sf-av-inp" type="file" accept="image/*" onChange={addAv} style={{ display:"none" }} />
                </div>
              </div>

            </div>{/* end sf-body */}

            {/* ── STICKY FOOT ── */}
            <div className="sf-foot">
              <span className="sf-foot-note"><span style={{ color:"var(--green)" }}>*</span> Required fields</span>
              <div style={{ display:"flex", gap:10 }}>
                <button type="button" className="sf-btn sf-btn-gh" onClick={onClose}>Cancel</button>
                <button type="submit"  className="sf-btn sf-btn-g"  disabled={submitting}>
                  {submitting ? "Creating…" : "Create Service"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default ServiceForm;