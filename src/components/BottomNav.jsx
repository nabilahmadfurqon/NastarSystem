import React from "react";

export default function BottomNav({ route, onRoute }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "input", label: "Input", icon: "➕" },
    { key: "orders", label: "Pesanan", icon: "🧾" }
  ];

  return (
    <nav className="bottomNav">
      <div className="bottomNavInner">
        {items.map((it) => {
          const active = route === it.key;
          return (
            <button
              key={it.key}
              className={`navItem ${active ? "active" : ""}`}
              onClick={() => onRoute(it.key)}
              type="button"
            >
              <span className="dot" />
              <span style={{ fontSize: 16 }}>{it.icon}</span>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
