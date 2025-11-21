import fs from "fs";
import path from "path";

export const buildEvidenceKit = (meta, official, icon, score, reasons) => {
  // Ensure evidence directory exists
  const evidenceDir = "evidence";
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  // Ensure package name is safe
  const pkg = meta.package || "unknown_app";

  const id = `${pkg}_${Date.now()}`;
  const jsonPath = `${evidenceDir}/${id}.json`;
  const htmlPath = `${evidenceDir}/${id}.html`;

  // Create evidence object safely
  const evidence = {
    meta,
    official,
    icon,
    score,
    reasons,
    generated_at: new Date().toISOString()
  };

  try {
    // Write JSON safely
    fs.writeFileSync(jsonPath, JSON.stringify(evidence, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing JSON evidence:", err);
  }

  // Build HTML output safely (avoid undefined errors)
  const html = `
    <html>
      <body>
        <h1>FraudLens Evidence Kit</h1>
        <p><b>App:</b> ${meta.app_name || "N/A"}</p>
        <p><b>Package:</b> ${pkg}</p>
        <p><b>Score:</b> ${score}</p>
        <p><b>Reasons:</b> ${(reasons || []).join(", ")}</p>
        <p><b>PHASH Distance:</b> ${icon?.phash ?? "N/A"}</p>
        <p><b>Icon Similarity:</b> ${icon?.similarity ?? "0"}</p>
        <p><b>Evidence JSON:</b> ${jsonPath}</p>
      </body>
    </html>
  `;

  try {
    fs.writeFileSync(htmlPath, html, "utf8");
  } catch (err) {
    console.error("Error writing HTML evidence:", err);
  }

  return { json: "/" + jsonPath, html: "/" + htmlPath };
};
