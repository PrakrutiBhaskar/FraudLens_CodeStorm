import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "../styles/matrix-theme.css";

export default function GeneratePDF() {
  const [latest, setLatest] = useState(null);

  async function fetchLatest() {
    const res = await axios.get("http://localhost:5001/api/scans");
    const scans = res.data.scans || [];
    if (scans.length === 0) return null;
    const newest = scans[scans.length - 1];
    setLatest(newest);
    return newest;
  }

  async function generatePDF() {
    const data = latest || (await fetchLatest());
    if (!data) return alert("No scan data available");

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("FraudLens Evidence Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`App Name: ${data.meta.app_name}`, 20, 40);
    doc.text(`Package: ${data.meta.package}`, 20, 50);

    doc.text(`Risk Score: ${data.score}%`, 20, 65);

    doc.setFontSize(12);
    doc.text("Reasons:", 20, 80);

    let y = 90;
    data.reasons.forEach((r) => {
      doc.text(`• ${r}`, 25, y);
      y += 8;
    });

    doc.text("Evidence Files:", 20, y + 10);
    doc.text(`JSON: ${data.evidence.json}`, 25, y + 20);
    doc.text(`HTML: ${data.evidence.html}`, 25, y + 30);

    doc.save(`Evidence_${data.meta.package}.pdf`);
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">Generate Evidence PDF</h1>
        <div className="divider"></div>

        <button className="hacker-btn" onClick={generatePDF}>
          DOWNLOAD REPORT
        </button>
      </div>
    </div>
  );
}
