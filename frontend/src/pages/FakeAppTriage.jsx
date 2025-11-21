import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/matrix-theme.css";

export default function FakeAppTriage() {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = (msg) => {
    setLog((prev) => [
      `${new Date().toLocaleTimeString()} → ${msg}`,
      ...prev.slice(0, 50),
    ]);
  };

  // Load scan history on page load
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    addLog("Loading scan history...");

    try {
      const res = await axios.get("http://localhost:5001/api/scans");
      setCandidates(res.data.scans || []);
      addLog("History loaded");
    } catch (err) {
      console.error(err);
      addLog("❌ Failed to load history");
    }
  }

  // Search existing scans
  async function searchApps() {
    addLog(`Searching for "${query}"...`);

    try {
      const res = await axios.get("http://localhost:5001/api/scans", {
        params: { q: query },
      });

      setCandidates(res.data.scans || []);
      addLog("Search complete");
    } catch (err) {
      addLog("❌ Search failed");
    }
  }

  // Open selected app
  async function openCandidate(item) {
    addLog(`Opening ${item.meta?.package}`);

    setSelected({
      title: item.meta?.app_name || "Unknown App",
      package_name: item.meta?.package || "N/A",
      risk_score: item.score,
      reasons: item.reasons.map((r) => ({ signal: r, score: 1 })),
      evidence_url: item.evidence?.html || "#",
    });
  }

  return (
    <div className="p-6">
      {/* Search panel */}
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Fake App Triage Console</h1>
        <div className="divider"></div>

        <div className="flex gap-3">
          <input
<<<<<<< HEAD
            className="panel flex-1 p-2"
            placeholder="Search by package, app name, or keyword"
=======
            className="panel flex-1"
>>>>>>> 3173380fca6873c019a3349d380c506d5fc63019
            style={{ color: "#00ff66" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="hacker-btn" onClick={searchApps}>
            SEARCH
          </button>
          <button className="hacker-btn bg-green-600" onClick={loadHistory}>
            REFRESH
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Candidate list */}
        <div className="col-span-4 panel h-[70vh] overflow-auto">
          <h2 className="neon-text mb-2">Analyzed Apps</h2>

          {candidates.length === 0 && (
            <div className="opacity-50">No scans available</div>
          )}

          {candidates.map((app, idx) => (
            <button
              key={idx}
              className="panel mb-3 w-full text-left hacker-btn"
              onClick={() => openCandidate(app)}
            >
              <div className="neon-text">
                {app.meta?.app_name || "Unknown App"}
              </div>
              <div className="text-xs">{app.meta?.package}</div>
              <div className="text-green-400 text-xs mt-1">
                Risk: {app.score}%
              </div>
            </button>
          ))}
        </div>

        {/* Detail view */}
        <div className="col-span-8 panel h-[70vh] overflow-auto">
          {!selected && (
            <div className="neon-text text-lg opacity-70">
              Select an analyzed app to investigate
            </div>
          )}

          {selected && (
            <>
              <h2 className="neon-text text-2xl mb-2">{selected.title}</h2>
              <div className="text-sm mb-4">{selected.package_name}</div>

              <div className="panel mb-4">
                <div className="neon-text text-lg">
                  Risk Score: {Math.round(selected.risk_score)}%
                </div>
              </div>

              <div className="panel mb-4">
                <h3 className="neon-text mb-2">Reasons</h3>
                {selected.reasons.map((r, i) => (
                  <div key={i}>
                    {r.signal} → {Math.round(r.score * 100)}%
                  </div>
                ))}
              </div>

              <a
                href={selected.evidence_url}
                className="hacker-btn"
                download
              >
                DOWNLOAD EVIDENCE
              </a>
            </>
          )}
        </div>
      </div>

      {/* System Log */}
      <div className="panel mt-6 h-[150px] overflow-auto text-xs">
        <h3 className="neon-text mb-2">System Log</h3>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
