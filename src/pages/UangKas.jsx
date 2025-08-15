import React, { useState, useEffect } from "react";
import UangKasExport from "../components/UangKasExport";
import "../index.css";
import { motion } from "framer-motion"; // npm install framer-motion

export default function UangKas() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anggota, setAnggota] = useState([]);
  const [uangKas, setUangKas] = useState([]);
  const [form, setForm] = useState({ user: "", pass: "" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "AGU",
    "SEP",
    "OKT",
    "NOV",
    "DES",
  ];

  const handleDownload = () => {
    window.open(
      "https://pengurusupm-server.onrender.com/api/uangkas/export",
      "_blank"
    );
  };

  const handleLogin = () => {
    if (form.user === "kas" && form.pass === "123") {
      setLoggedIn(true);
    } else {
      alert("Login gagal!");
    }
  };

  // Ambil data anggota + kas
  useEffect(() => {
    if (loggedIn) {
      fetch("https://pengurusupm-server.onrender.com/api/anggota")
        .then((res) => res.json())
        .then((data) => setAnggota(data));

      fetchUangKas(selectedYear);
    }
  }, [loggedIn, selectedYear]);

  const fetchUangKas = (year) => {
    fetch(`https://pengurusupm-server.onrender.com/api/uangkas?year=${year}`)
      .then((res) => res.json())
      .then((data) => setUangKas(data))
      .catch((err) => console.error(err));
  };

  const togglePayment = (chessClubId, monthIndex) => {
    const monthNum = monthIndex + 1;
    const newStatus = !isPaid(chessClubId, monthNum);

    fetch("https://pengurusupm-server.onrender.com/api/uangkas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chessClubId: String(chessClubId), // kirim chessClubId, bukan _id
        year: selectedYear,
        month: monthNum,
        status: newStatus ? "Lunas" : "Belum",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal update kas");
        return res.json();
      })
      .then(() => fetchUangKas(selectedYear))
      .catch((err) => console.error(err));
  };

  const isPaid = (anggotaId, monthNum) => {
    return uangKas.some(
      (d) =>
        String(d.chessClubId) === String(anggotaId) &&
        d.month === monthNum &&
        d.year === selectedYear &&
        d.status === "Lunas"
    );
  };

  const totalKas = uangKas.filter((d) => d.status === "Lunas").length * 10000;

  if (!loggedIn) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-container">
          <h1>Login Akses Uang Kas</h1>
          <input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="uangkas-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Uang Kas Tahun {selectedYear}</h1>
          <div className="total-kas">
            💰 Total: Rp {totalKas.toLocaleString("id-ID")}
          </div>
        </div>

        <UangKasExport />

        {/* Pilih tahun */}
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {Array.from(
            { length: 5 },
            (_, i) => new Date().getFullYear() - 2 + i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Tabel uang kas */}
        <div className="table-responsive">
          <table className="uangkas-table">
            <thead>
              <tr>
                <th>Nama</th>
                {months.map((m, idx) => (
                  <th key={idx}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anggota.map((a, i) => (
                <tr key={i}>
                  <td>{a.nama}</td>
                  {months.map((m, idx) => {
                    const monthNum = idx + 1;
                    const paid = isPaid(a.chessClubId, monthNum);
                    return (
                      <td
                        key={idx}
                        className={`kas-cell ${paid ? "paid" : "unpaid"}`}
                        onClick={() => togglePayment(a.chessClubId, idx)}
                      >
                        {paid ? "✅" : "❌"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
