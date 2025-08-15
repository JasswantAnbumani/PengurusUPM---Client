import React, { useEffect, useState } from 'react';
import "../index.css";

export default function DaftarAnggota() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formLogin, setFormLogin] = useState({ user: "", pass: "" });
  const [anggota, setAnggota] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nama: "", nim: "", jabatan: "", angkatan: "" });

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  const fetchData = () => {
    fetch('https://pengurusupm-server.onrender.com/api/anggota')
      .then(res => res.json())
      .then(data => setAnggota(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://pengurusupm-server.onrender.com/api/anggota', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setForm({ nama: "", nim: "", jabatan: "", angkatan: "" });
        fetchData();
      })
      .catch(err => console.error(err));
  };

  const filteredAnggota = anggota.filter(a =>
    (a.nama?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.nim?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.jabatan?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.chessClubId?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleLogin = () => {
    if (formLogin.user === "data" && formLogin.pass === "123") {
      setLoggedIn(true);
    } else {
      alert("Login gagal!");
    }
  };

  // Jika belum login, tampilkan form login
  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>Login Akses Daftar Anggota</h1>
        <input
          type="text"
          placeholder="Username"
          value={formLogin.user}
          onChange={(e) => setFormLogin({ ...formLogin, user: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formLogin.pass}
          onChange={(e) => setFormLogin({ ...formLogin, pass: e.target.value })}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // Jika sudah login, tampilkan data anggota
  return (
    <div className="daftar-anggota-container">
      <h1>Daftar Anggota</h1>

<form onSubmit={handleSubmit} className="anggota-form">
        <input type="text" placeholder="Nama" value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
        <input type="text" placeholder="NIM" value={form.nim}
          onChange={(e) => setForm({ ...form, nim: e.target.value })} required />
        <input type="text" placeholder="Jabatan" value={form.jabatan}
          onChange={(e) => setForm({ ...form, jabatan: e.target.value })} required />
        <input type="text" placeholder="Angkatan (ex: 24)" value={form.angkatan}
          onChange={(e) => setForm({ ...form, angkatan: e.target.value })} required />
        <button type="submit">Tambah Anggota</button>
      </form>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Cari anggota..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Tabel daftar anggota */}
      <table className="anggota-table">
        <thead>
          <tr>
            <th>Chess Club ID</th>
            <th>Nama</th>
            <th>NIM</th>
            <th>Jabatan</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnggota.map((a, i) => (
            <tr key={i}>
              <td>{a.chessClubId}</td>
              <td>{a.nama}</td>
              <td>{a.nim}</td>
              <td>{a.jabatan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

