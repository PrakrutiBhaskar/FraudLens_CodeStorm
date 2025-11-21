import { useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function UploadScan() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scoreColor = (score) => {
    if (score >= 80) return "text-red-500";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  async function uploadFile() {
    if (!file) {
      setError("Please select an APK file first.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const fd = new FormData();
      fd.append("apk", file);
      fd.append("brand", "phonepe");

      const res = await axios.post("http://localhost:5001/api/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Upload APK for Analysis</h1>
        <div className="divider"></div>

        <input
          type="file"
          className="panel mb-4 bg-black/20 text-sm p-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <button
          className="hacker-btn"
          onClick={uploadFile}
          disabled={loading}
        >
          {loading ? "SCANNING..." : "START SCAN"}
        </button>
      </div>

      {result && (
        <div className="panel">
          <h2 className="neon-text text-xl mb-4">Scan Results</h2>

          <div className="mb-4">
            <span className="text-lg">Risk Score: </span>
            <span className={`text-2xl font-bold ${scoreColor(result.score)}`}>
              {result.score}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-lg neon-text">Reasons:</h3>
            <ul className="list-disc ml-6 text-sm">
              {result.reasons?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg neon-text">Evidence Files:</h3>
            <div className="text-sm space-y-1">
              <a
                href={`http://localhost:5001${result.evidence.json}`}
                target="_blank"
                className="text-blue-400 underline"
              >
                Download JSON Evidence
              </a>
              <br />
              <a
                href={`http://localhost:5001${result.evidence.html}`}
                target="_blank"
                className="text-blue-400 underline"
              >
                View HTML Report
              </a>
            </div>
          </div>

          <pre className="text-xs bg-black/50 p-4 rounded mt-4 overflow-auto max-h-80">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
