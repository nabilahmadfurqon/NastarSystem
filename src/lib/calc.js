import { isoToday, toNumber } from "./format.js";

export const STATUS = ["Menunggu", "Diproses", "Selesai"];

export function nextStatus(s) {
  if (s === "Menunggu") return "Diproses";
  if (s === "Diproses") return "Selesai";
  return "Selesai";
}

export function prodMapBySize(produksiRows) {
  const map = new Map();
  for (const r of produksiRows || []) {
    if (!r?.Ukuran) continue;
    map.set(String(r.Ukuran), {
      gram: toNumber(r.Gram),
      modal: toNumber(r.ModalPerToples),
      jual: toNumber(r.HargaJualPerToples)
    });
  }
  return map;
}

export function sortNewestFirst(pesanan) {
  return [...(pesanan || [])].sort((a, b) => {
    const da = String(a.Tanggal || "");
    const db = String(b.Tanggal || "");
    if (da !== db) return db.localeCompare(da);
    return String(b.ID || "").localeCompare(String(a.ID || ""));
  });
}

export function filterSearch(pesanan, statusFilter, q) {
  const query = (q || "").trim().toLowerCase();
  return (pesanan || []).filter((r) => {
    const okStatus = statusFilter === "Semua" ? true : String(r.StatusPesanan) === statusFilter;
    if (!okStatus) return false;
    if (!query) return true;
    const id = String(r.ID || "").toLowerCase();
    const nama = String(r.Nama || "").toLowerCase();
    return id.includes(query) || nama.includes(query);
  });
}

export function todaySummary(pesanan) {
  const today = isoToday();
  const rows = (pesanan || []).filter((r) => String(r.Tanggal) === today);
  const c = { total: rows.length, Menunggu: 0, Diproses: 0, Selesai: 0, revenue: 0 };
  for (const r of rows) {
    const st = String(r.StatusPesanan || "Menunggu");
    if (c[st] != null) c[st]++;
    c.revenue += toNumber(r.Total);
  }
  return c;
}

export function toplesPerluDibuat(pesanan) {
  const rows = (pesanan || []).filter((r) => ["Menunggu", "Diproses"].includes(String(r.StatusPesanan)));
  const out = { total: 0, "400g": 0, "550g": 0, "600g": 0 };
  for (const r of rows) {
    const size = String(r.Ukuran || "");
    const qty = toNumber(r.JumlahToples);
    out.total += qty;
    if (out[size] != null) out[size] += qty;
  }
  return out;
}

export function statusCounts(pesanan) {
  const c = { Menunggu: 0, Diproses: 0, Selesai: 0 };
  for (const r of pesanan || []) {
    const st = String(r.StatusPesanan || "Menunggu");
    if (c[st] != null) c[st]++;
  }
  return c;
}

export function bulanIniLeaderboard(pesanan, produksiMap) {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
  const rows = (pesanan || []).filter((r) =>
    String(r.StatusPesanan) === "Selesai" && String(r.Tanggal || "").startsWith(ym)
  );

  const sizes = ["400g", "550g", "600g"];
  const stats = sizes.map((s) => ({
    ukuran: s,
    qty: 0,
    revenue: 0,
    profit: 0
  }));

  const totalQty = rows.reduce((sum, r) => sum + toNumber(r.JumlahToples), 0);

  for (const r of rows) {
    const ukuran = String(r.Ukuran || "");
    const qty = toNumber(r.JumlahToples);
    const p = produksiMap.get(ukuran) || { modal: 0, jual: 0 };
    const rev = qty * toNumber(p.jual);
    const prof = qty * (toNumber(p.jual) - toNumber(p.modal));
    const item = stats.find((x) => x.ukuran === ukuran);
    if (item) {
      item.qty += qty;
      item.revenue += rev;
      item.profit += prof;
    }
  }

  const withPct = stats.map((x) => ({
    ...x,
    pct: totalQty > 0 ? (x.qty / totalQty) * 100 : 0
  }));

  withPct.sort((a, b) => b.qty - a.qty);
  return { ym, totalQty, items: withPct };
}

export function kebutuhanBahan(pesanan, produksiMap, bahanRows) {
  const rows = (pesanan || []).filter((r) => ["Menunggu", "Diproses"].includes(String(r.StatusPesanan)));
  let totalGram = 0;

  for (const r of rows) {
    const ukuran = String(r.Ukuran || "");
    const qty = toNumber(r.JumlahToples);
    const gram = toNumber(produksiMap.get(ukuran)?.gram || 0);
    totalGram += qty * gram;
  }

  const totalKg = totalGram / 1000;

  const list = (bahanRows || []).map((b) => {
    const stok = toNumber(b.Stok);
    const perKg = toNumber(b.Untuk1kgNastar);
    const need = totalKg * perKg;
    const ok = stok >= need;
    return {
      bahan: String(b.Bahan || ""),
      satuan: String(b.Satuan || ""),
      stok,
      need,
      ok,
      diff: stok - need
    };
  });

  return { totalGram, totalKg, list };
}

export function genOrderId(pesanan) {
  // NST-YYYYMMDD-XXX (XXX naik berdasarkan data existing untuk hari ini)
  const today = isoToday().replaceAll("-", ""); // YYYYMMDD
  const prefix = `NST-${today}-`;
  const todayRows = (pesanan || []).filter((r) => String(r.ID || "").startsWith(prefix));
  let max = 0;
  for (const r of todayRows) {
    const id = String(r.ID || "");
    const tail = id.slice(prefix.length);
    const n = Number(tail);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  const next = String(max + 1).padStart(3, "0");
  return `${prefix}${next}`;
}
