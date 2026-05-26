import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const productionData = [
  { time: "12 AM", actual: 200,  target: 300  },
  { time: "3 AM",  actual: 350,  target: 400  },
  { time: "6 AM",  actual: 500,  target: 550  },
  { time: "9 AM",  actual: 800,  target: 850  },
  { time: "12 PM", actual: 1150, target: 1200 },
  { time: "3 PM",  actual: 1300, target: 1280 },
  { time: "6 PM",  actual: 1100, target: 1150 },
  { time: "9 PM",  actual: 850,  target: 900  },
];

const machines = [
  { name: "CNC Machine 1",    status: "Running",     efficiency: 95, color: "#22c55e" },
  { name: "CNC Machine 2",    status: "Running",     efficiency: 90, color: "#22c55e" },
  { name: "Assembly Line 1",  status: "Running",     efficiency: 93, color: "#22c55e" },
  { name: "Packaging Unit",   status: "Idle",        efficiency: 70, color: "#eab308" },
  { name: "Quality Check",    status: "Maintenance", efficiency: 0,  color: "#ef4444" },
];

const alertsData = [
  { icon: "⚠️", iconBg: "#ef4444", title: "High Temperature Detected",  desc: "Machine CNC-02 temperature above threshold",   time: "10:24 AM", badge: "High",   badgeBg: "#ef4444", read: false },
  { icon: "⚠️", iconBg: "#eab308", title: "Maintenance Required",        desc: "Packaging Unit requires scheduled maintenance",  time: "09:15 AM", badge: "Medium", badgeBg: "#d97706", read: false },
  { icon: "ℹ️", iconBg: "#3b82f6", title: "Low Efficiency Warning",      desc: "Assembly Line 1 efficiency dropped below 85%",   time: "08:45 AM", badge: "Low",    badgeBg: "#3b82f6", read: false },
  { icon: "✅", iconBg: "#22c55e", title: "Daily Report Generated",      desc: "Daily production report is ready to view",       time: "07:30 AM", badge: "Info",   badgeBg: "#22c55e", read: true  },
];

const navItems = [
  { label: "Dashboard",   icon: "🏠", path: "/dashboard" },
  { label: "Predictions", icon: "🔮", path: "/predictions" },
  { label: "Machines",    icon: "⚙️", path: "/machines" },
  { label: "Reports",     icon: "📋", path: "/Report" },
  { label: "AI Assistant",icon: "🤖", path: "/ai-assistant" },
  { label: "Settings",    icon: "🔧", path: "/settings" },
];

const initChat = [
  { role: "bot", text: "Hello! I'm your FactoryPulse AI assistant. Ask me about your machines, production data, or maintenance schedules!" },
];

