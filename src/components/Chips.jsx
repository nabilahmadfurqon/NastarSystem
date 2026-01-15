import React from "react";

export default function Chips({ options, value, onChange }) {
  return (
    <div className="hstack" style={{ flexWrap: "wrap" }}>
      {options.map((op) => (
        <button
          key={op}
          className={`chip ${value === op ? "active" : ""}`}
          onClick={() => onChange(op)}
        >
          {op}
        </button>
      ))}
    </div>
  );
}
