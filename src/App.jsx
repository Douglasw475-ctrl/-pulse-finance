import { useState, useEffect } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

// ── Icons (inline SVGs as components) ──────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const HomeIcon = () => <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />;
const GastosIcon = () => <Icon d="M2 8h20v13H2zM16 3l-4 5-4-5" />;
const GraficosIcon = () => <Icon d="M18 20V10M12 20V4M6 20v-6" />;
const MetasIcon = () => <Icon d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-14v4l3 3" />;
const AddIcon = () => <Icon d="M12 5v14M5 12h14" strokeWidth={2} />;
const InsightsIcon = () => <Icon d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />;
const BellIcon = () => <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
const MenuIcon = () => <Icon d="M4 6h16M4 12h16M4 18h16" />;
const CloseIcon = () => <Icon d="M18 6L6 18M6 6l12 12" />;

// ── Mock Data ───────────────────────────────────────────────────────────────
const balanceHistory = [
  { d: "1 Mai", v: 6200 }, { d: "5 Mai", v: 6800 }, { d: "10 Mai", v: 7100 },
  { d: "15 Mai", v: 6900 }, { d: "20 Mai", v: 8425 }, { d: "25 Mai", v: 8100 },
  { d: "31 Mai", v: 8425 },
];

const pieData = [
  { name: "Alimentação", value: 30, color: "#f97316" },
  { name: "Transporte", value: 25, color: "#3b82f6" },
  { name: "Moradia", value: 20, color: "#22c55e" },
  { name: "Lazer", value: 15, color: "#a855f7" },
  { name: "Outros", value: 10, color: "#64748b" },
];

const barData = [
  { mes: "Jan", v: 3200 }, { mes: "Fev", v: 2800 }, { mes: "Mar", v: 3600 },
  { mes: "Abr", v: 3100 }, { mes: "Mai", v: 4154 }, { mes: "Jun", v: 0 },
];

const gastos = [
  { id: 1, nome: "Café Starbucks", cat: "Alimentação", data: "Hoje", valor: 28.50, icon: "☕", cor: "#f97316" },
  { id: 2, nome: "Uber", cat: "Transporte", data: "Hoje", valor: 38.00, icon: "🚗", cor: "#3b82f6" },
  { id: 3, nome: "Farmácia São João", cat: "Saúde", data: "Hoje", valor: 20.00, icon: "💊", cor: "#22c55e" },
  { id: 4, nome: "Mercado Zaffari", cat: "Alimentação", data: "Ontem", valor: 89.90, icon: "🛒", cor: "#f97316" },
  { id: 5, nome: "Netflix", cat: "Entretenimento", data: "Ontem", valor: 40.00, icon: "🎬", cor: "#ef4444" },
  { id: 6, nome: "Posto Ipiranga", cat: "Transporte", data: "12 Mai", valor: 56.00, icon: "⛽", cor: "#3b82f6" },
  { id: 7, nome: "Zara", cat: "Vestuário", data: "11 Mai", valor: 189.90, icon: "👗", cor: "#a855f7" },
  { id: 8, nome: "Spotify", cat: "Entretenimento", data: "10 Mai", valor: 19.90, icon: "🎵", cor: "#1db954" },
];

const metas = [
  { id: 1, nome: "Viagem dos sonhos ✈️", total: 6000, guardado: 3780, cor: "#a855f7" },
  { id: 2, nome: "Reserva de emergência", total: 10000, guardado: 4200, cor: "#22c55e" },
  { id: 3, nome: "Novo iPhone 📱", total: 8000, guardado: 2240, cor: "#3b82f6" },
];

const fmt = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Sidebar nav items ───────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "gastos", label: "Gastos", icon: <GastosIcon /> },
  { id: "graficos", label: "Gráficos", icon: <GraficosIcon /> },
  { id: "metas", label: "Metas", icon: <MetasIcon /> },
  { id: "adicionar", label: "Adicionar", icon: <AddIcon /> },
  { id: "insights", label: "Insights", icon: <InsightsIcon /> },
];

