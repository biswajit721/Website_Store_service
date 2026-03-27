import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/BaseUrl";
import { toast } from "sonner";
import { Trash2, ExternalLink, Search, Calendar, Clock } from "lucide-react";

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
  .asm { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .asm-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .asm-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; }
  .asm-sub    { font-size:13px; color:var(--t2); margin-bottom:24px; }
  .asm-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
  .asm-search { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 14px; }
  .asm-search:focus-within { border-color:var(--border2); }
  .asm-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text); padding:9px 6px; width:220px; }
  .asm-search input::placeholder { color:var(--t3); }

  .asm-table-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:auto; }
  .asm-table { width:100%; border-collapse:collapse; min-width:700px; }
  .asm-table thead tr { background:var(--s2); }
  .asm-table th { padding:12px 18px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--t3); border-bottom:1px solid var(--border); white-space:nowrap; }
  .asm-table td { padding:14px 18px; font-size:13.5px; color:var(--t2); border-bottom:1px solid var(--border); vertical-align:middle; }
  .asm-table tbody tr:last-child td { border-bottom:none; }
  .asm-table tbody tr:hover { background:var(--s2); }
  .asm-td-main { color:var(--text) !important; font-weight:500; }
  .asm-td-sub  { font-size:12px; color:var(--t3); margin-top:2px; }

  .asm-avatar { width:34px; height:34px; border-radius:10px; background:var(--s3); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--green); flex-shrink:0; }
  .asm-user-cell { display:flex; align-items:center; gap:10px; }

  .asm-icon-btn { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.18s; }
  .asm-icon-del { background:var(--red-dim); color:var(--red); }
  .asm-icon-del:hover { background:rgba(239,68,68,0.2); }

  .asm-link { color:var(--blue); font-size:12.5px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; }
  .asm-link:hover { text-decoration:underline; }

  .asm-loading { display:flex; align-items:center; justify-content:center; padding:80px; color:var(--t3); }
  .asm-empty   { text-align:center; padding:60px 24px; color:var(--t3); }
  .asm-empty h3 { font-family:'Syne',sans-serif; font-size:18px; color:var(--t2); margin-bottom:6px; }

  .asm-date-cell { display:flex; align-items:center; gap:6px; font-size:12.5px; }
`;

export default function AdminScheduleMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${BASE_URL.url}/meeting-scheduling/`, { headers, withCredentials: true })
      .then(r => { if (r.data.success) setMeetings(r.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scheduled meeting?")) return;
    try {
      const res = await axios.delete(`${BASE_URL.url}/meeting-scheduling/${id}`, { headers, withCredentials: true });
      if (res.data.success) { setMeetings(prev => prev.filter(m => m._id !== id)); toast.success("Deleted"); }
      else toast.error(res.data.message);
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = meetings.filter(m => {
    const q = search.toLowerCase();
    return (
      m.userId?.fullname?.toLowerCase().includes(q) ||
      m.userId?.email?.toLowerCase().includes(q) ||
      m.meetingDate?.toLowerCase().includes(q)
    );
  });

  const initials = (u) => (u?.fullname || u?.email || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : d;

  return (
    <>
      <style>{S}</style>
      <div className="asm">
        <div className="asm-header">
          <div>
            <h1 className="asm-title">Scheduled Meetings</h1>
            <p className="asm-sub">{meetings.length} consultation calls booked</p>
          </div>
        </div>

        <div className="asm-toolbar">
          <div className="asm-search">
            <Search size={15} color="var(--t3)" />
            <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: "var(--t3)" }}>{filtered.length} results</span>
        </div>

        <div className="asm-table-wrap">
          {loading ? (
            <div className="asm-loading">Loading meetings…</div>
          ) : (
            <table className="asm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Meeting Date</th>
                  <th>Time</th>
                  <th>Meeting Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6}><div className="asm-empty"><h3>No scheduled meetings</h3></div></td></tr>
                ) : filtered.map(m => (
                  <tr key={m._id}>
                    <td>
                      <div className="asm-user-cell">
                        <div className="asm-avatar">{initials(m.userId)}</div>
                        <div>
                          <div className="asm-td-main">{m.userId?.fullname || "—"}</div>
                          <div className="asm-td-sub">{m.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="asm-td-sub">{m.userId?.mobile || "—"}</div>
                    </td>
                    <td>
                      <div className="asm-date-cell">
                        <Calendar size={12} color="var(--t3)" />
                        {fmt(m.meetingDate)}
                      </div>
                    </td>
                    <td>
                      <div className="asm-date-cell">
                        <Clock size={12} color="var(--t3)" />
                        {m.time || "—"}
                      </div>
                    </td>
                    <td>
                      {m.meetingLink
                        ? <a href={m.meetingLink} target="_blank" rel="noreferrer" className="asm-link">
                            Join <ExternalLink size={11} />
                          </a>
                        : <span style={{ color: "var(--t3)", fontSize: 12 }}>Not set</span>
                      }
                    </td>
                    <td>
                      <button className="asm-icon-btn asm-icon-del" onClick={() => handleDelete(m._id)}>
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