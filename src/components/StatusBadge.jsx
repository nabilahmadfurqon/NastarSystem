import React from "react";

export default function StatusBadge({ status }) {
  const s = String(status || "Menunggu");
  const map = {
    Menunggu: { icon: "🟡", color: "var(--warn)" },
    Diproses: { icon: "🔵", color: "var(--info)" },
    Selesai: { icon: "✅", color: "var(--success)" }
  };
  const m = map[s] || map.Menunggu;

  return (
    <span className="badge" style={{ borderColor: "rgba(17,24,39,0.08)" }}>
      <span>{m.icon}</span>
      <span style={{ color: m.color }}>{s}</span>
    </span>
  );
}
