import React from "react";
import StatusBadge from "./StatusBadge.jsx";
import { formatRupiah } from "../lib/format.js";

export default function OrdersTable({ rows, onClickStatus }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>ID</th>
            <th>Nama</th>
            <th>Ukuran</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status Pesanan</th>
            <th>Status Bayar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ID}>
              <td className="muted">{r.Tanggal}</td>
              <td style={{ fontWeight: 900 }}>{r.ID}</td>
              <td>{r.Nama}</td>
              <td>{r.Ukuran}</td>
              <td>{r.JumlahToples}</td>
              <td style={{ fontWeight: 900 }}>{formatRupiah(r.Total)}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => onClickStatus(r)} style={{ padding: 6 }}>
                  <StatusBadge status={r.StatusPesanan} />
                </button>
              </td>
              <td>
                <span className="badge" style={{ background: String(r.StatusBayar) === "Lunas" ? "rgba(22,163,74,.10)" : "rgba(202,138,4,.10)" }}>
                  {String(r.StatusBayar || "Belum Bayar")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
