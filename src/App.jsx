import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DaftarAnggota from './pages/DaftarAnggota';
import Absensi from './pages/Absensi';
import UangKas from './pages/UangKas';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anggota" element={<DaftarAnggota />} />
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/uangkas" element={<UangKas />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
