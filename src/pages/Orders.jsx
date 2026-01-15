import React, { useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Chips from "../components/Chips.jsx";
import OrdersTable from "../components/OrdersTable.jsx";
import OrdersCards from "../components/OrdersCards.jsx";
import Skeleton from "../components/Skeleton.jsx";

import useDebounce from "../lib/useDebounce.js";
import { filterSearch, nextStatus, prodMapBySize, sortNewestFirst } from "../lib/calc.js";
import { patchOrderById } from "../lib/api.js";

function useIsDesktop() {
  const [d, setD] = useState(window.innerWidth >= 900);
  React.useEffect(() => {
    const on = () => setD(window.innerWidth >= 900);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return d;
}

export default function Orders({ data, setData, loading, err, refresh, pushToast }) {
  const isDesktop = useIsDesktop();
  const [status, setStatus] = useState("Semua");
  const [q, setQ] = useState("");
  const dq = useDebounce(q, 250);

  const rows = useMemo(() => {
    const sorted = sortNewestFirst(data.pesanan);
    return filterSearch(sorted, status, dq);
  }, [data.pesanan, status, dq]);

  async function onClickStatus(row) {
    const curr = String(row.StatusPesanan || "Menunggu");
    const next = nextStatus(curr);
    if (curr === "Selesai") return;

    // optimistic
    setData((d) => ({
      ...d,
      pesanan: (d.pesanan || []).map((r) =>
        r.ID === row.ID ? { ...r, StatusPesanan: next } : r
      )
    }));

    try {
      await patchOrderById(row.ID, { StatusPesanan: next });
      pushToast("success", `Status: ${row.ID} → ${next}`);
    } catch (e) {
      pushToast("error", e?.message || "Gagal update status");
      refresh(); // fallback sync
    }
  }

  return (
    <div className="vstack" style={{ gap: 12 }}>
      <Card
        title="List Pesanan"
        right={<button className="btn btn-ghost" onClick={refresh} disabled={loading}>Sync</button>}
      >
        <div className="row" style={{ alignItems: "center" }}>
          <div className="col">
            <div className="label">Filter status</div>
            <Chips options={["Semua", "Menunggu", "Diproses", "Selesai"]} value={status} onChange={setStatus} />
          </div>
          <div className="col">
            <div className="label">Search (ID / Nama)</div>
            <input className="input" placeholder="Ketik nama / ID..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="hr" />

        {loading ? (
          <div className="vstack">
            <Skeleton h={16} w="60%" />
            <Skeleton h={44} />
            <Skeleton h={44} />
            <Skeleton h={44} />
          </div>
        ) : err ? (
          <div className="card" style={{ padding: 12, borderColor: "rgba(220,38,38,.25)", background: "rgba(220,38,38,.06)" }}>
            <div style={{ fontWeight: 900, color: "var(--danger)" }}>Gagal load pesanan</div>
            <div className="muted" style={{ marginTop: 4 }}>{err}</div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" onClick={refresh}>Retry</button>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900 }}>Belum ada pesanan</div>
            <div className="muted" style={{ marginTop: 4 }}>Coba ganti filter atau search.</div>
          </div>
        ) : (
          <>
            {isDesktop ? (
              <OrdersTable rows={rows} onClickStatus={onClickStatus} />
            ) : (
              <OrdersCards rows={rows} onClickStatus={onClickStatus} />
            )}
          </>
        )}
      </Card>
    </div>
  );
}
