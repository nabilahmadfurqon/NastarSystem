import React from "react";

export default function ToastHost({ toasts }) {
  return (
    <div className="toastHost">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <strong>{t.type === "error" ? "Error" : "Sukses"}</strong>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
