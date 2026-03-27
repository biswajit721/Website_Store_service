import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import { Trash2, ExternalLink, Search, Calendar, Mail, Phone } from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
    --blue:#3b82f6; --blue-dim:rgba(59,130,246,0.1);
  }
  .am { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .am-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:12px; }
  .am-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; }
  .am-sub    { font-size:13px; color:var(--t2); margin-bottom:24px; }
  .am-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
  .am-search { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 14px; }
  .am-search:focus-within { border-color:var(--border2); }
  .am-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:9px 6px; width:200px; }
  .am-search input::placeholder { color:var(--t3); }

  .am-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:auto; }
  .am-table { width:100%; border-collapse:collapse; min-width:800px; }
  .am-table thead tr { background:var(--s2); }
  .am-table th { padding:12px 18px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); border-bottom:1px solid var(--border); white-space:nowrap; }
  .am-table td { padding:14px 18px; font-size:13.5px; color:var(--t2); border-bottom:1px solid var(--border); vertical-align:middle; }
  .am-table tbody tr:last-child td { border-bottom:none; }
  .am-table tbody tr:hover { background:var(--s2); }
  .am-td-main { color:var(--text) !important; font-weight:500; }
  .am-td-sub  { font-size:12px; color:var(--t3); margin-top:2px; }

  .am-badge { display:inline-block; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
  .badge-online  { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }
  .badge-offline { background:var(--blue-dim); color:var(--blue); border:1px solid rgba(59,130,246,0.2); }

  .am-icon-btn { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.18s; }
  .am-icon-del { background:var(--red-dim); color:var(--red); }
  .am-icon-del:hover { background:rgba(239,68,68,0.2); }

  .am-link { color:var(--blue); font-size:12.5px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; }
  .am-link:hover { text-decoration:underline; }

  .am-loading { display:flex; align-items:center; justify-content:center; padding:80px; color:var(--t3); }
  .am-empty   { text-align:center; padding:60px 24px; color:var(--t3); }
  .am-empty h3 { font-family:'Syne',sans-serif; font-size:18px; color:var(--t2); margin-bottom:6px; }
`;

export default function AdminMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${BASE_URL.url}/meeting/`, { headers, withCredentials: true })
      .then(r => { if (r.data.success) setMeetings(r.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    try {
      const res = await axios.delete(`${BASE_URL.url}/meeting/${id}`, { headers, withCredentials: true });
      if (res.data.success) { setMeetings(prev => prev.filter(m => m._id !== id)); toast.success("Meeting deleted"); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = meetings.filter(m =>
    m.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <style>{S}</style>
      <div className="am">
        <div className="am-header">
          <div>
            <h1 className="am-title">Contact Meetings</h1>
            <p className="am-sub">{meetings.length} total inquiries</p>
          </div>
        </div>

        <div className="am-toolbar">
          <div className="am-search">
            <Search size={15} color="var(--t3)" />
            <input placeholder="Search by name, email, subject…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: "var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="am-table-wrap">
          {loading ? (
            <div className="am-loading">Loading meetings…</div>
          ) : (
            <table className="am-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Meeting Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8}><div className="am-empty"><h3>No meetings found</h3></div></td></tr>
                ) : filtered.map(m => (
                  <tr key={m._id}>
                    <td>
                      <div className="am-td-main">{m.clientName}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
                          <Mail size={11} color="var(--t3)" /> {m.email}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                          <Phone size={11} color="var(--t3)" /> {m.phone || "—"}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subject}</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
                        <Calendar size={11} color="var(--t3)" /> {fmt(m.DOM)}
                      </span>
                    </td>
                    <td>
                      <span className={`am-badge ${m.meetingType === "online" ? "badge-online" : "badge-offline"}`}>
                        {m.meetingType || "online"}
                      </span>
                    </td>
                    <td>{m.location || "—"}</td>
                    <td>
                      {m.meetingUrl
                        ? <a href={m.meetingUrl} target="_blank" rel="noreferrer" className="am-link">
                            Join <ExternalLink size={11} />
                          </a>
                        : <span style={{ color: "var(--t3)", fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td>
                      <button className="am-icon-btn am-icon-del" onClick={() => handleDelete(m._id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}