import React from "react";

export default function Card({ title, right, children }) {
  return (
    <section className="card" style={{ padding: 14 }}>
      {(title || right) && (
        <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            {title && <div className="title">{title}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
