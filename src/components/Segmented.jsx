import React from "react";

export default function Segmented({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((op) => (
        <button
          key={op}
          className={`segBtn ${value === op ? "active" : ""}`}
          onClick={() => onChange(op)}
          type="button"
        >
          {op}
        </button>
      ))}
      <style>{`
        .seg{
          display:flex; gap:6px;
          background: rgba(17,24,39,0.04);
          border:1px solid var(--border);
          border-radius:16px;
          padding:6px;
        }
        .segBtn{
          flex:1;
          border:0;
          border-radius:14px;
          padding:10px 10px;
          font-weight:900;
          cursor:pointer;
          background:transparent;
        }
        .segBtn.active{
          background:#fff;
          box-shadow: var(--shadow2);
          border:1px solid rgba(245,124,0,.30);
        }
      `}</style>
    </div>
  );
}
