import "../index.css";
import React from "react";
import { motion } from "framer-motion"; // npm install framer-motion

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <footer>
        &copy; {new Date().getFullYear()} UPM Chess Club - Perangkat Pengurus
      </footer>
    </motion.footer>
  );
}
