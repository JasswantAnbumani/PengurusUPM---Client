import React, { useState, useEffect } from 'react';
import "../index.css";
import "../styles/Absensi.css";

export default function Absensi() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anggota, setAnggota] = useState([]);
  const [tanggal, setTanggal] = useState("");
  const [absensi, setAbsensi] = useState({});
  const [form, setForm] = useState({ user: '', pass: '' });
  const [rekap, setRekap] = useState(null);

  const handleLogin = () => {
    if (form.user === 'admin' && form.pass === '123') {
      setLoggedIn(true);
    } else {
      alert('Login gagal!');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetch('https://pengurusupm-server.onrender.com/api/absensi/anggota')
        .then(res => res.json())
        .then(data => {
          setAnggota(data);
          const initialStatus = {};
          data.forEach(a => {
            initialStatus[a._id] = ""; // biarkan kosong, user pilih manual
          });
          setAbsensi(initialStatus);
        });
    }
  }, [loggedIn]);

  const handleSubmit = () => {
    if (!tanggal) return alert("Pilih tanggal dulu");

    // validasi semua anggota sudah dipilih
    const belumDipilih = Object.values(absensi).some(status => status === "");
    if (belumDipilih) return alert("Masih ada anggota yang belum dipilih statusnya");

    const data = anggota.map(a => ({
      anggotaId: a._id,
      nama: a.nama,
      status: absensi[a._id]
    }));

    fetch('https://pengurusupm-server.onrender.com/api/absensi', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tanggal, data })
    })
      .then(res => res.json())
      .then(() => {
        alert("Absensi berhasil disimpan");
        loadRekap(tanggal);
      });
  };

  const loadRekap = (tgl) => {
    if (!tgl) return alert("Pilih tanggal dulu sebelum lihat rekap!");
    fetch(`https://pengurusupm-server.onrender.com/api/absensi/${tgl}`)
      .then(res => res.json())
      .then(data => setRekap(data));
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>Login Akses Absensi</h1>
        <input placeholder="Username" onChange={e => setForm({ ...form, user: e.target.value })} />
        <input placeholder="Password" type="password" onChange={e => setForm({ ...form, pass: e.target.value })} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="absensi-container">
      <h1>Absensi Anggota</h1>

      <div className="absensi-controls">
        <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
        <button onClick={() => loadRekap(tanggal)}>Lihat Rekap</button>
      </div>

      {/* Grid absensi */}
      <div className="absensi-grid">
        {anggota.map(a => (
          <div key={a._id} className="absensi-card">
            <h3>{a.nama}</h3>
            <select
              value={absensi[a._id]}
              onChange={(e) => setAbsensi({ ...absensi, [a._id]: e.target.value })}
              className={
                absensi[a._id] === "Hadir"
                  ? "status-hadir"
                  : absensi[a._id] === "Tidak Hadir"
                  ? "status-tidak"
                  : ""
              }
            >
              <option value="">-- Pilih Status --</option>
              <option value="Hadir">✅ Hadir</option>
              <option value="Tidak Hadir">❌ Tidak Hadir</option>
            </select>
          </div>
        ))}
      </div>

      <button className="btn-simpan" onClick={handleSubmit}>Simpan Absensi</button>

      {/* Rekap */}
      {rekap && (
        <div className="rekap-container">
          <h2>Rekap {rekap.tanggal}</h2>
          <div className="absensi-grid">
            {rekap.data.map((r, i) => (
              <div
                key={i}
                className={`absensi-card ${r.status === "Hadir" ? "status-hadir" : "status-tidak"}`}
              >
                <h3>{r.nama}</h3>
                <p>{r.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

