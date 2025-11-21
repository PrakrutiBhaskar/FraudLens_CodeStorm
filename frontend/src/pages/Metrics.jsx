import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMetrics() {
    try {
      setLoading(true);

      // First try backend route
      try {
        const res = await axios.get("http://localhost:5001/api/metrics");
        setMetrics(res.data);
        setError("");
        return;
      } catch {
        console.warn("API /api/metrics missing → using fallback.");
      }

      // FALLBACK: build metrics from scans
      const scanRes = await axios.get("http://localhost:5001/api/scans");
      const scans = scanRes.data.scans || [];

      if (scans.length === 0) {
        setMetrics({ message: "No scans yet" });
        return;
      }

      // Compute fallback metrics
      const total = scans.length;
      const avgRisk =
        scans.reduce((a, s) => a + s.score, 0) / scans.length;

      const highRisk = scans.filter((s) => s.score >= 80).length;

      const lastScan = scans[scans.length - 1]?.timestamp;

      // Find top reasons
      const reasonCounts = {};
      scans.forEach((scan) =>
        scan.reasons.forEach((r) => {
          reasonCounts[r] = (reasonCounts[r] || 0) + 1;
        })
      );

      const topReasons = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setMetrics({
        total_scans: total,
        average_risk_score: avgRisk.toFixed(2),
        high_risk_detections: highRisk,
        top_reasons: topReasons,
        last_scan_time: lastScan,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Backend Success Metrics</h1>
        <div className="divider"></div>
        {error && <p className="text-red-400">{error}</p>}
      </div>

      {loading ? (
        <div className="panel p-6 neon-text text-lg">Loading Metrics...</div>
      ) : (
        <div className="panel p-6">
          <pre className="text-green-400">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
