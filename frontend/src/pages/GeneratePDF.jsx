import jsPDF from "jspdf";
import "../styles/matrix-theme.css";

export default function GeneratePDF() {
  function generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Fraud Detection Evidence Report", 20, 20);
    doc.setFontSize(12);
    doc.text("Generated via FraudLens Frontend", 20, 35);
    doc.save("evidence.pdf");
  }

  return (
    <div className="p-6">
      <div className="panel mb-6">
        <h1 className="neon-text text-3xl mb-4">PDF Evidence Generator</h1>
        <div className="divider"></div>

        <button className="hacker-btn" onClick={generatePDF}>
          DOWNLOAD PDF
        </button>
      </div>
    </div>
  );
}
