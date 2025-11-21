import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ Correct Import
import "../styles/matrix-theme.css";

export default function GeneratePDF() {
  const [loading, setLoading] = useState(false);
  const API = "http://localhost:5001";

  async function generatePDF() {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/scans`);
      const scans = res.data;

      if (!scans.length) {
        alert("No scans available.");
        return;
      }

      const latest = scans[0]; 
      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.text("FraudLens Security Analysis Report", 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

      // App Info
      doc.setFontSize(16);
      doc.text("App Metadata:", 20, 45);

      doc.setFontSize(12);
      doc.text(`Package: ${latest.meta?.package || "N/A"}`, 20, 55);
      doc.text(`Risk Score: ${latest.score}%`, 20, 65);

      // Permissions table
      if (latest.meta.permissions?.length) {
        doc.text("Permissions:", 20, 80);
        autoTable(doc, {
          startY: 85,
          head: [["Permission Name"]],
          body: latest.meta.permissions.map(p => [p.name || p]),
        });
      }

      // Reasons table
      if (latest.reasons?.length) {
        const finalY = doc.lastAutoTable?.finalY || 100;

        doc.text("Risk Reasons:", 20, finalY + 10);

        autoTable(doc, {
          startY: finalY + 15,
          head: [["Reason"]],
          body: latest.reasons.map(r => [r]),
        });
      }

      // Certificate fingerprints
      const nextY = doc.lastAutoTable?.finalY || 150;

      doc.text("Certificate Fingerprints:", 20, nextY + 10);

      (latest.meta?.cert_fingerprints || []).forEach((fp, i) => {
        doc.text(`• ${fp}`, 25, nextY + 20 + i * 7);
      });

      // Icon similarity
      doc.text(
        `Icon Similarity: ${latest.iconScores?.similarity || 0}%`,
        20,
        nextY + 50
      );

      // Footer
      doc.setFontSize(10);
      doc.text(
        "Powered by FraudLens — Anti-Fraud Intelligence Engine",
        20,
        285
      );

      doc.save("FraudLens_Report.pdf");

    } catch (err) {
      console.error(err);
      alert("PDF generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">PDF Evidence Generator</h1>
        <div className="divider"></div>

        <button className="hacker-btn" onClick={generatePDF} disabled={loading}>
          {loading ? "GENERATING..." : "DOWNLOAD FULL REPORT"}
        </button>
      </div>
    </div>
  );
}
