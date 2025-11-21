import { useState } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function UploadScan() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  async function uploadFile() {
    const fd = new FormData();
    fd.append("apk", file);

    const res = await axios.post("/api/upload", fd);
    setResult(res.data);
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Upload APK for Analysis</h1>
        <div className="divider"></div>

        <input
          type="file"
          className="panel mb-4 bg-black/20"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="hacker-btn" onClick={uploadFile}>
          START SCAN
        </button>
      </div>

      {result && (
        <div className="panel">
          <h2 className="neon-text text-xl mb-2">Scan Results</h2>
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
