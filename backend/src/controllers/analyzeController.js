import { parseAPK } from "../services/apkParser.js";
import { compareIcons } from "../services/iconSimilarity.js";
import { computeRiskScore } from "../services/scoringEngine.js";
import { buildEvidenceKit } from "../utils/evidenceGenerator.js";
import { logScan } from "../utils/logger.js";
import { loadBrand } from "../utils/brandLoader.js";   // ← MISSING IMPORT FIXED

export const analyzeApp = async (req, res) => {
  try {
    console.log("🔥 analyzeApp HIT with method:", req.method);

    if (!req.files || !req.files.apk) {
      return res.status(400).json({ error: "APK file missing" });
    }

    // Save uploaded APK
    const file = req.files.apk;
    const savePath = "uploads/" + Date.now() + "_" + file.name;
    await file.mv(savePath);

    // Parse APK
    const meta = await parseAPK(savePath);

    // Load brand config
    const brand = req.body.brand || "phonepe";
    const official = loadBrand(brand);

    if (!official) {
      return res.status(400).json({ error: "Brand configuration not found" });
    }

    // Set icon path from config
    official.iconPath = `src/brands/${official.officialIcon}`;

    // Compare icons
    const iconScores = await compareIcons(official.iconPath, meta.icon_path);

    // Score risk
    const { score, reasons } = computeRiskScore(meta, official, iconScores);

    // Build evidence kit
    const evidence = buildEvidenceKit(
      meta,
      official,
      iconScores,
      score,
      reasons
    );

    // Log the scan
    logScan({
      meta,
      official,
      score,
      reasons,
      timestamp: new Date().toISOString()
    });

    return res.json({
      meta,
      iconScores,
      score,
      reasons,
      evidence
    });

  } catch (err) {
    console.error("AnalyzeController Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
