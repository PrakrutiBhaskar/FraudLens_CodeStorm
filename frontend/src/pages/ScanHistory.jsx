import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function ScanHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("/api/scans").then((res) => setHistory(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Scan History</h1>
        <div className="divider"></div>
      </div>

      <div className="panel h-[70vh] overflow-auto">
        {history.map((h) => (
          <div key={h._id} className="mb-3 panel">
            <div className="neon-text">{h.appName}</div>
            <div className="text-xs opacity-80">{h.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
