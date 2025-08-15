import React, { useState } from "react";
import "../index.css";
import "../styles/Home.css";

export default function Home() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const API_URL = "http://localhost:5000/api/pengumuman"; // ganti sesuai API backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, isi }),
      });

      if (!res.ok) throw new Error("Gagal mengirim pengumuman");

      setJudul("");
      setIsi("");
      setStatus("✅ Pengumuman berhasil dikirim");
    } catch (err) {
      console.error(err);
      setStatus("❌ Gagal mengirim pengumuman");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pengumuman-container">
      <h1 className="pengumuman-title">📢 Upload Pengumuman</h1>
      <form onSubmit={handleSubmit} className="pengumuman-card">
        <label>Judul:</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul pengumuman"
          required
        />

        <label>Isi Pengumuman:</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Masukkan isi pengumuman"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Pengumuman"}
        </button>
      </form>

      {status && <p className="pengumuman-status">{status}</p>}
    </div>
  );
}
