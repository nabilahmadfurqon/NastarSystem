import React from "react";

export default function Modal({ open, title, subtitle, onClose, children, right }) {
  if (!open) return null;
  return (
    <div className="mBackdrop" onMouseDown={onClose}>
      <div className="mCard" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="mHead">
          <div>
            <div className="title">{title}</div>
            {subtitle && <div className="subtitle" style={{marginTop:2}}>{subtitle}</div>}
          </div>
          <div className="hstack">
            {right}
            <button className="btn btn-ghost" onClick={onClose}>Tutup</button>
          </div>
        </div>
        <div className="mBody">{children}</div>
      </div>

      <style>{`
        .mBackdrop{
          position:fixed; inset:0;
          background: rgba(17,24,39,0.45);
          backdrop-filter: blur(6px);
          z-index:200;
          display:flex; align-items:center; justify-content:center;
          padding:18px;
        }
        .mCard{
          width:min(860px, 100%);
          border-radius: 22px;
          background: rgba(255,255,255,0.92);
          border:1px solid rgba(255,255,255,0.35);
          box-shadow: var(--shadow);
          overflow:hidden;
        }
        .mHead{
          padding:14px 14px;
          display:flex; align-items:center; justify-content:space-between;
          gap:10px;
          border-bottom:1px solid rgba(17,24,39,0.10);
        }
        .mBody{padding:14px;}
      `}</style>
    </div>
  );
}
