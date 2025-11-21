import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function AdminDashboard() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newPackage, setNewPackage] = useState("");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/brands");
      setBrands(res.data.brands || []);
      setError("");
    } catch (err) {
      setError("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Add brand
  const addBrand = async () => {
    if (!newBrand.trim() || !newPackage.trim()) {
      setError("Brand name & package are required.");
      return;
    }

    try {
      setError("");
      await axios.post("http://localhost:5001/api/brands/add", {
        name: newBrand,
        package: newPackage,
      });

    setNewBrand("");
    setNewPackage("");
      fetchBrands();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add brand");
    }
  };

  // Delete brand
  const deleteBrand = async (name) => {
    try {
      setError("");
      await axios.delete(`http://localhost:5001/api/brands/${name}`);
      fetchBrands();
    } catch (err) {
      setError("Failed to delete brand");
    }
  };

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Brand Admin Dashboard</h1>
        <div className="divider"></div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Add brand form */}
        <div className="panel p-4 mb-4 bg-black/40">
          <h2 className="neon-text text-xl mb-3">Add New Brand</h2>

          <input
            type="text"
            placeholder="Brand Name"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            className="panel p-2 mb-3 w-full bg-black/20"
          />

          <input
            type="text"
            placeholder="Official Package Name"
            value={newPackage}
            onChange={(e) => setNewPackage(e.target.value)}
            className="panel p-2 mb-4 w-full bg-black/20"
          />

          <button className="hacker-btn" onClick={addBrand}>
            ADD BRAND
          </button>
        </div>
      </div>

      {/* Brand cards */}
      {loading ? (
        <div className="text-green-400 neon-text text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {brands.map((b) => (
            <div key={b.name} className="panel relative p-4">
              <div className="neon-text text-xl mb-1">{b.name}</div>
              <div className="text-xs opacity-70 mb-3">{b.package}</div>

              <button
                className="absolute top-3 right-3 text-red-400 hover:text-red-300"
                onClick={() => deleteBrand(b.name)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
