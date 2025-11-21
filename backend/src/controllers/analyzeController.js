import { parseAPK } from "../services/apkParser.js";
import { compareIcons } from "../services/iconSimilarity.js";
import { computeRiskScore } from "../services/scoringEngine.js";
import { buildEvidenceKit } from "../utils/evidenceGenerator.js";
import { logScan } from "../utils/logger.js";
import { loadBrand } from "../utils/brandLoader.js";

// advanced modules
import { analyzePermissions, detectOverlayAbuse } from "../services/permissionCheck.js";
import { analyzeNativeLibs } from "../services/nativeHeuristics.js";
import { analyzeOpcodes } from "../services/opcodeHeuristics.js";
import { analyzeURLs } from "../services/urlReputation.js";
import { detectEvasion } from "../services/evasionCheck.js";

export const analyzeApp = async (req, res) => {
  try {
    console.log("🔥 analyzeApp HIT with method:", req.method);

    if (!req.files || !req.files.apk) {
      return res.status(400).json({ error: "APK file missing" });
    }

    // Save APK
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

    official.iconPath = `src/brands/${official.officialIcon}`;

    // Compare icons
    const iconScores = await compareIcons(official.iconPath, meta.icon_path);

    // --- ADVANCED MODULES ---
    const permRes = analyzePermissions(meta.permissions, official);
    const overlay = detectOverlayAbuse(meta.permissions);
    const nativeRes = analyzeNativeLibs(meta.repack.soList);
    const opcodeRes = analyzeOpcodes(meta.stringScan.matches.map(m => m.entry));
    const urlRes = analyzeURLs(meta.stringScan.matches.map(m => m.entry));
    const evasionRes = detectEvasion(meta.stringScan.matches.map(m => m.entry));

    const modules = {
      permission: permRes,
      overlay,
      native: nativeRes,
      opcode: opcodeRes,
      url: urlRes,
      evasion: evasionRes
    };

    // Compute final risk
    const { score, reasons } = computeRiskScore(meta, official, iconScores, modules);

    // Build evidence
    const evidence = buildEvidenceKit(meta, official, iconScores, score, reasons);

    // Log scan
    logScan({
      meta,
      official,
      score,
      reasons,
      modules,
      timestamp: new Date().toISOString()
    });

    return res.json({
      meta,
      iconScores,
      modules,
      score,
      reasons,
      evidence
    });

  } catch (err) {
    console.error("AnalyzeController Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
