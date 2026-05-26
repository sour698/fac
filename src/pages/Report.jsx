import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  FileText, Download, Printer, Plus, Trash2, ChevronDown,
  ChevronUp, BarChart2, PieChart as PieIcon, TrendingUp,
  AlertTriangle, CheckCircle, Clock, Factory, RefreshCw,
  Eye, EyeOff, GripVertical, Settings, X, Save, Upload,
  Cpu, Zap, Activity, ThermometerSun, Gauge, BarChart3
} from 'lucide-react';

// ─── API Base URL (disabled for demo) ─────────────────────────────────────────
const USE_BACKEND = true; // Set to true if you have a backend running
const API_BASE = 'https://fac-2.onrender.com';

// ─── DEMO DATA (Fallback when no backend) ─────────────────────────────────────
const DEMO_DASH_DATA = {
  has_data: true,
  stats: {
    totalProduction: 12450,
    machineEfficiency: 87.3,
    defectRate: 2.8,
    energyUsage: 2847,
  },
  productionData: [
    { time: "12 AM", actual: 320, target: 300 },
    { time: "3 AM",  actual: 380, target: 400 },
    { time: "6 AM",  actual: 520, target: 550 },
    { time: "9 AM",  actual: 780, target: 850 },
    { time: "12 PM", actual: 1120, target: 1200 },
    { time: "3 PM",  actual: 1340, target: 1280 },
    { time: "6 PM",  actual: 1080, target: 1150 },
    { time: "9 PM",  actual: 820, target: 900 },
  ],
  machines: [
    { name: "CNC Machine 1",   status: "Running",     efficiency: 95, color: "#3fb950" },
    { name: "CNC Machine 2",   status: "Running",     efficiency: 90, color: "#3fb950" },
    { name: "Assembly Line 1", status: "Running",     efficiency: 93, color: "#3fb950" },
    { name: "Packaging Unit",  status: "Idle",        efficiency: 70, color: "#d29922" },
    { name: "Quality Check",   status: "Maintenance", efficiency: 0,  color: "#f85149" },
    { name: "Transport Bot",   status: "Running",     efficiency: 88, color: "#3fb950" },
  ],
  alertsData: [
    { icon: "⚠️", badgeBg: "#f85149", title: "High Temperature Detected",  desc: "CNC-02 temperature above 85°C threshold",   time: "10:24 AM", badge: "High",   read: false },
    { icon: "⚠️", badgeBg: "#d29922", title: "Maintenance Required",        desc: "Packaging Unit requires scheduled lubrication",  time: "09:15 AM", badge: "Medium", read: false },
    { icon: "ℹ️", badgeBg: "#388bfd", title: "Low Efficiency Warning",      desc: "Assembly Line 1 efficiency dropped below 85%",   time: "08:45 AM", badge: "Low",    read: false },
    { icon: "✅", badgeBg: "#3fb950", title: "Daily Report Generated",      desc: "Daily production report is ready to view",       time: "07:30 AM", badge: "Info",   read: true  },
    { icon: "⚠️", badgeBg: "#f85149", title: "Vibration Anomaly",           desc: "Machine Bearing shows unusual pattern",        time: "06:45 AM", badge: "High",   read: false },
  ],
};

const DEMO_PRED_DATA = {
  has_data: true,
  plantData: {
    avgTemp: 72.4,
    maxVibration: 3.2,
    avgPressure: 145.6,
    overallEfficiency: 86.4,
    maintenanceOverdueCount: 2,
    errorState: false,
    warningState: true,
    timestamp: "2024-01-15 14:30",
  },
  heatmapData: [
    { week: "W1", temp: 68, vib: 2.4, press: 138, eff: 84 },
    { week: "W2", temp: 71, vib: 2.7, press: 142, eff: 86 },
    { week: "W3", temp: 73, vib: 2.9, press: 145, eff: 87 },
    { week: "W4", temp: 72, vib: 3.1, press: 146, eff: 86 },
    { week: "W5", temp: 74, vib: 3.0, press: 144, eff: 88 },
    { week: "W6", temp: 75, vib: 3.2, press: 147, eff: 87 },
    { week: "W7", temp: 72, vib: 2.8, press: 143, eff: 86 },
    { week: "W8", temp: 71, vib: 2.6, press: 141, eff: 85 },
  ],
};

