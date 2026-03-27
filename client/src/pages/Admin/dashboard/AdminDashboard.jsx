import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../components/BaseUrl";
import {
  DollarSign, ClipboardList, Package, Users,
  TrendingUp, Calendar, ArrowUpRight, ExternalLink
} from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0f1117; --surface:#161b27; --s2:#1e2535; --s3:#252d3d;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --green:#10b981; --green-dk:#059669; --green-dim:rgba(16,185,129,0.12);
    --text:#e8eaf0; --t2:#8b93a8; --t3:#4f5668;
    --blue:#3b82f6; --blue-dim:rgba(59,130,246,0.1);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,0.1);
    --red:#ef4444; --red-dim:rgba(239,68,68,0.1);
  }
  .db { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); padding:32px; min-height:100vh; }
  .db-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:var(--text); margin-bottom:4px; }
  .db-sub   { font-size:13px; color:var(--t2); margin-bottom:28px; }

  .db-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:16px; margin-bottom:28px; }
  .db-stat {
    background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:20px;
    transition:border-color 0.2s, transform 0.2s;
  }
  .db-stat:hover { border-color:var(--border2); transform:translateY(-2px); }
  .db-stat-icon {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
  }
  .db-stat-val { font-family:'Syne',sans-serif; font-size:30px; font-weight:700; color:var(--text); line-height:1; margin-bottom:4px; }
  .db-stat-lbl { font-size:12px; color:var(--t3); text-transform:uppercase; letter-spacing:0.07em; }
  .db-stat-trend { display:flex; align-items:center; gap:4px; font-size:11.5px; color:var(--green); margin-top:8px; }

  .db-grid2 { display:grid; grid-template-columns:1.6fr 1fr; gap:20px; }
  @media(max-width:900px){ .db-grid2 { grid-template-columns:1fr; } }

  .db-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .db-card-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-bottom:1px solid var(--border);
  }
  .db-card-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:var(--text); }

  .db-meeting-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:13px 20px; border-bottom:1px solid var(--border); transition:background 0.15s;
  }
  .db-meeting-row:last-child { border-bottom:none; }
  .db-meeting-row:hover { background:var(--s2); }
  .db-m-name { font-size:13.5px; font-weight:500; color:var(--text); }
  .db-m-sub  { font-size:11.5px; color:var(--t3); margin-top:2px; }

  .db-svc-row {
    display:grid; grid-template-columns:1fr auto;
    padding:13px 20px; border-bottom:1px solid var(--border);
    gap:12px; align-items:center; transition:background 0.15s;
  }
  .db-svc-row:last-child { border-bottom:none; }
  .db-svc-row:hover { background:var(--s2); }

  .adm-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
  .badge-green { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }
  .badge-blue  { background:var(--blue-dim);  color:var(--blue);  border:1px solid rgba(59,130,246,0.2); }
  .badge-amber { background:var(--amber-dim); color:var(--amber); border:1px solid rgba(245,158,11,0.2); }

  .db-empty { padding:40px; text-align:center; color:var(--t3); font-size:13px; }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, services: 0, meetings: 0, scheduledMeetings: 0 });
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const token = BASE_URL.token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const opts = { headers, withCredentials: true };
    Promise.allSettled([
      axios.get(`${BASE_URL.url}/auth`, opts),
      axios.get(`${BASE_URL.url}/service/`, opts),
      axios.get(`${BASE_URL.url}/meeting/`, opts),
      axios.get(`${BASE_URL.url}/meeting-scheduling/`, opts),
    ]).then(([u, s, m, sm]) => {
      setStats({
        users:             u.value?.data?.users?.length            || 0,
        services:          s.value?.data?.service?.length          || 0,
        meetings:          m.value?.data?.data?.length             || 0,
        scheduledMeetings: sm.value?.data?.data?.length            || 0,
      });
      setRecentMeetings((m.value?.data?.data || []).slice(0, 5));
      setRecentServices((s.value?.data?.service || []).slice(0, 5));
    });
  }, []);

  const statCards = [
    { icon: <Users size={18} />, val: stats.users,             lbl: "Total Users",       color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    { icon: <Package size={18} />, val: stats.services,         lbl: "Active Services",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    { icon: <ClipboardList size={18} />, val: stats.meetings,   lbl: "Contact Meetings",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { icon: <Calendar size={18} />, val: stats.scheduledMeetings, lbl: "Scheduled Calls", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  ];

  return (
    <>
      <style>{S}</style>
      <div className="db">
        <p className="db-title">Dashboard</p>
        <p className="db-sub">Welcome back — here's what's happening today.</p>

        <div className="db-stats">
          {statCards.map((s, i) => (
            <div key={i} className="db-stat">
              <div className="db-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="db-stat-val">{s.val}</div>
              <div className="db-stat-lbl">{s.lbl}</div>
              <div className="db-stat-trend"><TrendingUp size={12} /> Live data</div>
            </div>
          ))}
        </div>

        <div className="db-grid2">
          {/* Recent Meetings */}
          <div className="db-card">
            <div className="db-card-head">
              <span className="db-card-title">Recent Contact Meetings</span>
            </div>
            {recentMeetings.length === 0
              ? <div className="db-empty">No meetings yet</div>
              : recentMeetings.map((m, i) => (
                <div key={i} className="db-meeting-row">
                  <div>
                    <div className="db-m-name">{m.clientName}</div>
                    <div className="db-m-sub">{m.email} · {m.subject}</div>
                  </div>
                  <span className={`adm-badge ${m.meetingType === "online" ? "badge-green" : "badge-blue"}`}>
                    {m.meetingType}
                  </span>
                </div>
              ))
            }
          </div>

          {/* Recent Services */}
          <div className="db-card">
            <div className="db-card-head">
              <span className="db-card-title">Recent Services</span>
            </div>
            {recentServices.length === 0
              ? <div className="db-empty">No services yet</div>
              : recentServices.map((s, i) => (
                <div key={i} className="db-svc-row">
                  <div>
                    <div className="db-m-name">{s.title}</div>
                    <div className="db-m-sub">₹{s.basePrice} · {s.category}</div>
                  </div>
                  <span className="adm-badge badge-green">Active</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}