import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UangKasExport() {
  const [tahun, setTahun] = useState("");
  const [tahunList, setTahunList] = useState([]);

  useEffect(() => {
    axios
      .get("https://pengurusupm-server.onrender.com/api/uangkas/years")
      .then((res) => {
        setTahunList(res.data);
        if (res.data.length) setTahun(res.data[0]); // Pilih tahun terbaru default
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDownload = () => {
    if (!tahun) return alert("Pilih tahun dulu!");
    window.location.href = `https://pengurusupm-server.onrender.com/api/uangkas/export?year=${tahun}`;
  };

  return (
    <div style={{ padding: "20px", background: "transparent", color: "#fff" }}>
      <h2>Export Data Uang Kas</h2>

      <label style={{ marginRight: "10px" }}>Pilih Tahun: </label>
      <select value={tahun} onChange={(e) => setTahun(e.target.value)}>
        {tahunList.map((t, i) => (
          <option key={i} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button
        onClick={handleDownload}
        style={{
          background: "#4CAF50",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          marginLeft: "10px",
        }}
      >
        📥 Download Excel
      </button>
    </div>
  );
}
