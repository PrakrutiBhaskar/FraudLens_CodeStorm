import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function AdminDashboard() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [pkg, setPkg] = useState("");
  const [status, setStatus] = useState("");

  // Load brands on page load
  async function loadBrands() {
    try {
      const res = await axios.get("http://localhost:5001/api/brands");
      setBrands(res.data.brands || []);
    } catch (err) {
      setStatus("❌ Failed to load brands");
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  // Add new brand
  async function addBrand() {
    if (!name || !pkg) {
      setStatus("⚠ Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/brands", {
        brandName: name,     // 🔥 FIXED
        packageName: pkg     // 🔥 FIXED
      });

      if (res.data.success) {
        setStatus("✅ Brand added successfully!");
        setName("");
        setPkg("");
        loadBrands();
      } else {
        setStatus("⚠ Failed: " + res.data.error);
      }
    } catch (err) {
      setStatus("❌ Error adding brand");
    }
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Brand Admin Dashboard</h1>
        <div className="divider"></div>
      </div>

      <div className="panel mb-6">
        <h2 className="neon-text text-xl mb-4">Add New Brand</h2>

        <div className="flex gap-3 mb-4">
          <input
            className="panel flex-1"
            placeholder="Brand Name (e.g. phonepe)"
            style={{ color: "#00ff66" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="panel flex-1"
            placeholder="Official Package Name"
            style={{ color: "#00ff66" }}
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
          />

          <button className="hacker-btn" onClick={addBrand}>
            ADD BRAND
          </button>
        </div>

        {status && <div className="neon-text text-sm">{status}</div>}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {brands.length === 0 && (
          <div className="neon-text text-lg opacity-75">No brands found</div>
        )}

        {brands.map((b) => (
          <div key={b.brandName} className="panel">
            <div className="neon-text text-xl">{b.brandName}</div>
            <div className="text-xs opacity-80">{b.packageName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
