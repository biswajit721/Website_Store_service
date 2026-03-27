import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag, X, Search } from "lucide-react";

const ICONS = ["Palette","Globe","Code2","Smartphone","Video","PenTool","TrendingUp","MessageSquare"];

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
  .cm { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .cm-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:12px; }
  .cm-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:var(--text); }
  .cm-sub    { font-size:13px; color:var(--t2); margin-bottom:24px; }

  .cm-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
  .cm-search  {
    display:flex; align-items:center; gap:8px;
    background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 14px;
    transition:border-color 0.2s;
  }
  .cm-search:focus-within { border-color:var(--border2); }
  .cm-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:9px 6px; width:200px; }
  .cm-search input::placeholder { color:var(--t3); }

  .cm-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; border:none; cursor:pointer; transition:all 0.2s; }
  .cm-btn-green { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.25); }
  .cm-btn-green:hover { background:var(--green-dk); transform:translateY(-1px); }
  .cm-btn-ghost { background:var(--s2); color:var(--t2); border:1px solid var(--border); }
  .cm-btn-ghost:hover { background:var(--s3); color:var(--text); }

  .cm-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .cm-table { width:100%; border-collapse:collapse; }
  .cm-table thead tr { background:var(--s2); }
  .cm-table th { padding:12px 18px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); border-bottom:1px solid var(--border); }
  .cm-table td { padding:14px 18px; font-size:13.5px; color:var(--t2); border-bottom:1px solid var(--border); vertical-align:middle; }
  .cm-table tbody tr:last-child td { border-bottom:none; }
  .cm-table tbody tr { transition:background 0.15s; }
  .cm-table tbody tr:hover { background:var(--s2); }
  .cm-td-main { color:var(--text) !important; font-weight:500; }

  .cm-icon-cell {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 10px; border-radius:8px; font-size:12px;
    background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2);
  }

  .cm-badge-active { display:inline-block; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }

  .cm-actions { display:flex; align-items:center; gap:8px; }
  .cm-icon-btn { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.18s; }
  .cm-icon-edit { background:var(--blue-dim); color:var(--blue); }
  .cm-icon-edit:hover { background:rgba(59,130,246,0.2); }
  .cm-icon-del  { background:var(--red-dim); color:var(--red); }
  .cm-icon-del:hover  { background:rgba(239,68,68,0.2); }

  .cm-empty { text-align:center; padding:60px 24px; color:var(--t3); }
  .cm-empty h3 { font-family:'Syne',sans-serif; font-size:18px; color:var(--t2); margin-bottom:6px; }

  /* MODAL */
  .cm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:24px; backdrop-filter:blur(6px); animation:cmFade 0.2s ease; }
  @keyframes cmFade { from{opacity:0} to{opacity:1} }
  .cm-modal { background:var(--surface); border:1px solid var(--border2); border-radius:18px; width:100%; max-width:480px; box-shadow:0 32px 80px rgba(0,0,0,0.5); animation:cmUp 0.25s cubic-bezier(0.4,0,0.2,1); overflow:hidden; }
  @keyframes cmUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .cm-modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); }
  .cm-modal-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:600; color:var(--text); }
  .cm-modal-close { width:30px; height:30px; border-radius:8px; background:var(--s2); border:1px solid var(--border); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--t2); transition:all 0.18s; }
  .cm-modal-close:hover { background:var(--s3); color:var(--text); }
  .cm-modal-body { padding:24px; }
  .cm-modal-foot { padding:16px 24px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }

  .cm-field { margin-bottom:18px; }
  .cm-label { display:block; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--t3); margin-bottom:7px; }
  .cm-input, .cm-select, .cm-textarea {
    width:100%; padding:10px 14px; background:var(--s2); border:1px solid var(--border);
    border-radius:10px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13.5px;
    outline:none; transition:border-color 0.2s, box-shadow 0.2s;
  }
  .cm-input::placeholder, .cm-textarea::placeholder { color:var(--t3); }
  .cm-input:focus, .cm-select:focus, .cm-textarea:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
  .cm-textarea { resize:vertical; min-height:80px; }
`;

const EMPTY_FORM = { name: "", description: "", icon: "" };

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const token = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${BASE_URL.url}/category/`)
      .then(r => { if (r.data.success) setCategories(r.data.category); })
      .catch(console.error);
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ open: true, mode: "add", data: null }); };
  const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description, icon: cat.icon }); setModal({ open: true, mode: "edit", data: cat }); };
  const closeModal = () => setModal({ open: false, mode: "add", data: null });

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.icon.trim()) {
      toast.error("All fields are required"); return;
    }
    setSaving(true);
    try {
      if (modal.mode === "add") {
        const res = await axios.post(`${BASE_URL.url}/category/`, form, { headers });
        if (res.data.success) {
          setCategories(prev => [...prev, res.data.category || res.data.data]);
          toast.success("Category created");
          closeModal();
        } else toast.error(res.data.message);
      } else {
        const res = await axios.put(`${BASE_URL.url}/category/${modal.data._id}`, form, { headers });
        if (res.data.success) {
          setCategories(prev => prev.map(c => c._id === modal.data._id ? { ...c, ...form } : c));
          toast.success("Category updated");
          closeModal();
        } else toast.error(res.data.message);
      }
    } catch { toast.error("Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await axios.delete(`${BASE_URL.url}/category/${id}`, { headers, withCredentials: true });
      if (res.data.success) { setCategories(prev => prev.filter(c => c._id !== id)); toast.success("Deleted"); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{S}</style>
      <div className="cm">
        <div className="cm-header">
          <div>
            <h1 className="cm-title">Categories</h1>
            <p className="cm-sub">{categories.length} categories total</p>
          </div>
          <button className="cm-btn cm-btn-green" onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} /> Add Category
          </button>
        </div>

        <div className="cm-toolbar">
          <div className="cm-search">
            <Search size={15} color="var(--t3)" />
            <input placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: "var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="cm-table-wrap">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Icon</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="cm-empty"><h3>No categories found</h3><p>Add one to get started</p></div>
                </td></tr>
              ) : filtered.map((cat, i) => (
                <tr key={cat._id || i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Tag size={14} color="var(--green)" />
                      </div>
                      <span className="cm-td-main">{cat.name}</span>
                    </div>
                  </td>
                  <td><span className="cm-icon-cell">{cat.icon}</span></td>
                  <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.description}</td>
                  <td><span className="cm-badge-active">Active</span></td>
                  <td>
                    <div className="cm-actions">
                      <button className="cm-icon-btn cm-icon-edit" onClick={() => openEdit(cat)} title="Edit"><Pencil size={14} /></button>
                      <button className="cm-icon-btn cm-icon-del"  onClick={() => handleDelete(cat._id)} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modal.open && (
          <div className="cm-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="cm-modal">
              <div className="cm-modal-head">
                <span className="cm-modal-title">{modal.mode === "add" ? "Add Category" : "Edit Category"}</span>
                <button className="cm-modal-close" onClick={closeModal}><X size={14} /></button>
              </div>
              <div className="cm-modal-body">
                <div className="cm-field">
                  <label className="cm-label">Name</label>
                  <input className="cm-input" placeholder="e.g. Web Design" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="cm-field">
                  <label className="cm-label">Description</label>
                  <textarea className="cm-textarea" placeholder="Brief description…" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
                </div>
                <div className="cm-field">
                  <label className="cm-label">Icon</label>
                  <select className="cm-select" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}>
                    <option value="">Select an icon</option>
                    {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
              <div className="cm-modal-foot">
                <button className="cm-btn cm-btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="cm-btn cm-btn-green" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : modal.mode === "add" ? "Create" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}