import React, { useMemo, useState } from "react";
import Card from "./Card.jsx";
import { toNumber, formatRupiah } from "../lib/format.js";
import { createBahan, patchBahanByName, createProduksi, patchProduksiByUkuran } from "../lib/api.js";

export default function MasterDataPanel({ data, setData, pushToast }) {
  const bahanSorted = useMemo(() => [...(data.bahan || [])].sort((a,b)=>String(a.Bahan||"").localeCompare(String(b.Bahan||""))), [data.bahan]);
  const produksiSorted = useMemo(() => ["400g","550g","600g"].map(u => (data.produksi||[]).find(x=>String(x.Ukuran)===u) || {Ukuran:u, Gram:u==="400g"?400:u==="550g"?550:600, ModalPerToples:"", HargaJualPerToples:""}), [data.produksi]);

  // form bahan
  const [bahan, setBahan] = useState("");
  const [harga, setHarga] = useState("");
  const [satuan, setSatuan] = useState("gram");
  const [stok, setStok] = useState("");
  const [untuk1kg, setUntuk1kg] = useState("");
  const [busyBahan, setBusyBahan] = useState(false);

  async function submitBahan() {
    const nm = bahan.trim();
    if (!nm) return pushToast("error","Nama bahan wajib");
    const row = {
      Bahan: nm,
      Harga: toNumber(harga),
      Satuan: satuan.trim() || "",
      Stok: toNumber(stok),
      Untuk1kgNastar: toNumber(untuk1kg)
    };

    setBusyBahan(true);
    try {
      // kalau bahan sudah ada → PATCH, kalau belum → POST
      const exists = bahanSorted.find(x => String(x.Bahan).toLowerCase() === nm.toLowerCase());
      if (exists) {
        await patchBahanByName(exists.Bahan, row);
        setData(d => ({
          ...d,
          bahan: (d.bahan||[]).map(x => x.Bahan===exists.Bahan ? {...x, ...row} : x)
        }));
        pushToast("success", `Update bahan: ${nm}`);
      } else {
        await createBahan(row);
        setData(d => ({ ...d, bahan: [row, ...(d.bahan||[])] }));
        pushToast("success", `Tambah bahan: ${nm}`);
      }

      setBahan(""); setHarga(""); setSatuan("gram"); setStok(""); setUntuk1kg("");
    } catch (e) {
      pushToast("error", e?.message || "Gagal simpan bahan");
    } finally {
      setBusyBahan(false);
    }
  }

  // produksi quick edit
  const [busyProd, setBusyProd] = useState(false);

  async function saveProduksi(u, gram, modal, jual) {
    const row = {
      Ukuran: u,
      Gram: toNumber(gram),
      ModalPerToples: toNumber(modal),
      HargaJualPerToples: toNumber(jual)
    };
    setBusyProd(true);
    try {
      const exists = (data.produksi||[]).find(x => String(x.Ukuran)===u);
      if (exists) {
        await patchProduksiByUkuran(u, row);
        setData(d => ({
          ...d,
          produksi: (d.produksi||[]).map(x => String(x.Ukuran)===u ? {...x, ...row} : x)
        }));
        pushToast("success", `Update produksi ${u}`);
      } else {
        await createProduksi(row);
        setData(d => ({ ...d, produksi: [row, ...(d.produksi||[])] }));
        pushToast("success", `Tambah produksi ${u}`);
      }
    } catch (e) {
      pushToast("error", e?.message || "Gagal simpan produksi");
    } finally {
      setBusyProd(false);
    }
  }

  return (
    <div className="vstack" style={{gap:12}}>
      <Card title="Master Data — Produksi" right={<span className="badge">Harga & Modal</span>}>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Ukuran</th>
                <th>Gram</th>
                <th>Modal/Toples</th>
                <th>Harga Jual/Toples</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produksiSorted.map((r) => (
                <ProduksiRow key={r.Ukuran} r={r} busy={busyProd} onSave={saveProduksi} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="muted" style={{fontSize:12, marginTop:10}}>
          * Edit angka lalu klik Simpan. Ini yang dipakai untuk hitung Total, Revenue, Profit.
        </div>
      </Card>

      <Card title="Master Data — Bahan Baku" right={<span className="badge">Input & Update</span>}>
        <div className="grid2eq">
          <div className="card soft pad">
            <div className="title">Input Bahan</div>
            <div className="subtitle">Tambah baru atau update jika namanya sama</div>
            <div className="hr" />

            <div className="vstack">
              <div>
                <div className="label">Bahan</div>
                <input className="input" value={bahan} onChange={(e)=>setBahan(e.target.value)} placeholder="Contoh: Tepung terigu" />
              </div>
              <div className="grid2eq">
                <div>
                  <div className="label">Harga</div>
                  <input className="input" value={harga} onChange={(e)=>setHarga(e.target.value)} placeholder="contoh: 18000" />
                </div>
                <div>
                  <div className="label">Satuan</div>
                  <input className="input" value={satuan} onChange={(e)=>setSatuan(e.target.value)} placeholder="gram / kg / pcs" />
                </div>
              </div>
              <div className="grid2eq">
                <div>
                  <div className="label">Stok</div>
                  <input className="input" value={stok} onChange={(e)=>setStok(e.target.value)} placeholder="contoh: 5000" />
                </div>
                <div>
                  <div className="label">Untuk 1kg Nastar</div>
                  <input className="input" value={untuk1kg} onChange={(e)=>setUntuk1kg(e.target.value)} placeholder="contoh: 250" />
                </div>
              </div>

              <button className="btn btn-primary" onClick={submitBahan} disabled={busyBahan}>
                {busyBahan ? "Menyimpan..." : "Simpan Bahan"}
              </button>

              <div className="muted" style={{fontSize:12}}>
                Tips: isi angka tanpa “Rp” atau titik.
              </div>
            </div>
          </div>

          <div className="card pad">
            <div className="title">Daftar Bahan</div>
            <div className="subtitle">Klik bahan untuk quick edit</div>
            <div className="hr" />

            {bahanSorted.length === 0 ? (
              <div className="card soft pad">
                <div style={{fontWeight:950}}>Belum ada bahan</div>
                <div className="muted" style={{marginTop:4}}>Tambah lewat form di kiri.</div>
              </div>
            ) : (
              <div className="vstack" style={{gap:10}}>
                {bahanSorted.map((b) => (
                  <BahanQuickEdit
                    key={b.Bahan}
                    row={b}
                    setData={setData}
                    pushToast={pushToast}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProduksiRow({ r, busy, onSave }) {
  const [gram, setGram] = useState(r.Gram ?? "");
  const [modal, setModal] = useState(r.ModalPerToples ?? "");
  const [jual, setJual] = useState(r.HargaJualPerToples ?? "");

  return (
    <tr>
      <td style={{fontWeight:950}}>{r.Ukuran}</td>
      <td><input className="input" style={{minWidth:120}} value={gram} onChange={(e)=>setGram(e.target.value)} /></td>
      <td><input className="input" style={{minWidth:160}} value={modal} onChange={(e)=>setModal(e.target.value)} /></td>
      <td><input className="input" style={{minWidth:170}} value={jual} onChange={(e)=>setJual(e.target.value)} /></td>
      <td>
        <button className="btn btn-primary" disabled={busy} onClick={() => onSave(r.Ukuran, gram, modal, jual)}>
          Simpan
        </button>
      </td>
    </tr>
  );
}

function BahanQuickEdit({ row, setData, pushToast }) {
  const [open, setOpen] = useState(false);
  const [harga, setHarga] = useState(row.Harga ?? "");
  const [stok, setStok] = useState(row.Stok ?? "");
  const [untuk1kg, setUntuk1kg] = useState(row.Untuk1kgNastar ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const patch = {
        Harga: toNumber(harga),
        Stok: toNumber(stok),
        Untuk1kgNastar: toNumber(untuk1kg)
      };
      await patchBahanByName(row.Bahan, patch);
      setData(d => ({
        ...d,
        bahan: (d.bahan||[]).map(x => x.Bahan===row.Bahan ? {...x, ...patch} : x)
      }));
      pushToast("success", `Update: ${row.Bahan}`);
      setOpen(false);
    } catch (e) {
      pushToast("error", e?.message || "Gagal update bahan");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card soft pad">
      <div className="hstack" style={{justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:1000}}>{row.Bahan}</div>
          <div className="muted" style={{fontSize:12, marginTop:2}}>
            Stok: <b>{row.Stok ?? 0}</b> {row.Satuan || ""} • Untuk 1kg: <b>{row.Untuk1kgNastar ?? 0}</b>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={()=>setOpen(v=>!v)}>{open ? "Tutup" : "Edit"}</button>
      </div>

      {open && (
        <div className="vstack" style={{marginTop:10}}>
          <div className="grid2eq">
            <div>
              <div className="label">Harga</div>
              <input className="input" value={harga} onChange={(e)=>setHarga(e.target.value)} />
            </div>
            <div>
              <div className="label">Stok</div>
              <input className="input" value={stok} onChange={(e)=>setStok(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="label">Untuk 1kg Nastar</div>
            <input className="input" value={untuk1kg} onChange={(e)=>setUntuk1kg(e.target.value)} />
          </div>
          <div className="hstack">
            <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Saving..." : "Simpan"}</button>
            <button className="btn btn-ghost" onClick={()=>setOpen(false)} disabled={busy}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