const DEMO_UPLOAD_RESULT = {
  success: true,
  filename: "factory_data_sample.csv",
  rows: 1250,
  predictions: {
    failure_count: 42,
    no_failure_count: 1208,
  },
  anomalies: {
    anomaly_count: 87,
    normal_count: 1163,
  },
  summary: {
    numeric_stats: {
      temperature: { mean: 72.4, std: 5.2, min: 58, max: 89, "50%": 73 },
      vibration: { mean: 2.8, std: 0.6, min: 1.2, max: 4.5, "50%": 2.7 },
      pressure: { mean: 144.2, std: 8.3, min: 118, max: 168, "50%": 145 },
      rpm: { mean: 2850, std: 320, min: 2100, max: 3450, "50%": 2880 },
      torque: { mean: 47.3, std: 6.1, min: 32, max: 62, "50%": 48 },
      efficiency: { mean: 86.4, std: 4.8, min: 72, max: 96, "50%": 87 },
    },
  },
};

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  bg:        '#0d1117',
  bgCard:    '#161b22',
  bgCard2:   '#1c2333',
  border:    '#30363d',
  borderAcc: '#388bfd',
  text:      '#e6edf3',
  textSub:   '#8b949e',
  textMuted: '#484f58',
  grid:      '#21262d',
  accent:    '#388bfd',
  accentGlow:'rgba(56,139,253,0.15)',
  green:     '#3fb950',
  yellow:    '#d29922',
  red:       '#f85149',
  orange:    '#e3b341',
  purple:    '#a371f7',
};

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (v, d = 1) => (typeof v === 'number' && !isNaN(v) ? v.toFixed(d) : '—');

const severityColor = s =>
  s === 'high' ? T.red : s === 'medium' ? T.yellow : T.green;

const statusColor = s =>
  s === 'overdue' ? T.red : s === 'monitoring' ? T.yellow : s === 'open' ? T.orange : T.green;

const priorityColor = p =>
  p === 'critical' ? T.red : p === 'high' ? T.orange : p === 'medium' ? T.yellow : T.green;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.bgCard2, border: `1px solid ${T.border}`,
      borderRadius: 8, padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
    }}>
      <p style={{ color: T.textSub, marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
    textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4,
    background: color + '22', color, border: `1px solid ${color}44`,
    fontFamily: "'JetBrains Mono', monospace",
  }}>{label}</span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color = T.accent }) => (
  <div style={{
    background: T.bgCard, border: `1px solid ${T.border}`,
    borderRadius: 10, padding: '16px 18px',
    borderLeft: `3px solid ${color}`,
    display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: T.textMuted, fontWeight: 700 }}>{label}</p>
      {Icon && <Icon size={14} color={color} />}
    </div>
    <p style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: 11, color: T.textSub }}>{sub}</p>}
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, visible, onToggle, onRemove }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: visible ? 16 : 0 }}>
    <span style={{ color: T.accent, display: 'flex' }}>{icon}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: T.text, flex: 1, letterSpacing: -0.3 }}>{title}</span>
    <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, display: 'flex', padding: 4, borderRadius: 4 }}>
      {visible ? <EyeOff size={13} /> : <Eye size={13} />}
    </button>
    <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.red + 'bb', display: 'flex', padding: 4, borderRadius: 4 }}>
      <X size={13} />
    </button>
  </div>
);

// ────────────────────────── SECTION COMPONENTS ────────────────────────────────

