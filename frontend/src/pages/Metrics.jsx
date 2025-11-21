import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get("/api/metrics").then((res) => setMetrics(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Backend Success Metrics</h1>
        <div className="divider"></div>
      </div>

      <div className="panel">
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    </div>
  );
}
