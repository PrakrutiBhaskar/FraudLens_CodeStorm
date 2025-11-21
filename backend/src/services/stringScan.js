// stringScan.js
import AdmZip from "adm-zip";

/**
 * Scan dex/resources for suspicious strings.
 */
const SUSPICIOUS = [
  "upi", "upi://", "paytm", "phonepe", "googleplay",
  "password", "passwd", "account",
  "http://", "https://", ".php",
  "decrypt", "private_key", "api_key"
];

export const scanStrings = (apkPath) => {
  try {
    const zip = new AdmZip(apkPath);
    const entries = zip.getEntries();

    const dexEntries = entries.filter(e =>
      e.entryName.endsWith(".dex") ||
      e.entryName.endsWith(".arsc") ||
      e.entryName.endsWith(".xml")
    );

    const matches = [];

    for (const e of dexEntries) {
      const buf = e.getData();
      if (!buf) continue;

      const text = buf.toString("utf8", 0, Math.min(buf.length, 200000));

      for (const token of SUSPICIOUS) {
        if (text.toLowerCase().includes(token)) {
          matches.push({ token, entry: e.entryName });
        }
      }
    }

    return { matchCount: matches.length, matches };
  } catch (err) {
    console.error("stringScan error:", err.message);
    return { matchCount: 0, matches: [] };
  }
};
