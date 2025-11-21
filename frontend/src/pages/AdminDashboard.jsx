import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function AdminDashboard() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Brand Admin Dashboard</h1>
        <div className="divider"></div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {brands.map((b) => (
          <div key={b._id} className="panel">
            <div className="neon-text text-xl">{b.name}</div>
            <div className="text-xs">{b.package}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
