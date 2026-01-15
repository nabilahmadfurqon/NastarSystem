import React from "react";

export default function Stepper({ value, onChange, min = 1, max = 999 }) {
  const v = Number(value || 0);
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(min, v - 1))}>−</button>
      <div className="num">{v}</div>
      <button type="button" onClick={() => onChange(Math.min(max, v + 1))}>+</button>

      <style>{`
        .stepper{
          display:flex; align-items:center; justify-content:space-between;
          border:1px solid var(--border);
          border-radius:16px;
          padding:6px;
          background:#fff;
        }
        .stepper button{
          width:42px; height:40px;
          border:0; border-radius:14px;
          font-size:18px;
          font-weight:900;
          background: rgba(245,124,0,.12);
          cursor:pointer;
        }
        .num{font-weight:900; font-size:14px; min-width:40px; text-align:center}
      `}</style>
    </div>
  );
}