// KPI Summary — uses /dashboard-data stats + /prediction-data plantData
const KPIGrid = ({ data }) => {
  const { dashData, predData } = data;
  const stats = dashData?.stats || {};
  const plant = predData?.plantData || {};

  const cards = [
    { label: 'Total Production', value: stats.totalProduction?.toLocaleString() ?? '12,450', icon: BarChart3, color: T.accent },
    { label: 'Machine Efficiency', value: stats.machineEfficiency != null ? `${fmt(stats.machineEfficiency)}%` : '87.3%', icon: Cpu, color: T.green },
    { label: 'Defect Rate', value: stats.defectRate != null ? `${fmt(stats.defectRate)}%` : '2.8%', icon: AlertTriangle, color: T.red },
    { label: 'Energy Usage', value: stats.energyUsage != null ? `${stats.energyUsage} kW` : '2,847 kW', icon: Zap, color: T.yellow },
    { label: 'Avg Temp', value: plant.avgTemp != null ? `${fmt(plant.avgTemp)}°C` : '72.4°C', icon: ThermometerSun, color: T.orange },
    { label: 'Overall Efficiency', value: plant.overallEfficiency != null ? `${fmt(plant.overallEfficiency)}%` : '86.4%', icon: Activity, color: T.purple },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
      {cards.map((c, i) => <StatCard key={i} {...c} />)}
    </div>
  );
};

// Production Chart — uses /dashboard-data productionData
const ProductionChart = ({ data }) => {
  const chartData = data.dashData?.productionData || DEMO_DASH_DATA.productionData;
  if (!chartData.length) return <EmptyState msg="No production data available" />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.grid} vertical={false} />
        <XAxis dataKey="time" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: T.textSub, fontSize: 11 }} />
        <Bar dataKey="actual" name="Actual" fill={T.accent} radius={[4, 4, 0, 0]} barSize={24} />
        <Bar dataKey="target" name="Target" fill={T.green} radius={[4, 4, 0, 0]} barSize={24} opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Sensor / Heatmap trends — uses /prediction-data heatmapData
const SensorChart = ({ data }) => {
  const chartData = data.predData?.heatmapData || DEMO_PRED_DATA.heatmapData;
  if (!chartData.length) return <EmptyState msg="No sensor trend data available" />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.grid} vertical={false} />
        <XAxis dataKey="week" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left"  tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: T.textSub, fontSize: 11 }} />
        <Line yAxisId="left"  type="monotone" dataKey="temp"  name="Temp (°C)"  stroke={T.red}    strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line yAxisId="right" type="monotone" dataKey="vib"   name="Vibration"  stroke={T.yellow} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line yAxisId="left"  type="monotone" dataKey="press" name="Pressure"   stroke={T.accent} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line yAxisId="left"  type="monotone" dataKey="eff"   name="Eff (%)"    stroke={T.green}  strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Machine Status / Risk — uses /dashboard-data machines