const EfficiencyBar = ({ value, color, darkMode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span style={{ color: darkMode ? "#e2e8f0" : "#475569", fontSize: 12, minWidth: 30 }}>{value}%</span>
    <div style={{ flex: 1, height: 6, background: darkMode ? "#1e293b" : "#e2e8f0", borderRadius: 3, overflow: "hidden", minWidth: 60 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
    </div>
  </div>
);

const StatCard = ({ icon, iconBg, label, value, change, positive, sparkColor, darkMode }) => (
  <div style={{ background: darkMode ? "#0f172a" : "#ffffff", border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`, borderRadius: 16, padding: "18px 20px", flex: "1 1 190px", minWidth: 0, display: "flex", alignItems: "flex-start", gap: 14 }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: darkMode ? "#94a3b8" : "#64748b", fontSize: 12, marginBottom: 3 }}>{label}</div>
      <div style={{ color: darkMode ? "#f1f5f9" : "#1e293b", fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: positive ? "#22c55e" : "#ef4444", fontSize: 11, marginTop: 3 }}>{positive ? "↑" : "↓"} {change} from yesterday</div>
    </div>
    <div style={{ width: 76, height: 38, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={productionData.slice(-6)}>
          <Line type="monotone" dataKey="actual" stroke={sparkColor} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const NotificationPanel = ({ alerts, onClose, onMarkAsRead, darkMode }) => {
  const unread = alerts.filter(a => !a.read).length;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 70, right: 20, width: 360, maxHeight: "80vh", background: darkMode ? "#0f172a" : "#ffffff", borderRadius: 16, boxShadow: "0 20px 35px -10px rgba(0,0,0,0.3)", border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`, zIndex: 201, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: darkMode ? "#f1f5f9" : "#0f172a" }}>🔔 Notifications</div>
          <div style={{ background: "#ef4444", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#fff" }}>{unread} new</div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {alerts.map((alert, idx) => (
            <div key={idx} style={{ padding: "14px 16px", borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`, background: !alert.read ? (darkMode ? "rgba(99,102,241,0.1)" : "#eff6ff") : "transparent", cursor: "pointer" }} onClick={() => onMarkAsRead(idx)}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: alert.iconBg + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>{alert.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? "#f1f5f9" : "#0f172a" }}>{alert.title}</div>
                  <div style={{ fontSize: 11, color: darkMode ? "#94a3b8" : "#64748b", marginTop: 3 }}>{alert.desc}</div>
                  <div style={{ fontSize: 10, color: darkMode ? "#475569" : "#94a3b8", marginTop: 5 }}>{alert.time}</div>
                </div>
                {!alert.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", marginTop: 8 }} />}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`, textAlign: "center" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState(initChat);
  const [darkMode, setDarkMode] = useState(true);
  const [alerts, setAlerts] = useState(alertsData);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!chatMsg.trim() || sending) return;
    const userMsg = chatMsg.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMsg("");
    setSending(true);
    try {
      const res = await fetch("https://fac-2.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: `You are FactoryPulse AI, embedded in a manufacturing dashboard. The factory has 5 machines (CNC Machine 1 & 2 running at 95/90%, Assembly Line 1 at 93%, Packaging Unit idle at 70%, Quality Check in maintenance). Today's production reached 1300 units vs 1280 target. Machine efficiency is 87%, energy usage 2847 kWh, defect rate 2.3%. Be concise and helpful.`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const answer = data.content?.[0]?.text || "I'm here to help! Ask me about machines, production, or maintenance.";
      setMessages(prev => [...prev, { role: "bot", text: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Connection issue. Please try again." }]);
    }
    setSending(false);
  };

  const handleNavClick = (item) => {
    setActiveNav(item.label);
    setSidebarOpen(false);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const markAlertAsRead = (index) => {
    setAlerts(prev => prev.map((a, i) => i === index ? { ...a, read: true } : a));
  };

  const unreadCount = alerts.filter(a => !a.read).length;
  const dateStr = time.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const bgColor = darkMode ? "#060d1a" : "#f1f5f9";
  const cardBg = darkMode ? "#0f172a" : "#ffffff";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";
  const headerBg = darkMode ? "#07111f" : "#ffffff";

  return (
    <div style={{ display: "flex", height: "100vh", background: bgColor, color: textColor, fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden", position: "relative", transition: "background 0.2s" }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${darkMode?"#0f172a":"#e2e8f0"}}
        ::-webkit-scrollbar-thumb{background:${darkMode?"#1e293b":"#cbd5e1"};border-radius:4px}
        @media(max-width:768px){
          .sidebar{position:fixed!important;top:0;left:0;height:100%!important;transform:translateX(-100%);transition:transform .3s!important;z-index:1000}
          .sidebar.open{transform:translateX(0)!important}
          .datetime-box{display:none!important}
        }
        @media(max-width:560px){
          .mid-row{flex-direction:column!important}
          .bot-row{flex-direction:column!important}
        }
        .nav-item:hover{background:${darkMode?"#1e293b":"#f1f5f9"}!important}
      `}</style>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40 }} />}
      {showNotifications && <NotificationPanel alerts={alerts} onClose={() => setShowNotifications(false)} onMarkAsRead={markAlertAsRead} darkMode={darkMode} />}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`} style={{ width: 220, background: darkMode ? "#07111f" : "#ffffff", borderRight: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", flexShrink: 0, transition: "transform .3s" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏭</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: textColor }}>FactoryPulse AI</div>
            <div style={{ fontSize: 10, color: textMuted }}>Smart Manufacturing</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => (
            <div key={item.label} className="nav-item" onClick={() => handleNavClick(item)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, marginBottom: 3, cursor: "pointer", background: activeNav === item.label ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent", color: activeNav === item.label ? "#fff" : textMuted, fontWeight: activeNav === item.label ? 600 : 400, fontSize: 13 }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${borderColor}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: textMuted, marginBottom: 10 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} /> All Systems Operational</div>
          <button onClick={handleLogout} style={{ width: "100%", padding: "8px", background: darkMode ? "#1e293b" : "#f1f5f9", border: "none", borderRadius: 8, color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>🚪 Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <header style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: textColor, display: "flex" }}>☰</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: textMuted }}>Welcome back, {user.name || "Admin"} 👋</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>AI Manufacturing Dashboard</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <div className="datetime-box" style={{ background: darkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${borderColor}`, borderRadius: 9, padding: "6px 12px", fontSize: 12, color: textMuted, whiteSpace: "nowrap" }}>📅 {dateStr} | {timeStr}</div>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotifications(true)}>
              <span style={{ fontSize: 21 }}>🔔</span>
              {unreadCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", borderRadius: "50%", width: 16, height: 16, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>{unreadCount}</span>}
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>{darkMode ? "☀️" : "🌙"}</button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
              {((user.name || user.email || "A")[0] || "A").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "18px 18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard icon="🏭" iconBg="rgba(99,102,241,.18)" label="Total Production" value="1,300" change="8.5%" positive={true} sparkColor="#6366f1" darkMode={darkMode} />
            <StatCard icon="📈" iconBg="rgba(34,197,94,.18)" label="Machine Efficiency" value="87%" change="3.2%" positive={true} sparkColor="#22c55e" darkMode={darkMode} />
            <StatCard icon="⚡" iconBg="rgba(234,179,8,.18)" label="Energy Usage" value="2847" change="4.7%" positive={false} sparkColor="#eab308" darkMode={darkMode} />
            <StatCard icon="🛡️" iconBg="rgba(139,92,246,.18)" label="Defect Rate" value="2.3%" change="0.6%" positive={false} sparkColor="#a78bfa" darkMode={darkMode} />
          </div>

          {/* Mid row */}
          <div className="mid-row" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "2 1 340px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "18px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>📈 Production Overview</div>
                <div style={{ background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: 7, padding: "4px 12px", fontSize: 12, color: textMuted }}>Today</div>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 8, fontSize: 11, color: textMuted }}><span>—— Actual</span><span>- - Target</span></div>
              <ResponsiveContainer width="100%" height={205}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e2e8f0"} />
                  <XAxis dataKey="time" stroke={darkMode ? "#475569" : "#94a3b8"} tick={{ fill: darkMode ? "#64748b" : "#64748b", fontSize: 10 }} />
                  <YAxis stroke={darkMode ? "#475569" : "#94a3b8"} tick={{ fill: darkMode ? "#64748b" : "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: darkMode ? "#0f172a" : "#fff", border: `1px solid ${borderColor}`, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: "1 1 260px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "18px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>⚙️ Machine Status</div>
                <span style={{ color: "#6366f1", fontSize: 12, cursor: "pointer" }} onClick={() => navigate("/machines")}>View All</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 88px 1fr", gap: "4px 8px", fontSize: 11, color: textMuted, paddingBottom: 8, borderBottom: `1px solid ${borderColor}`, marginBottom: 4 }}>
                <span>Machine</span><span>Status</span><span>Efficiency</span>
              </div>
              {machines.map((m, i) => (
                <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr 88px 1fr", gap: "4px 8px", alignItems: "center", padding: "9px 0", borderBottom: i < machines.length - 1 ? `1px solid ${borderColor}` : "none" }}>
                  <span style={{ fontSize: 12, color: textColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: m.color }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color }} />{m.status}
                  </span>
                  <EfficiencyBar value={m.efficiency} color={m.color} darkMode={darkMode} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="bot-row" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "18px 16px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>🔔 Recent Alerts</div>
              {alerts.slice(0, 4).map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${borderColor}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: a.iconBg + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{a.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: textMuted }}>{a.time}</div>
                    <span style={{ background: a.badgeBg, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: "#fff" }}>{a.badge}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: "1 1 300px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>🤖 AI Assistant</div>
              <div style={{ flex: 1, overflowY: "auto", minHeight: 150, maxHeight: 195, paddingRight: 2 }}>
                {messages.map((msg, i) => msg.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <div style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "11px 11px 2px 11px", padding: "8px 12px", fontSize: 12, maxWidth: "82%", color: "#fff" }}>{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: darkMode ? "#1e293b" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                    <div style={{ background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: "11px 11px 11px 2px", padding: "8px 12px", fontSize: 12, maxWidth: "82%", color: textColor }}>{msg.text}</div>
                  </div>
                ))}
                {sending && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: darkMode ? "#1e293b" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                    <div style={{ background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: "11px 11px 11px 2px", padding: "8px 12px", fontSize: 12, display: "flex", gap: 4, alignItems: "center" }}>
                      {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, background: darkMode ? "#1e293b" : "#f8fafc", borderRadius: 10, padding: "7px 10px", alignItems: "center" }}>
                <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask about your factory..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: textColor, fontSize: 12 }} />
                <button onClick={handleSend} disabled={sending} style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", opacity: sending ? 0.6 : 1 }}>✈ Send</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
