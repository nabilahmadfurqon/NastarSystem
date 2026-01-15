import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import { formatRupiah } from "../lib/format.js";

export default function OrdersCards({ rows, onClickStatus }) {
  return (
    <div className="vstack">
      {rows.map((r) => (
        <div className="card" key={r.ID} style={{ padding: 14 }}>
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 900 }}>{r.Nama}</div>
              <div className="muted" style={{ fontSize: 12 }}>{r.ID} • {r.Tanggal}</div>
            </div>
            <div style={{ fontWeight: 900 }}>{formatRupiah(r.Total)}</div>
          </div>

          <div className="hr" />

          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div className="muted">Ukuran</div>
            <div style={{ fontWeight: 900 }}>{r.Ukuran}</div>
          </div>
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div className="muted">Qty</div>
            <div style={{ fontWeight: 900 }}>{r.JumlahToples}</div>
          </div>

          <div className="hstack" style={{ justifyContent: "space-between", marginTop: 10 }}>
            <button className="btn btn-ghost" onClick={() => onClickStatus(r)} style={{ padding: 8 }}>
              <StatusBadge status={r.StatusPesanan} />
            </button>

            <span className="badge" style={{
              background: String(r.StatusBayar) === "Lunas" ? "rgba(22,163,74,.10)" : "rgba(202,138,4,.10)"
            }}>
              {String(r.StatusBayar || "Belum Bayar")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
