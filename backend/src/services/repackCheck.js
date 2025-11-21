// repackCheck.js
import AdmZip from "adm-zip";
import fs from "fs";

/**
 * Detect native libs (.so) and size anomalies.
 */
export const analyzeRepackSignals = (apkPath, baselineSizeBytes = null) => {
  try {
    const zip = new AdmZip(apkPath);
    const entries = zip.getEntries();

    const soList = entries
      .filter(e => e.entryName.startsWith("lib/") && e.entryName.endsWith(".so"))
      .map(e => e.entryName);

    const soCount = soList.length;

    const stats = fs.statSync(apkPath);
    const apkSize = stats.size;

    let sizeAnomalyScore = 0;

    if (baselineSizeBytes && baselineSizeBytes > 0) {
      const ratio = apkSize / baselineSizeBytes;
      const deviation = Math.abs(1 - ratio);
      sizeAnomalyScore = Math.min(1, deviation / 0.5);
    }

    return {
      soCount,
      soList,
      apkSizeBytes: apkSize,
      sizeAnomalyScore
    };
  } catch (err) {
    console.error("repackCheck error:", err.message);
    return { soCount: 0, soList: [], apkSizeBytes: 0, sizeAnomalyScore: 0 };
  }
};
