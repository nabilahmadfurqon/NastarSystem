import React, { useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Segmented from "../components/Segmented.jsx";
import Stepper from "../components/Stepper.jsx";
import Skeleton from "../components/Skeleton.jsx";

import { createOrder } from "../lib/api.js";
import { formatRupiah, isoToday } from "../lib/format.js";
import { genOrderId, prodMapBySize } from "../lib/calc.js";

export default function Input({ data, setData, loading, err, pushToast }) {
  const [nama, setNama] = useState("");
  const [ukuran, setUkuran] = useState("400g");
  const [qty, setQty] = useState(1);
  const [bayar, setBayar] = useState("Belum Bayar");
  const [submitting, setSubmitting] = useState(false);

  const produksiMap = useMemo(() => prodMapBySize(data.produksi), [data.produksi]);

  const hargaJual = produksiMap.get(ukuran)?.jual || 0;
  const total = qty * hargaJual;

  async function onSubmit() {
    const nm = nama.trim();
    if (!nm) return pushToast("error", "Nama wajib diisi");
    if (qty < 1) return pushToast("error", "Qty minimal 1");

    const id = genOrderId(data.pesanan);
    const order = {
      ID: id,
      Tanggal: isoToday(),
      Nama: nm,
      Ukuran: ukuran,
      JumlahToples: qty,
      Total: total,
      StatusPesanan: "Menunggu",
      StatusBayar: bayar
    };

    setSubmitting(true);
    try {
      // optimistic add
      setData((d) => ({ ...d, pesanan: [order, ...(d.pesanan || [])] }));
      await createOrder(order);
      pushToast("success", `Pesanan masuk: ${id}`);
      setNama("");
      setUkuran("400g");
      setQty(1);
      setBayar("Belum Bayar");
    } catch (e) {
      pushToast("error", e?.message || "Gagal submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vstack" style={{ gap: 12 }}>
      <Card title="Input Pesanan Baru" right={<span className="badge">Simpel • Cepat</span>}>
        {loading ? (
          <div className="vstack">
            <Skeleton h={14} w="55%" />
            <Skeleton h={44} />
            <Skeleton h={14} w="45%" />
            <Skeleton h={56} />
          </div>
        ) : (
          <>
            {err && (
              <div className="card" style={{ padding: 12, borderColor: "rgba(220,38,38,.25)", background: "rgba(220,38,38,.06)" }}>
                <div style={{ fontWeight: 900, color: "var(--danger)" }}>Gagal load data</div>
                <div className="muted" style={{ marginTop: 4 }}>{err}</div>
              </div>
            )}

            <div className="vstack" style={{ marginTop: 10 }}>
              <div>
                <div className="label">Nama customer</div>
                <input className="input" placeholder="Contoh: Ibu Sari" value={nama} onChange={(e) => setNama(e.target.value)} />
              </div>

              <div>
                <div className="label">Ukuran toples</div>
                <Segmented options={["400g", "550g", "600g"]} value={ukuran} onChange={setUkuran} />
              </div>

              <div>
                <div className="label">Qty toples</div>
                <Stepper value={qty} onChange={setQty} min={1} />
              </div>

              <div className="hstack" style={{ justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="label">Status bayar</div>
                  <Segmented options={["Belum Bayar", "Lunas"]} value={bayar} onChange={setBayar} />
                </div>
              </div>

              <div className="card" style={{ padding: 12, background: "rgba(245,124,0,.08)", borderColor: "rgba(245,124,0,.18)" }}>
                <div className="hstack" style={{ justifyContent: "space-between" }}>
                  <div className="muted">Total otomatis</div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{formatRupiah(total)}</div>
                </div>
                <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                  Harga jual {ukuran}: <b>{formatRupiah(hargaJual)}</b> / toples
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="fab">
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={loading || submitting}
        >
          {submitting ? "Menyimpan..." : "Submit Pesanan"}
        </button>
      </div>
    </div>
  );
}
