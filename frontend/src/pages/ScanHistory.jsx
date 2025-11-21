import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/scans");

      // FIX: backend returns a list, not { scans: [...] }
      setHistory(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Scan History</h1>
        <div className="divider"></div>

        {error && <p className="text-red-400">{error}</p>}

        <button className="hacker-btn mt-2" onClick={loadHistory}>
          REFRESH
        </button>
      </div>

      {/* History List */}
      <div className="panel h-[70vh] overflow-auto p-4">
        {loading && (
          <div className="neon-text opacity-70">Loading scan logs...</div>
        )}

        {!loading && history.length === 0 && (
          <div className="opacity-70">No scans available.</div>
        )}

        {history.map((entry, idx) => (
          <div key={idx} className="panel mb-4 p-4 bg-black/40">
            <div className="neon-text text-lg">
              {entry.meta?.app_name || "Unknown App"}
            </div>

            <div className="text-xs opacity-80">
              Package: {entry.meta?.package}
            </div>

            <div className="text-xs mt-1 opacity-60">
              Risk Score: {entry.score}%
            </div>

            <div className="text-xs mt-1 opacity-60">
              Time: {entry.timestamp || "N/A"}
            </div>

            {/* Evidence Links */}
            <div className="mt-2 flex gap-2">
              {entry.evidence?.json && (
                <a
                  className="hacker-btn text-xs"
                  href={`http://localhost:5001${entry.evidence.json}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  JSON Evidence
                </a>
              )}

              {entry.evidence?.html && (
                <a
                  className="hacker-btn text-xs"
                  href={`http://localhost:5001${entry.evidence.html}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  HTML Evidence
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