// ══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Olá! Vamos cuidar do seu dinheiro hoje? 💡</p>
          <h1 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, margin: "4px 0 0", fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 10, cursor: "pointer", color: "#94a3b8", border: "1px solid #334155" }}>
          <BellIcon />
        </div>
      </div>

      {/* Balance Card */}
      <div style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
        borderRadius: 20, padding: "28px 28px 24px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -20, left: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>Saldo atual</p>
        <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 800, margin: "0 0 16px", fontFamily: "'Syne', sans-serif" }}>R$ 8.425,70</h2>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 4px" }}>Entradas</p>
            <p style={{ color: "#86efac", fontSize: 16, fontWeight: 700, margin: 0 }}>R$ 12.580,00</p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 4px" }}>Saídas</p>
            <p style={{ color: "#fca5a5", fontSize: 16, fontWeight: 700, margin: 0 }}>R$ 4.154,30</p>
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div style={{ background: "#0f172a", borderRadius: 20, padding: "20px 16px 12px", border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <p style={{ color: "#f1f5f9", fontWeight: 600, margin: 0 }}>Resumo do mês</p>
          <span style={{ color: "#7c3aed", fontSize: 13 }}>Maio ▾</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={balanceHistory}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }}
              formatter={(v) => [fmt(v), ""]}
            />
            <Area type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2.5} fill="url(#grad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Category */}
      <div style={{ background: "#0f172a", borderRadius: 20, padding: 20, border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: "#f1f5f9", fontWeight: 600, margin: 0 }}>Maior categoria</p>
          <span style={{ color: "#7c3aed", fontSize: 13, cursor: "pointer" }}>Ver todas →</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "#f97316", borderRadius: 14, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍔</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#f1f5f9", fontWeight: 600, margin: "0 0 4px" }}>Alimentação</p>
            <div style={{ background: "#1e293b", borderRadius: 99, height: 6, overflow: "hidden" }}>
< truncated lines 148-450 >
              padding: "16px 18px", display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{ background: item.cor + "22", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#f1f5f9", fontWeight: 700, margin: "0 0 4px", fontSize: 14 }}>{item.titulo}</p>
                <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{item.desc}</p>
              </div>
              <div style={{ background: "#14532d", borderRadius: 8, padding: "4px 10px", color: "#86efac", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {item.saving}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button style={{
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: 14,
        padding: "16px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%"
      }}>Ver todas as dicas</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

const PAGES = { home: HomePage, gastos: GastosPage, graficos: GraficosPage, metas: MetasPage, adicionar: AdicionarPage, insights: InsightsPage };

export default function App() {
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGES[active];

  const navigate = (id) => {
    setActive(id);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
        input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#020617" }}>

        {/* ── Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(4px)"
          }} />
        )}

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside style={{
          width: 240, background: "#060f1e", borderRight: "1px solid #1e293b",
          display: "flex", flexDirection: "column", padding: "28px 16px", gap: 8,
          flexShrink: 0, overflowY: "auto",
          // Mobile: slide over
          position: window.innerWidth < 768 ? "fixed" : "relative",
          top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: window.innerWidth < 768 ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)"
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px 16px", borderBottom: "1px solid #1e293b", marginBottom: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "'Syne', sans-serif"
            }}>P</div>
            <div>
              <p style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 16, margin: 0, fontFamily: "'Syne', sans-serif" }}>Pulse Finance</p>
              <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>Finanças pessoais</p>
            </div>
            {window.innerWidth < 768 && (
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", marginLeft: "auto" }}>
                <CloseIcon />
              </button>
            )}
          </div>

          {/* Nav items */}
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
                border: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s",
                background: isActive ? "#7c3aed22" : "transparent",
                color: isActive ? "#a78bfa" : "#64748b",
                borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent"
              }}>
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ fontWeight: isActive ? 700 : 500, fontSize: 14 }}>{item.label}</span>
              </button>
            );
          })}

          {/* User at bottom */}
          <div style={{ marginTop: "auto", background: "#0f172a", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #1e293b" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>P</div>
            <div>
              <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13, margin: 0 }}>Pedro</p>
              <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>Plano Pro</p>
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 24px", maxWidth: "100%" }}>
          {/* Mobile topbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, position: window.innerWidth < 768 ? "sticky" : "relative", top: 0, background: "#020617", paddingBottom: 8, zIndex: 10 }}>
            {window.innerWidth < 768 && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 8, cursor: "pointer", color: "#94a3b8" }}>
                <MenuIcon />
              </button>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              {NAV.map((n) => n.id === active && (
                <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>Início</span>
                  <span style={{ color: "#334155" }}>›</span>
                  <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{n.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <PageComponent />
          </div>
        </main>
      </div>
    </>
  );
}