const MachineStatus = ({ data }) => {
  const machines = data.dashData?.machines || DEMO_DASH_DATA.machines;
  if (!machines.length) return <EmptyState msg="No machine data available" />;

  const pieData = machines.map(m => ({
    name: m.name, value: Math.round(m.efficiency),
    color: m.color,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
            outerRadius={80} innerRadius={44} paddingAngle={3}
            label={({ name, value }) => `${value}%`}>
            {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {machines.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', borderRadius: 8, background: T.bgCard2,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{m.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: T.textSub, fontFamily: "'JetBrains Mono',monospace" }}>{m.efficiency}%</span>
              <Badge label={m.status} color={m.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Alerts — uses /dashboard-data alertsData
const AlertsTable = ({ data }) => {
  const alerts = data.dashData?.alertsData || DEMO_DASH_DATA.alertsData;
  if (!alerts.length) return <EmptyState msg="No alerts available" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '12px 14px',
          borderRadius: 8, background: T.bgCard2, border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${a.badgeBg}`,
        }}>
          <span style={{ fontSize: 16 }}>{a.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{a.title}</span>
              <Badge label={a.badge} color={a.badgeBg} />
              {!a.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, display: 'inline-block' }} />}
            </div>
            <p style={{ fontSize: 11, color: T.textSub }}>{a.desc}</p>
          </div>
          <span style={{ fontSize: 10, color: T.textMuted, whiteSpace: 'nowrap', alignSelf: 'flex-start', fontFamily: "'JetBrains Mono',monospace" }}>{a.time}</span>
        </div>
      ))}
    </div>
  );
};

// Failure Predictions summary — uses uploadResult predictions
const FailureSummary = ({ data }) => {
  const pred = data.uploadResult?.predictions || DEMO_UPLOAD_RESULT.predictions;
  const anom = data.uploadResult?.anomalies || DEMO_UPLOAD_RESULT.anomalies;
  if (!pred) return <EmptyState msg="Upload a dataset to view failure predictions" />;

  const total = pred.failure_count + pred.no_failure_count;
  const rate = total > 0 ? (pred.failure_count / total * 100).toFixed(1) : 0;

  const barData = [
    { name: 'No Failure', count: pred.no_failure_count, fill: T.green },
    { name: 'Failure',    count: pred.failure_count,    fill: T.red },
  ];
  if (anom) {
    barData.push({ name: 'Anomalies', count: anom.anomaly_count, fill: T.yellow });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <StatCard label="Predicted Failures" value={pred.failure_count} icon={AlertTriangle} color={T.red} />
        <StatCard label="Normal Samples"     value={pred.no_failure_count} icon={CheckCircle} color={T.green} />
        <StatCard label="Failure Rate"        value={`${rate}%`} icon={Activity} color={rate > 15 ? T.red : rate > 5 ? T.yellow : T.green} />
      </div>
      {anom && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          <StatCard label="Anomalies Detected" value={anom.anomaly_count} icon={AlertTriangle} color={T.yellow} />
          <StatCard label="Normal (Isolation Forest)" value={anom.normal_count} icon={CheckCircle} color={T.green} />
        </div>
      )}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={barData} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke={T.grid} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
            {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Dataset Info — uses uploadResult summary
const DatasetInfo = ({ data }) => {
  const res = data.uploadResult || DEMO_UPLOAD_RESULT;
  if (!res) return <EmptyState msg="Upload a dataset to view column statistics" />;
  const numStats = res.summary?.numeric_stats || DEMO_UPLOAD_RESULT.summary.numeric_stats;
  const keys = Object.keys(numStats).filter(k => !k.startsWith('_')).slice(0, 8);
  if (!keys.length) return <EmptyState msg="No numeric columns found" />;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', fontSize: 11 }}>
        <thead>
          <tr>
            {['Column', 'Mean', 'Std', 'Min', 'Max', 'Median'].map(h => (
              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((col, i) => {
            const s = numStats[col];
            return (
              <tr key={col}>
                {[
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.accent, fontWeight: 600 }}>{col}</span>,
                  <span style={{ color: T.text }}>{fmt(s.mean, 2)}</span>,
                  <span style={{ color: T.textSub }}>{fmt(s.std, 2)}</span>,
                  <span style={{ color: T.green }}>{fmt(s.min, 2)}</span>,
                  <span style={{ color: T.red }}>{fmt(s.max, 2)}</span>,
                  <span style={{ color: T.text }}>{fmt(s['50%'], 2)}</span>,
                ].map((cell, j) => (
                  <td key={j} style={{
                    padding: '9px 10px',
                    background: i % 2 === 0 ? T.bgCard2 : T.bgCard,
                    borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
                    borderLeft: j === 0 ? `1px solid ${T.border}` : 'none',
                    borderRight: j === 5 ? `1px solid ${T.border}` : 'none',
                    borderRadius: j === 0 ? '6px 0 0 6px' : j === 5 ? '0 6px 6px 0' : 0,
                  }}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Plant Status — uses /prediction-data plantData
const PlantStatus = ({ data }) => {
  const plant = data.predData?.plantData || DEMO_PRED_DATA.plantData;
  if (!plant) return <EmptyState msg="No plant status data available" />;

  const indicators = [
    { label: 'Avg Temp',           value: `${fmt(plant.avgTemp)}°C`,    color: plant.avgTemp > 80 ? T.red : T.green },
    { label: 'Max Vibration',      value: `${fmt(plant.maxVibration)} mm/s`, color: plant.maxVibration > 4 ? T.red : T.yellow },
    { label: 'Avg Pressure',       value: `${fmt(plant.avgPressure)} PSI`, color: T.accent },
    { label: 'Efficiency',         value: `${fmt(plant.overallEfficiency)}%`, color: plant.overallEfficiency > 80 ? T.green : T.red },
    { label: 'Maint. Overdue',     value: plant.maintenanceOverdueCount, color: plant.maintenanceOverdueCount > 0 ? T.red : T.green },
    { label: 'Data Timestamp',     value: plant.timestamp,              color: T.textSub },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        {plant.errorState && <Badge label="ERROR STATE DETECTED" color={T.red} />}
        {plant.warningState && <Badge label="ANOMALIES PRESENT" color={T.yellow} />}
        {!plant.errorState && !plant.warningState && <Badge label="ALL SYSTEMS NOMINAL" color={T.green} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {indicators.map((ind, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 8, background: T.bgCard2, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 4 }}>{ind.label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: ind.color, fontFamily: "'JetBrains Mono',monospace" }}>{ind.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Empty state
const EmptyState = ({ msg }) => (
  <div style={{ padding: '24px', textAlign: 'center', color: T.textMuted, fontSize: 13, fontStyle: 'italic' }}>
    {msg}
  </div>
);

// ─── All available sections ───────────────────────────────────────────────────
const ALL_SECTIONS = [
  { id: 'kpi',         label: 'KPI Summary',          icon: <BarChart2 size={15} />,    component: KPIGrid },
  { id: 'failures',    label: 'Failure Predictions',  icon: <AlertTriangle size={15} />, component: FailureSummary },
  { id: 'production',  label: 'Production Chart',     icon: <TrendingUp size={15} />,   component: ProductionChart },
  { id: 'sensor',      label: 'Sensor Trends',        icon: <Activity size={15} />,     component: SensorChart },
  { id: 'machines',    label: 'Machine Status',       icon: <Cpu size={15} />,          component: MachineStatus },
  { id: 'alerts',      label: 'System Alerts',        icon: <Zap size={15} />,          component: AlertsTable },
  { id: 'plant',       label: 'Plant Health',         icon: <Gauge size={15} />,        component: PlantStatus },
  { id: 'dataset',     label: 'Dataset Statistics',   icon: <BarChart3 size={15} />,    component: DatasetInfo },
];

// ─── Main Report Component ────────────────────────────────────────────────────
export default function ReportBuilder() {
  const [dashData, setDashData] = useState(USE_BACKEND ? null : DEMO_DASH_DATA);
  const [predData, setPredData] = useState(USE_BACKEND ? null : DEMO_PRED_DATA);
  const [uploadResult, setUploadResult] = useState(USE_BACKEND ? null : DEMO_UPLOAD_RESULT);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState(ALL_SECTIONS.map(s => ({ ...s, visible: true })));
  const [showPanel, setShowPanel] = useState(false);
  const [title, setTitle] = useState('FactoryPulse — Manufacturing Report');
  const [editingTitle, setEditingTitle] = useState(false);
  const [period, setPeriod] = useState(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  const [generatedAt] = useState(new Date().toLocaleString());
  const [saved, setSaved] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const fileInputRef = useRef(null);

  // ── Fetch data (only if backend is enabled) ─────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!USE_BACKEND) return;
    
    setLoading(true);
    setError(null);
    try {
      const [dRes, pRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard-data`),
        fetch(`${API_BASE}/prediction-data`),
      ]);
      const dJson = await dRes.json();
      const pJson = await pRes.json();
      setDashData(dJson.has_data ? dJson : null);
      setPredData(pJson.has_data ? pJson : null);
    } catch (e) {
      setError('Backend not available. Using demo data.');
      setDashData(DEMO_DASH_DATA);
      setPredData(DEMO_PRED_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (USE_BACKEND) {
      fetchAll(); 
    }
  }, [fetchAll]);

  // ── Upload CSV (only if backend is enabled) ─────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!USE_BACKEND) {
      setUploadResult({
        ...DEMO_UPLOAD_RESULT,
        filename: file.name,
        rows: Math.floor(Math.random() * 2000) + 500,
      });
      setUploading(false);
      e.target.value = '';
      return;
    }
    
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
      const json = await res.json();
      if (json.success) {
        setUploadResult(json);
        await fetchAll();
      } else {
        setError(`Upload failed: ${json.error}`);
      }
    } catch (e) {
      setError('Backend not available. Using demo data for this file.');
      setUploadResult({
        ...DEMO_UPLOAD_RESULT,
        filename: file.name,
        rows: Math.floor(Math.random() * 2000) + 500,
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Section controls ────────────────────────────────────────────────────────
  const toggleSection = id => setSections(s => s.map(x => x.id === id ? { ...x, visible: !x.visible } : x));
  const removeSection  = id => setSections(s => s.filter(x => x.id !== id));
  const addSection     = s  => setSections(prev => [...prev, { ...s, visible: true }]);

  const onDragStart = i => setDragIdx(i);
  const onDragOver  = (e, i) => { e.preventDefault(); setDragOver(i); };
  const onDrop      = i => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOver(null); return; }
    const next = [...sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setSections(next);
    setDragIdx(null);
    setDragOver(null);
  };

  const removedSections = ALL_SECTIONS.filter(a => !sections.find(s => s.id === a.id));
  const reportData = { dashData, predData, uploadResult };
  const hasData = !!(dashData?.has_data || predData?.has_data || uploadResult || (!USE_BACKEND));

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', 'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .sec{animation:fadeUp .3s ease-out both}
        @media print{
          .no-print{display:none!important}
          body{background:#fff;color:#000}
          .print-page{max-width:100%!important;margin:0!important;padding:0!important}
        }
        button:hover{opacity:0.85}
      `}</style>

      {/* ── Toolbar ── */}
      <div className="no-print" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: T.bgCard + 'f2', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#388bfd,#6e40c9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Factory size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>FactoryPulse Report Builder</p>
            <p style={{ fontSize: 10, color: T.textMuted }}>{USE_BACKEND ? 'Backend mode' : 'Demo mode · No backend required'}</p>
          </div>
        </div>

        {/* Status indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.textSub }}>
            <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
          </div>
        )}
        {!loading && hasData && (
          <span style={{ fontSize: 11, color: T.green }}>● Live demo data</span>
        )}

        {USE_BACKEND && (
          <button onClick={fetchAll} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6,
            background: 'none', border: `1px solid ${T.border}`, color: T.textSub, cursor: 'pointer', fontSize: 11,
          }}>
            <RefreshCw size={12} /> Refresh
          </button>
        )}

        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6,
          background: T.accent + '22', border: `1px solid ${T.accent}55`, color: T.accent, cursor: 'pointer', fontSize: 11, fontWeight: 600,
        }}>
          <Upload size={12} /> {uploading ? 'Uploading…' : 'Upload CSV'}
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleUpload} style={{ display: 'none' }} />

        <button onClick={() => setShowPanel(p => !p)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6,
          background: showPanel ? T.accent + '22' : 'none', border: `1px solid ${showPanel ? T.accent : T.border}`,
          color: showPanel ? T.accent : T.textSub, cursor: 'pointer', fontSize: 11,
        }}>
          <Settings size={12} /> Sections
        </button>

        <button onClick={() => window.print()} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6,
          background: T.text, border: 'none', color: T.bg, cursor: 'pointer', fontSize: 11, fontWeight: 700,
        }}>
          <Printer size={12} /> Export PDF
        </button>
      </div>

      {/* ── Sections panel ── */}
      {showPanel && (
        <div className="no-print" style={{
          position: 'fixed', right: 20, top: 64, zIndex: 200,
          background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
          padding: 16, width: 240, boxShadow: '0 16px 48px rgba(0,0,0,.5)',
          animation: 'fadeUp .2s ease-out',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Sections</p>
          {sections.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, marginBottom: 3, background: T.bgCard2 }}>
              <span style={{ color: T.accent, display: 'flex' }}>{s.icon}</span>
              <span style={{ fontSize: 11, flex: 1, color: T.text }}>{s.label}</span>
              <button onClick={() => toggleSection(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.visible ? T.green : T.textMuted, display: 'flex' }}>
                {s.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button onClick={() => removeSection(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.red + 'aa', display: 'flex' }}>
                <X size={12} />
              </button>
            </div>
          ))}
          {removedSections.length > 0 && (
            <>
              <p style={{ fontSize: 10, color: T.textMuted, margin: '10px 0 6px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Add Back</p>
              {removedSections.map(s => (
                <button key={s.id} onClick={() => addSection(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                  padding: '5px 8px', borderRadius: 6, marginBottom: 3,
                  background: 'none', border: `1px dashed ${T.border}`,
                  color: T.textSub, cursor: 'pointer', fontSize: 11,
                }}>
                  <Plus size={11} /> {s.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && (
        <div style={{ background: T.red + '22', border: `1px solid ${T.red}44`, borderRadius: 8, padding: '10px 16px', margin: '12px 20px', fontSize: 12, color: T.red }}>
          {error}
        </div>
      )}

      {/* ── Report page ── */}
      <div className="print-page" style={{ maxWidth: 980, margin: '20px auto', padding: '0 20px 48px' }}>

        {/* Cover */}
        <div style={{
          background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
          padding: '24px 28px', marginBottom: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'linear-gradient(135deg,#388bfd,#6e40c9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Factory size={18} color="#fff" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: T.textMuted }}>Manufacturing Intelligence Report</span>
              </div>
              {editingTitle ? (
                <input value={title} onChange={e => setTitle(e.target.value)}
                  style={{ fontSize: 20, fontWeight: 800, color: T.text, background: T.bgCard2, border: `1px solid ${T.accent}`, borderRadius: 6, padding: '4px 10px', fontFamily: 'Inter,sans-serif', outline: 'none', width: '100%', marginBottom: 8 }}
                  autoFocus onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                />
              ) : (
                <h1 onClick={() => setEditingTitle(true)} style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 8, cursor: 'text', letterSpacing: -0.5 }}>
                  {title} <span style={{ fontSize: 12, fontWeight: 400, color: T.textMuted }}>✎</span>
                </h1>
              )}
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: T.textSub, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color={T.textMuted} />
                  <input value={period} onChange={e => setPeriod(e.target.value)}
                    style={{ border: 'none', background: 'none', fontSize: 11, color: T.textSub, fontFamily: 'Inter,sans-serif', cursor: 'text', outline: 'none', width: 110 }} />
                </span>
                <span>Generated: {generatedAt}</span>
                {uploadResult && <span style={{ color: T.green }}>● {uploadResult.filename} · {uploadResult.rows} rows</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {(predData?.plantData || DEMO_PRED_DATA.plantData) && (
                <>
                  <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>Overall Efficiency</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: T.accent, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
                    {fmt((predData?.plantData || DEMO_PRED_DATA.plantData).overallEfficiency)}%
                  </div>
                  <div style={{ fontSize: 11, color: (predData?.plantData || DEMO_PRED_DATA.plantData).errorState ? T.red : T.green, fontWeight: 700, marginTop: 2 }}>
                    {(predData?.plantData || DEMO_PRED_DATA.plantData).errorState ? '⚠ Failures Detected' : '✓ No Critical Failures'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Draggable sections */}
        {sections.map((sec, idx) => {
          const Comp = sec.component;
          return (
            <div
              key={sec.id}
              className="sec"
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDrop={() => onDrop(idx)}
              style={{
                background: T.bgCard,
                border: `1px solid ${dragOver === idx ? T.accent : T.border}`,
                borderRadius: 12, padding: '18px 22px', marginBottom: 12,
                boxShadow: dragOver === idx ? `0 0 0 2px ${T.accent}33` : '0 2px 12px rgba(0,0,0,.2)',
                transition: 'border .15s, box-shadow .15s',
                opacity: dragIdx === idx ? 0.4 : 1,
                cursor: 'grab',
              }}
            >
              <SectionHeader
                icon={sec.icon} title={sec.label}
                visible={sec.visible}
                onToggle={() => toggleSection(sec.id)}
                onRemove={() => removeSection(sec.id)}
              />
              {sec.visible && (
                <div style={{ animation: 'fadeUp .3s ease-out' }}>
                  <Comp data={reportData} />
                </div>
              )}
            </div>
          );
        })}

        {/* Add back */}
        {removedSections.length > 0 && (
          <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {removedSections.map(s => (
              <button key={s.id} onClick={() => addSection(s)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 8,
                background: 'none', border: `1.5px dashed ${T.border}`,
                color: T.textSub, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}>
                <Plus size={12} /> {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, padding: '14px 20px', borderRadius: 10, background: T.bgCard2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
            FactoryPulse AI · Auto-generated · {generatedAt}
          </span>
          <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
