import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Search, Shield, User } from "lucide-react";

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
  .um { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .um-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:12px; }
  .um-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; }
  .um-sub    { font-size:13px; color:var(--t2); margin-bottom:24px; }
  .um-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
  .um-search { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 14px; transition:border-color 0.2s; }
  .um-search:focus-within { border-color:var(--border2); }
  .um-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:9px 6px; width:200px; }
  .um-search input::placeholder { color:var(--t3); }

  .um-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; border:none; cursor:pointer; transition:all 0.2s; }
  .um-btn-green { background:var(--green); color:#fff; box-shadow:0 2px 12px rgba(16,185,129,0.25); }
  .um-btn-green:hover { background:var(--green-dk); transform:translateY(-1px); }
  .um-btn-ghost { background:var(--s2); color:var(--t2); border:1px solid var(--border); }
  .um-btn-ghost:hover { background:var(--s3); color:var(--text); }

  .um-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .um-table { width:100%; border-collapse:collapse; }
  .um-table thead tr { background:var(--s2); }
  .um-table th { padding:12px 18px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); border-bottom:1px solid var(--border); }
  .um-table td { padding:14px 18px; font-size:13.5px; color:var(--t2); border-bottom:1px solid var(--border); vertical-align:middle; }
  .um-table tbody tr:last-child td { border-bottom:none; }
  .um-table tbody tr:hover { background:var(--s2); }

  .um-avatar { width:34px; height:34px; border-radius:10px; background:var(--s3); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--green); flex-shrink:0; }
  .um-user-cell { display:flex; align-items:center; gap:10px; }
  .um-user-name { font-size:13.5px; font-weight:500; color:var(--text); }
  .um-user-email { font-size:12px; color:var(--t3); margin-top:1px; }

  .um-badge { display:inline-block; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
  .badge-admin { background:rgba(167,139,250,0.12); color:#a78bfa; border:1px solid rgba(167,139,250,0.2); }
  .badge-user  { background:var(--blue-dim); color:var(--blue); border:1px solid rgba(59,130,246,0.2); }

  .um-actions { display:flex; align-items:center; gap:8px; }
  .um-icon-btn { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.18s; }
  .um-icon-edit { background:var(--blue-dim); color:var(--blue); }
  .um-icon-edit:hover { background:rgba(59,130,246,0.2); }
  .um-icon-del  { background:var(--red-dim); color:var(--red); }
  .um-icon-del:hover  { background:rgba(239,68,68,0.2); }

  .um-empty { text-align:center; padding:60px 24px; color:var(--t3); }
  .um-empty h3 { font-family:'Syne',sans-serif; font-size:18px; color:var(--t2); margin-bottom:6px; }

  .um-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:24px; backdrop-filter:blur(6px); animation:umFade 0.2s ease; }
  @keyframes umFade { from{opacity:0} to{opacity:1} }
  .um-modal { background:var(--surface); border:1px solid var(--border2); border-radius:18px; width:100%; max-width:480px; box-shadow:0 32px 80px rgba(0,0,0,0.5); animation:umUp 0.25s cubic-bezier(0.4,0,0.2,1); overflow:hidden; }
  @keyframes umUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .um-modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); }
  .um-modal-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:600; color:var(--text); }
  .um-modal-close { width:30px; height:30px; border-radius:8px; background:var(--s2); border:1px solid var(--border); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--t2); transition:all 0.18s; }
  .um-modal-close:hover { background:var(--s3); color:var(--text); }
  .um-modal-body { padding:24px; }
  .um-modal-foot { padding:16px 24px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }

  .um-field { margin-bottom:16px; }
  .um-label { display:block; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--t3); margin-bottom:7px; }
  .um-input, .um-select { width:100%; padding:10px 14px; background:var(--s2); border:1px solid var(--border); border-radius:10px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13.5px; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  .um-input::placeholder { color:var(--t3); }
  .um-input:focus, .um-select:focus { border-color:var(--green); box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
  .um-field-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .um-hint { font-size:11.5px; color:var(--t3); margin-top:5px; }
`;

const EMPTY = { fullname: "", email: "", mobile: "", password: "", confirmPassword: "", role: "user" };

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const token = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${BASE_URL.url}/auth`, { headers, withCredentials: true })
      .then(r => { if (r.data.success) setUsers(r.data.users); })
      .catch(console.error);
  }, []);

  const openAdd  = () => { setForm(EMPTY); setModal({ open: true, mode: "add", data: null }); };
  const openEdit = (u) => {
    setForm({ fullname: u.fullname || u.name || "", email: u.email, mobile: u.mobile || "", password: "", confirmPassword: "", role: u.role || "user" });
    setModal({ open: true, mode: "edit", data: u });
  };
  const closeModal = () => setModal({ open: false, mode: "add", data: null });

  const handleSave = async () => {
    if (!form.fullname || !form.email) { toast.error("Name and email are required"); return; }
    if (modal.mode === "add" && (!form.password || form.password.length < 8)) { toast.error("Password must be at least 8 characters"); return; }
    if (form.password && form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      if (modal.mode === "add") {
        const res = await axios.post(`${BASE_URL.url}/auth/register`, form, { headers });
        if (res.data.success) {
          setUsers(prev => [...prev, res.data.user]);
          toast.success("User created"); closeModal();
        } else toast.error(res.data.message);
      } else {
        const payload = { fullname: form.fullname, email: form.email, mobile: form.mobile, role: form.role };
        if (form.password) payload.password = form.password;
        const res = await axios.put(`${BASE_URL.url}/auth/${modal.data._id}`, payload, { headers });
        if (res.data.success) {
          setUsers(prev => prev.map(u => u._id === modal.data._id ? { ...u, ...payload } : u));
          toast.success("User updated"); closeModal();
        } else toast.error(res.data.message);
      }
    } catch (e) { toast.error(e.response?.data?.message || "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await axios.delete(`${BASE_URL.url}/auth/${id}`, { headers, withCredentials: true });
      if (res.data.success) { setUsers(prev => prev.filter(u => u._id !== id)); toast.success("User deleted"); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to delete user"); }
  };

  const filtered = users.filter(u =>
    (u.fullname || u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (u) => {
    const n = u.fullname || u.name || u.email || "?";
    return n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <>
      <style>{S}</style>
      <div className="um">
        <div className="um-header">
          <div>
            <h1 className="um-title">Users</h1>
            <p className="um-sub">{users.length} registered users</p>
          </div>
          <button className="um-btn um-btn-green" onClick={openAdd}>
            <Plus size={16} strokeWidth={2.5} /> Add User
          </button>
        </div>

        <div className="um-toolbar">
          <div className="um-search">
            <Search size={15} color="var(--t3)" />
            <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: "var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4}><div className="um-empty"><h3>No users found</h3></div></td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u._id || i}>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar">{initials(u)}</div>
                      <div>
                        <div className="um-user-name">{u.fullname || u.name || "—"}</div>
                        <div className="um-user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.mobile || "—"}</td>
                  <td>
                    <span className={`um-badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>
                    <div className="um-actions">
                      <button className="um-icon-btn um-icon-edit" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                      <button className="um-icon-btn um-icon-del"  onClick={() => handleDelete(u._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modal.open && (
          <div className="um-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="um-modal">
              <div className="um-modal-head">
                <span className="um-modal-title">{modal.mode === "add" ? "Add User" : "Edit User"}</span>
                <button className="um-modal-close" onClick={closeModal}><X size={14} /></button>
              </div>
              <div className="um-modal-body">
                <div className="um-field-grid">
                  <div className="um-field" style={{ gridColumn: "1/-1" }}>
                    <label className="um-label">Full Name</label>
                    <input className="um-input" placeholder="John Doe" value={form.fullname} onChange={e => setForm({...form, fullname: e.target.value})} />
                  </div>
                  <div className="um-field" style={{ gridColumn: "1/-1" }}>
                    <label className="um-label">Email</label>
                    <input className="um-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="um-field">
                    <label className="um-label">Mobile</label>
                    <input className="um-input" type="tel" placeholder="10-digit number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                  </div>
                  <div className="um-field">
                    <label className="um-label">Role</label>
                    <select className="um-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="um-field">
                    <label className="um-label">Password {modal.mode === "edit" && <span style={{ textTransform: "none", letterSpacing: 0 }}>(leave blank to keep)</span>}</label>
                    <input className="um-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                  <div className="um-field">
                    <label className="um-label">Confirm Password</label>
                    <input className="um-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="um-modal-foot">
                <button className="um-btn um-btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="um-btn um-btn-green" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : modal.mode === "add" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}