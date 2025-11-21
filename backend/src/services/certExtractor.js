// certExtractor.js
import AdmZip from "adm-zip";
import crypto from "crypto";

/**
 * Extract certificate files from META-INF and return SHA256 fingerprints.
 */
export const extractCertFingerprints = (apkPath) => {
  try {
    const zip = new AdmZip(apkPath);
    const entries = zip.getEntries();

    const certEntries = entries.filter(e => {
      const name = e.entryName.toUpperCase();
      return (
        name.startsWith("META-INF/") &&
        (name.endsWith(".RSA") ||
         name.endsWith(".DSA") ||
         name.endsWith(".EC")  ||
         name.endsWith(".CER"))
      );
    });

    const fingerprints = [];

    for (const e of certEntries) {
      const buf = e.getData();
      if (!buf || !buf.length) continue;
      const sha = crypto.createHash("sha256").update(buf).digest("hex");
      fingerprints.push(sha);
    }

    return Array.from(new Set(fingerprints));
  } catch (err) {
    console.error("certExtractor error:", err.message);
    return [];
  }
};
