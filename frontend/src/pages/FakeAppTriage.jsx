import React, { useState, useEffect } from "react";
import "../styles/matrix-theme.css";

export default function FakeAppTriage() {
  const [query, setQuery] = useState("BankName");
  const [platform, setPlatform] = useState("android");
  const [region, setRegion] = useState("IN");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = (msg) => {
    setLog((l) => [
      `${new Date().toLocaleTimeString()} → ${msg}`,
      ...l.slice(0, 50),
    ]);
  };

  useEffect(() => {
    searchApps();
  }, []);

  async function searchApps() {
    addLog(`Searching for "${query}"`);

    const demo = [
      {
        app_id: 42,
        app_title: "BankName Secure",
        package_name: "com.bankname.update",
      },
      {
        app_id: 43,
        app_title: "Official BankName",
        package_name: "com.bank.official",
      },
    ];

    setCandidates(demo);
    addLog("Search complete");
  }

  async function openCandidate(app) {
    addLog(`Opening ${app.package_name}`);

    setSelected({
      ...app,
      risk_score: 0.92,
      reasons: [
        { signal: "cert_mismatch", score: 1.0 },
        { signal: "icon_similarity", score: 0.96 },
      ],
      evidence_url: "/evidence/sample.png", // place this inside public/evidence/
    });
  }

  return (
    <div className="p-6">
      {/* Search Panel */}
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Fake App Detection Console</h1>
        <div className="divider"></div>

        <div className="flex gap-3">
          <input
            className="panel flex-1"
            style={{ color: "#00ff66" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="hacker-btn" onClick={searchApps}>
            SEARCH
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Candidate List */}
        <div className="col-span-4 panel h-[70vh] overflow-auto">
          <h2 className="neon-text mb-2">Detected Apps</h2>

          {candidates.map((app) => (
            <button
              key={app.app_id}
              className="panel mb-3 w-full text-left hacker-btn"
              onClick={() => openCandidate(app)}
            >
              <div className="neon-text">{app.app_title}</div>
              <div className="text-xs">{app.package_name}</div>
            </button>
          ))}
        </div>

        {/* App Details */}
        <div className="col-span-8 panel h-[70vh] overflow-auto">
          {!selected && (
            <div className="neon-text text-lg opacity-70">
              Select a candidate to investigate
            </div>
          )}

          {selected && (
            <>
              <h2 className="neon-text text-2xl mb-2">{selected.app_title}</h2>
              <div className="text-sm mb-4">{selected.package_name}</div>

              <div className="panel mb-4">
                <div className="neon-text text-lg">
                  Risk Score: {Math.round(selected.risk_score * 100)}%
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

              <a href={selected.evidence_url} className="hacker-btn" download>
                DOWNLOAD EVIDENCE
              </a>
            </>
          )}
        </div>
      </div>

      {/* LOG PANEL */}
      <div className="panel mt-6 h-[150px] overflow-auto text-xs">
        <h3 className="neon-text mb-2">System Log</h3>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
