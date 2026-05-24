import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, Send, Bot, User, FileSpreadsheet,
  AlertTriangle, CheckCircle2, Activity, Cpu,
  Loader2, Trash2
} from "lucide-react";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Welcome to **FactoryPulse AI Assistant**!\n\nUpload a CSV file with your manufacturing data and I'll analyze it. I can:\n\n• 🔍 Identify patterns and anomalies\n• 📊 Provide statistical insights\n• 📈 Analyze trends and correlations\n• 🔧 Suggest maintenance actions\n\nDrop your CSV above to get started!",
    },
  ]);
  const [chatMsg, setChatMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    const rows = lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
      return Object.fromEntries(headers.map((h, i) => [h, vals[i] || ""]));
    });
    return { headers, rows, rowCount: rows.length };
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const parsed = parseCSV(text);
      setCsvData({ ...parsed, rawText: text.slice(0, 8000) });
      setUploading(false);

      const msg = `✅ **File "${selectedFile.name}" uploaded!**\n\n• **${parsed.rowCount}** rows × **${parsed.headers.length}** columns\n• Columns: ${parsed.headers.slice(0, 6).join(", ")}${parsed.headers.length > 6 ? "..." : ""}\n\n💬 Ask me anything about your data!`;
      setMessages(prev => [...prev, { role: "bot", text: msg }]);
    };
    reader.readAsText(selectedFile);
  };

  const handleSend = async () => {
    if (!chatMsg.trim() || sending) return;
    const userMsg = chatMsg.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMsg("");
    setSending(true);

    const systemPrompt = csvData
      ? `You are FactoryPulse AI, an industrial manufacturing data analyst. The user has uploaded a CSV file named "${fileName}" with ${csvData.rowCount} rows and columns: ${csvData.headers.join(", ")}. Here is a sample of the data:\n${csvData.rawText.slice(0, 4000)}\n\nAnalyze this manufacturing data and answer questions about machine performance, failures, anomalies, and production insights. Be concise and actionable.`
      : `You are FactoryPulse AI, a smart manufacturing assistant for factory monitoring. Answer questions about predictive maintenance, machine efficiency, production optimization, and industrial AI. Be concise and practical.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const answer = data.content?.[0]?.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "bot", text: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "❌ API error: " + err.message }]);
    }
    setSending(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const quickQuestions = [
    "Give me a summary",
    "Any anomalies?",
    "Which machine needs attention?",
    "What's the failure rate?",
    "Show key trends",
    "Maintenance suggestions",
  ];

  const renderText = (text) =>
    text.split("\n").map((line, i) => {
      const processed = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">$1</code>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: processed }} style={{ display: "block", minHeight: line === "" ? 8 : "auto" }} />;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#060b14; font-family:'Inter',system-ui,sans-serif; }
        ::-webkit-scrollbar { width:5px }
        ::-webkit-scrollbar-track { background:#0d1117 }
        ::-webkit-scrollbar-thumb { background:#1e293b; border-radius:5px }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .chip:hover { background:rgba(99,102,241,0.18)!important; color:#a5b4fc!important; border-color:#6366f1!important; }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#060b14", color:"#e2e8f0" }}>
        {/* Header */}
        <header style={{ padding:"14px 24px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => navigate("/dashboard")} style={{ background:"#0d1117", border:"1px solid #1e293b", borderRadius:8, padding:"6px 12px", color:"#94a3b8", fontSize:12, cursor:"pointer" }}>← Back</button>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9" }}>AI Chat Assistant</h1>
              <p style={{ fontSize:11, color:"#475569" }}>Upload CSV · Ask questions · Get AI-powered answers</p>
            </div>
          </div>
          {csvData && (
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:999, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)" }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span style={{ fontSize:12, color:"#10b981", fontWeight:600 }}>{fileName}</span>
            </div>
          )}
        </header>

        <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:960, width:"100%", margin:"0 auto", padding:"0 16px", overflow:"hidden" }}>
          {/* Upload Zone */}
          <div className="fade-up"
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ margin:"16px 0 10px", background:dragActive?"rgba(99,102,241,0.08)":"rgba(13,17,23,0.6)", border:`2px dashed ${dragActive?"#6366f1":"#1e293b"}`, borderRadius:16, padding:"20px 24px", textAlign:"center", cursor:"pointer", transition:"all 0.3s" }}
          >
            <input ref={fileInputRef} type="file" accept=".csv" style={{ display:"none" }} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            {uploading ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <Loader2 size={20} color="#6366f1" style={{ animation:"spin 1s linear infinite" }} />
                <span style={{ fontSize:14, color:"#94a3b8" }}>Reading CSV file...</span>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>
                <Upload size={22} color={dragActive?"#6366f1":"#475569"} />
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:dragActive?"#a5b4fc":"#e2e8f0" }}>
                    {fileName ? `📁 ${fileName} — Click to replace` : "Drop CSV file or click to upload"}
                  </div>
                  <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Manufacturing sensor data, machine logs, telemetry records</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats bar after upload */}
          {csvData && (
            <div className="fade-up" style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
              {[
                { icon:<FileSpreadsheet size={13}/>, label:"Rows", value:csvData.rowCount, color:"#6366f1" },
                { icon:<Cpu size={13}/>, label:"Columns", value:csvData.headers.length, color:"#06b6d4" },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 100px", background:"#0d1117", border:"1px solid #1e293b", borderRadius:10, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, borderLeft:`3px solid ${s.color}` }}>
                  <span style={{ color:s.color }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:9, color:"#475569", textTransform:"uppercase", fontWeight:700, letterSpacing:1 }}>{s.label}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9" }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, padding:"8px 0 12px" }}>
            {messages.map((msg, i) => (
              <div key={i} className="fade-up" style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:8 }}>
                {msg.role==="bot" && (
                  <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                    <Bot size={15} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth:"76%", background:msg.role==="user"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#0d1117", border:msg.role==="bot"?"1px solid #1e293b":"none", borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"11px 14px", fontSize:13, lineHeight:1.65, color:msg.role==="user"?"#fff":"#cbd5e1" }}>
                  {renderText(msg.text)}
                </div>
                {msg.role==="user" && (
                  <div style={{ width:32, height:32, borderRadius:10, background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                    <User size={15} color="#94a3b8" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Bot size={15} color="#fff" />
                </div>
                <div style={{ background:"#0d1117", border:"1px solid #1e293b", borderRadius:"16px 16px 16px 4px", padding:"12px 16px", display:"flex", gap:4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", animation:`pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick questions */}
          {csvData && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingBottom:8 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} className="chip" onClick={() => { setChatMsg(q); setTimeout(() => { setChatMsg(""); setMessages(prev => [...prev, {role:"user", text:q}]); setSending(true); fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:`You are FactoryPulse AI analyzing a manufacturing CSV: ${csvData?.headers?.join(", ")}. Be concise.`,messages:[{role:"user",content:q}]})}).then(r=>r.json()).then(d=>setMessages(prev=>[...prev,{role:"bot",text:d.content?.[0]?.text||"No response"}])).catch(()=>setMessages(prev=>[...prev,{role:"bot",text:"❌ Error"}])).finally(()=>setSending(false)); }, 50); }} style={{ background:"rgba(99,102,241,0.08)", border:"1px solid #1e293b", borderRadius:999, padding:"5px 12px", color:"#94a3b8", fontSize:11, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{ padding:"10px 0 16px", borderTop:"1px solid #1e293b" }}>
            <div style={{ display:"flex", gap:8, background:"#0d1117", border:"1px solid #1e293b", borderRadius:14, padding:"6px 6px 6px 16px", alignItems:"center" }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSend()} placeholder={csvData?"Ask about your manufacturing data...":"Upload a CSV file or ask general questions..."} disabled={sending} style={{ flex:1, background:"none", border:"none", outline:"none", color:"#f1f5f9", fontSize:14 }} />
              <button onClick={handleSend} disabled={sending||!chatMsg.trim()} style={{ background:chatMsg.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#1e293b", border:"none", borderRadius:10, padding:"9px 16px", cursor:chatMsg.trim()?"pointer":"default", display:"flex", alignItems:"center", gap:6, color:"#fff", fontSize:13, fontWeight:600, opacity:chatMsg.trim()?1:0.5, transition:"all 0.2s" }}>
                <Send size={13} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
