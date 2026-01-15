export function isoToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatRupiah(n) {
  const num = Number(n || 0);
  const s = Math.round(num).toString();
  const parts = [];
  for (let i = s.length; i > 0; i -= 3) {
    const start = Math.max(i - 3, 0);
    parts.unshift(s.slice(start, i));
  }
  return `Rp ${parts.join(".")}`;
}

export function toNumber(x) {
  if (typeof x === "number") return x;
  if (x == null) return 0;
  const s = String(x).replace(/\./g, "").replace(/,/g, ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
