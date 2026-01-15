const BASE = import.meta.env.VITE_SHEETBEST_BASE_URL;
const TAB_PESANAN = import.meta.env.VITE_TAB_PESANAN || "PESANAN";
const TAB_PRODUKSI = import.meta.env.VITE_TAB_PRODUKSI || "PRODUKSI";
const TAB_BAHAN = import.meta.env.VITE_TAB_BAHAN || "BAHAN_BAKU";

function assertEnv() {
  if (!BASE) throw new Error("ENV VITE_SHEETBEST_BASE_URL belum diisi");
}

async function http(url, opts) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${t || res.statusText}`);
  }
  return res.json();
}

export async function fetchTab(tabName) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(tabName)}`);
}

export async function fetchAllData() {
  const [pesanan, produksi, bahan] = await Promise.all([
    fetchTab(TAB_PESANAN),
    fetchTab(TAB_PRODUKSI),
    fetchTab(TAB_BAHAN)
  ]);
  return { pesanan, produksi, bahan };
}

export async function createOrder(order) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_PESANAN)}`, {
    method: "POST",
    body: JSON.stringify(order)
  });
}

export async function patchOrderById(id, patch) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_PESANAN)}/ID/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

/* ===== BAHAN_BAKU ===== */
export async function createBahan(row) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_BAHAN)}`, {
    method: "POST",
    body: JSON.stringify(row)
  });
}
export async function patchBahanByName(bahan, patch) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_BAHAN)}/Bahan/${encodeURIComponent(bahan)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

/* ===== PRODUKSI ===== */
export async function createProduksi(row) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_PRODUKSI)}`, {
    method: "POST",
    body: JSON.stringify(row)
  });
}
export async function patchProduksiByUkuran(ukuran, patch) {
  assertEnv();
  return http(`${BASE}/tabs/${encodeURIComponent(TAB_PRODUKSI)}/Ukuran/${encodeURIComponent(ukuran)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}
