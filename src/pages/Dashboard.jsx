import React, { useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Skeleton from "../components/Skeleton.jsx";
import DonutChart from "../components/DonutChart.jsx";
import MasterDataPanel from "../components/MasterDataPanel.jsx";
import { formatRupiah } from "../lib/format.js";
import {
  bulanIniLeaderboard,
  kebutuhanBahan,
  prodMapBySize,
  statusCounts,
  todaySummary,
  toplesPerluDibuat
} from "../lib/calc.js";

export default function Dashboard({ data, setData, loading, err, refresh, pushToast }) {
  const produksiMap = useMemo(() => prodMapBySize(data.produksi), [data.produksi]);
  const today = useMemo(() => todaySummary(data.pesanan), [data.pesanan]);
  const status = useMemo(() => statusCounts(data.pesanan), [data.pesanan]);
  const toples = useMemo(() => toplesPerluDibuat(data.pesanan), [data.pesanan]);
  const leaderboard = useMemo(() => bulanIniLeaderboard(data.pesanan, produksiMap), [data.pesanan, produksiMap]);
  const bahanNeed = useMemo(() => kebutuhanBahan(data.pesanan, produksiMap, data.bahan), [data.pesanan, produksiMap, data.bahan]);

  const [showMaster, setShowMaster] = useState(false);

  return (
    <div className="vstack" style={{ gap: 12 }}>
      <Card
        title="Status Hari Ini"
        right={
          <div className="hstack">
            <button className="btn btn-ghost" onClick={() => setShowMaster(v=>!v)}>
              {showMaster ? "Tutup Master" : "Kelola Data"}
            </button>
            <button className="btn btn-ghost" onClick={refresh} disabled={loading}>Refresh</button>
          </div>
        }
      >
        {loading ? (
          <div className="vstack">
            <Skeleton h={18} w="60%" />
            <Skeleton h={76} />
          </div>
        ) : err ? (
          <div className="card soft pad" style={{ borderColor: "rgba(220,38,38,.25)" }}>
            <div style={{ fontWeight: 1000, color: "var(--danger)" }}>Gagal load data</div>
            <div className="muted" style={{ marginTop: 4 }}>{err}</div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" onClick={refresh}>Retry</button>
            </div>
          </div>
        ) : (
          <div className="kpiGrid">
            <div className="card soft kpi">
              <div className="small">Pesanan hari ini</div>
              <div className="big">{today.total}</div>
            </div>
            <div className="card soft kpi">
              <div className="small">Menunggu</div>
              <div className="big">{today.Menunggu}</div>
            </div>
            <div className="card soft kpi">
              <div className="small">Diproses</div>
              <div className="big">{today.Diproses}</div>
            </div>
            <div className="card soft kpi">
              <div className="small">Selesai</div>
              <div className="big">{today.Selesai}</div>
            </div>
            <div className="card soft kpi">
              <div className="small">Revenue hari ini</div>
              <div className="big">{formatRupiah(today.revenue)}</div>
            </div>
          </div>
        )}
      </Card>

      {showMaster && (
        <MasterDataPanel data={data} setData={setData} pushToast={pushToast} />
      )}

      <div className="grid2">
        <Card title="Toples Perlu Dibuat" right={<span className="badge">Menunggu + Diproses</span>}>
          {loading ? <Skeleton h={180} /> : (
            <div className="kpiGrid" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
              <div className="card soft kpi"><div className="small">Total</div><div className="big">{toples.total}</div></div>
              <div className="card soft kpi"><div className="small">400g</div><div className="big">{toples["400g"]}</div></div>
              <div className="card soft kpi"><div className="small">550g</div><div className="big">{toples["550g"]}</div></div>
              <div className="card soft kpi"><div className="small">600g</div><div className="big">{toples["600g"]}</div></div>
            </div>
          )}
        </Card>

        <Card title="Chart Status Pesanan" right={<span className="badge">Chart</span>}>
          {loading ? <Skeleton h={240} /> : (
            <div className="hstack" style={{ justifyContent: "center", padding: 6 }}>
              <DonutChart data={status} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid2eq">
        <Card title="Toples Terlaris Bulan Ini" right={<span className="badge">{leaderboard.ym}</span>}>
          {loading ? <Skeleton h={220} /> : (
            <div className="vstack" style={{ gap: 10 }}>
              {leaderboard.totalQty === 0 ? (
                <div className="card soft pad">
                  <div style={{ fontWeight: 1000 }}>Belum ada pesanan selesai bulan ini</div>
                  <div className="muted" style={{ marginTop: 4 }}>Set status jadi Selesai agar leaderboard terisi.</div>
                </div>
              ) : leaderboard.items.map((it, idx) => (
                <div key={it.ukuran} className={`card ${idx===0 ? "soft" : ""} pad`}>
                  <div className="hstack" style={{ justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 1000 }}>#{idx+1} • {it.ukuran}</div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                        Terjual <b>{it.qty}</b> • Kontribusi <b>{it.pct.toFixed(1)}%</b>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 1000 }}>{formatRupiah(it.revenue)}</div>
                      <div className="muted" style={{ fontSize: 12 }}>Profit <b>{formatRupiah(it.profit)}</b></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Kebutuhan Bahan Produksi" right={<span className="badge">Cek Stok</span>}>
          {loading ? <Skeleton h={220} /> : (
            <>
              <div className="card soft pad">
                <div className="hstack" style={{ justifyContent: "space-between" }}>
                  <div className="muted">Total produksi (estimasi)</div>
                  <div style={{ fontWeight: 1000 }}>{bahanNeed.totalGram.toFixed(0)} g • {bahanNeed.totalKg.toFixed(2)} kg</div>
                </div>
              </div>

              <div className="vstack" style={{ marginTop: 10, gap: 10 }}>
                {bahanNeed.list.length === 0 ? (
                  <div className="card soft pad">
                    <div style={{ fontWeight: 1000 }}>Data bahan baku kosong</div>
                    <div className="muted" style={{ marginTop: 4 }}>Klik “Kelola Data” untuk input bahan.</div>
                  </div>
                ) : bahanNeed.list.map((x) => (
                  <div
                    key={x.bahan}
                    className="card pad"
                    style={{
                      borderColor: x.ok ? "rgba(22,163,74,.22)" : "rgba(202,138,4,.25)",
                      background: x.ok ? "rgba(22,163,74,.06)" : "rgba(202,138,4,.08)"
                    }}
                  >
                    <div className="hstack" style={{ justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 1000 }}>{x.bahan}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                          Need <b>{x.need.toFixed(2)}</b> {x.satuan} • Stok <b>{x.stok.toFixed(2)}</b> {x.satuan}
                        </div>
                      </div>
                      <span className="badge">{x.ok ? "✅ Cukup" : `⚠️ Kurang ${Math.abs(x.diff).toFixed(2)}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
