import React, { useEffect, useMemo, useState } from "react";
import AppBar from "./components/AppBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ToastHost from "./components/Toast.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Input from "./pages/Input.jsx";
import Orders from "./pages/Orders.jsx";

import { fetchAllData } from "./lib/api.js";

export default function App() {
  const [route, setRoute] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ pesanan: [], produksi: [], bahan: [] });
  const [toasts, setToasts] = useState([]);

  function pushToast(type, message) {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetchAllData();
      setData(res);
    } catch (e) {
      setErr(e?.message || "Gagal fetch data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const page = useMemo(() => {
    const common = { data, setData, loading, err, refresh, pushToast };
    if (route === "input") return <Input {...common} />;
    if (route === "orders") return <Orders {...common} />;
    return <Dashboard {...common} />;
  }, [route, data, loading, err]);

  return (
    <div className="app">
      <AppBar title="Toko Nastar" subtitle="Sistem Manajemen" onRefresh={refresh} loading={loading} />

      <main className="content">
        <div className="appFrame">
          {page}
        </div>

        {/* Desktop nav di bawah frame */}
        <BottomNav route={route} onRoute={setRoute} />
      </main>

      {/* Mobile nav fixed */}
      <div className="mobileNavOnly">
        <BottomNav route={route} onRoute={setRoute} />
      </div>

      <ToastHost toasts={toasts} />

      <style>{`
        @media (min-width: 980px){
          .mobileNavOnly{display:none;}
        }
        @media (max-width: 979px){
          .appFrame{padding:0; background:transparent; border:0; box-shadow:none;}
          .content{padding-bottom:96px;}
          .content > .bottomNav{display:none;}
        }
      `}</style>
    </div>
  );
}
