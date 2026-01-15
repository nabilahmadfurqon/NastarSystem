import React from "react";
import { isoToday } from "../lib/format.js";

export default function AppBar({ title, subtitle, onRefresh, loading }) {
  return (
    <header className="appbar">
      <div className="appbarInner">
        <div className="left">
          <div className="brandDot" />
          <div>
            <div className="appbarTitle">{title}</div>
            <div className="appbarSub">{subtitle} • {isoToday()}</div>
          </div>
        </div>

        <button className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <style>{`
        .appbar{
          position:sticky; top:0; z-index:60;
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(17,24,39,0.10);
        }
        .appbarInner{
          max-width: var(--max);
          margin: 0 auto;
          padding: 14px 16px;
          display:flex; align-items:center; justify-content:space-between;
          gap:12px;
        }
        .left{display:flex; align-items:center; gap:12px;}
        .brandDot{
          width:12px; height:12px; border-radius:999px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%);
          box-shadow: 0 0 0 7px rgba(245,124,0,0.16);
        }
        .appbarTitle{font-weight:950; letter-spacing:.2px}
        .appbarSub{font-size:12px; color:var(--muted); margin-top:2px}
      `}</style>
    </header>
  );
}
