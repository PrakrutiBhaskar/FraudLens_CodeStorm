// scoringEngine.js (V2)
// Inputs:
//   meta: parsed APK metadata (package, app_name, permissions, cert_fingerprints, repack, stringScan, ...)
//   official: brand config (brandName, packageName, cert_fingerprint, ...)
//   iconScores: { phash, similarity }
//   modules: { permission, overlay, native, opcode, url, evasion }  // optional
//   opts (optional): tuning weights and thresholds
//
// Returns:
// {
//   score: <0..100>,
//   reasons: [...],
//   breakdown: {sub-scores..., penalties..., rawRisk},
//   explain: { compact diagnostics }
// }

import levenshtein from "js-levenshtein";

const clamp01 = v => Math.max(0, Math.min(1, typeof v === "number" ? v : 0));
const safeStr = s => (s || "").toString();

const DEFAULT_CFG = {
  weights: {
    name: 0.25,
    pkg: 0.25,
    icon: 0.15,
    cert: 0.10,
    permissions: 0.10,
    repack: 0.05,
    strings: 0.05,
    adv: 0.05   // opcode/evasion/url/native aggregated
  },
  penalties: {
    typoPenaltyCap: 0.5,
    certMismatchPenalty: 0.25,
    nativePenaltyPerLib: 0.05,
    stringMatchPenaltyPerHit: 0.005, // many hits -> larger penalty
    opcodePenalty: 0.08,
    urlPenaltyPerSuspicious: 0.05,
    evasionPenaltyPerHit: 0.06
  },
  thresholds: {
    nameSimGood: 0.7,
    pkgSimGood: 0.75,
    iconSimHigh: 0.75
  }
};

// small helper: normalized levenshtein similarity 0..1
function levSim(a = "", b = "") {
  if (!a || !b) return 0;
  try {
    const da = a.toLowerCase();
    const db = b.toLowerCase();
    const d = levenshtein(da, db);
    const maxLen = Math.max(da.length, db.length, 1);
    return clamp01(1 - d / maxLen);
  } catch (e) {
    return 0;
  }
}

// token similarity (lightweight) — split on dots / non-alnum and compare tokens positionally
function tokenSimilarity(a = "", b = "") {
  if (!a || !b) return 0;
  const split = s => s.replace(/([a-z])([A-Z])/g, "$1.$2").split(/[\W_\.]+/).filter(Boolean).map(t => t.toLowerCase());
  const ta = split(a);
  const tb = split(b);
  if (ta.length === 0 || tb.length === 0) return 0;
  const n = Math.max(ta.length, tb.length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const sa = ta[i] || "";
    const sb = tb[i] || "";
    if (!sa && !sb) { sum += 1; continue; }
    if (!sa || !sb) { sum += 0; continue; }
    const sim = levSim(sa, sb);
    sum += sim;
  }
  return clamp01(sum / n);
}

// typosquat heuristic (small penalty)
function simpleTypoPenalty(a = "", b = "") {
  if (!a || !b) return 0;
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const na = norm(a), nb = norm(b);
  if (!na || !nb) return 0;
  if (na === nb) return 0;
  const d = levenshtein(na, nb);
  if (d <= 1) return 0.35;
  if (d <= 2) return 0.18;
  return 0;
}

export const computeRiskScore = (meta = {}, official = {}, iconScores = {}, modules = {}, opts = {}) => {
  const cfg = { ...DEFAULT_CFG, ...(opts || {}) };
  // canonical fields
  const officialName = official.brandName || official.appName || "";
  const officialPkg = official.packageName || official.package || "";

  const candName = safeStr(meta.app_name || meta.label || "");
  const candPkg = safeStr(meta.package || "");

  // --- similarity signals ---
  const nameSim = levSim(candName, officialName);
  const pkgSimToken = tokenSimilarity(candPkg, officialPkg);
  const pkgSimLev = levSim(candPkg, officialPkg);
  // combine token + lev for robust package similarity
  const pkgSim = clamp01(0.6 * pkgSimToken + 0.4 * pkgSimLev);

  const iconSim = (iconScores && typeof iconScores.similarity === "number") ? clamp01(iconScores.similarity) : 0;

  // --- permission risk from module if provided ---
  const permModule = modules.permission || { score: 0, suspicious: [], counts: { high:0, med:0, other:0 } };
  const permRiskScore = clamp01(permModule.score || 0); // 0..1 where 1 = dangerous

  // --- cert mismatch penalty ---
  const officialCert = official.cert_fingerprint || official.cert || null;
  const hasOfficialCert = !!officialCert;
  const certs = Array.isArray(meta.cert_fingerprints) ? meta.cert_fingerprints : (meta.cert_fingerprints ? [meta.cert_fingerprints] : []);
  const certMismatch = hasOfficialCert ? !certs.includes(officialCert) : false;
  const certPenalty = certMismatch ? cfg.penalties.certMismatchPenalty : 0;

  // --- repack signals
  const repack = meta.repack || {};
  const soCount = repack.soCount || 0;
  const sizeAnomaly = repack.sizeAnomalyScore || 0;
  const repackPenalty = Math.min(0.6, (soCount * cfg.penalties.nativePenaltyPerLib) + sizeAnomaly);

  // --- strings / URL / opcode / evasion penalties from modules
  const stringModule = modules.url || { suspiciousCount: 0, suspiciousURLs: [], urls: [] };
  const stringMatches = (meta.stringScan && meta.stringScan.matchCount) ? meta.stringScan.matchCount : 0;
  // tokens matched (stringScan matching may be noisy, scale penalty)
  const stringPenalty = Math.min(0.6, stringMatches * cfg.penalties.stringMatchPenaltyPerHit);

  // advanced modules
  const nativeModule = modules.native || { suspiciousNativeCount: 0, suspiciousNativeLibs: [] };
  const opcodeModule = modules.opcode || { opcodeIndicators: 0, opcodeMatches: [] };
  const urlModule = modules.url || { suspiciousCount: 0, suspiciousURLs: [] };
  const evasionModule = modules.evasion || { evasionCount: 0, evasionStrings: [] };

  const opcodePenalty = Math.min(0.5, opcodeModule.opcodeIndicators * cfg.penalties.opcodePenalty);
  const urlPenalty = Math.min(0.5, (urlModule.suspiciousCount || 0) * cfg.penalties.urlPenaltyPerSuspicious);
  const evasionPenalty = Math.min(0.6, (evasionModule.evasionCount || 0) * cfg.penalties.evasionPenaltyPerHit || 0);

  // typo penalties
  const typoPenaltyName = simpleTypoPenalty(candName, officialName);
  const typoPenaltyPkg = simpleTypoPenalty(candPkg, officialPkg);
  const typoPenalty = Math.min(cfg.penalties.typoPenaltyCap, typoPenaltyName + typoPenaltyPkg);

  // --- combine similarity into similarityScore (higher = more similar)
  const w = cfg.weights;
  const similarityScore = clamp01(
    (w.name * nameSim) +
    (w.pkg * pkgSim) +
    (w.icon * iconSim) +
    (w.cert * (hasOfficialCert ? (certMismatch ? 0 : 1) : 0)) + // if official cert present, reward match
    (w.permissions * (1 - permRiskScore)) +
    (w.repack * (1 - sizeAnomaly)) +
    (w.strings * (stringMatches > 0 ? 0 : 1)) +  // if strings found -> lowers sim
    (w.adv * (1 - Math.min(1, (opcodeModule.opcodeIndicators || 0) * 0.2 + urlModule.suspiciousCount * 0.1 + evasionModule.evasionCount * 0.2)))
  );

  // base risk = invert similarity
  let rawRisk = clamp01(1 - similarityScore);

  // add explicit penalties
  const penaltyTotal = clamp01(certPenalty + repackPenalty + stringPenalty + opcodePenalty + urlPenalty + evasionPenalty + typoPenalty);

  let finalRisk = clamp01(rawRisk + penaltyTotal);

  // scale to 0..100
  const score = Math.round(finalRisk * 100);

  // reasons (human readable)
  const reasons = [];
  if (nameSim < cfg.thresholds.nameSimGood) reasons.push(`Name similarity low (${Math.round(nameSim * 100)}%)`);
  if (pkgSim < cfg.thresholds.pkgSimGood) reasons.push(`Package similarity low (${Math.round(pkgSim * 100)}%)`);
  if (iconSim > cfg.thresholds.iconSimHigh) reasons.push(`Icon highly similar (${Math.round(iconSim * 100)}%)`);
  if (certMismatch) reasons.push("Certificate mismatch");
  if (soCount > 0) reasons.push(`Native libs present (${soCount})`);
  if (stringMatches > 0) reasons.push(`Suspicious strings detected (${stringMatches})`);
  if (urlModule.suspiciousCount > 0) reasons.push(`Suspicious URLs (${urlModule.suspiciousCount})`);
  if (opcodeModule.opcodeIndicators > 0) reasons.push(`Opcode/dex indicators (${opcodeModule.opcodeIndicators})`);
  if (evasionModule.evasionCount > 0) reasons.push(`Evasion indicators (${evasionModule.evasionCount})`);
  if (typoPenalty > 0) reasons.push(`Typo-squat signals`);

  // breakdown for transparency
  const breakdown = {
    nameSim: Number(nameSim.toFixed(3)),
    pkgSim: Number(pkgSim.toFixed(3)),
    iconSim: Number(iconSim.toFixed(3)),
    permRiskScore: Number(permRiskScore.toFixed(3)),
    certMismatch,
    soCount,
    sizeAnomaly: Number(sizeAnomaly.toFixed(3)),
    stringMatches,
    opcodeIndicators: opcodeModule.opcodeIndicators || 0,
    urlSuspiciousCount: urlModule.suspiciousCount || 0,
    evasionCount: evasionModule.evasionCount || 0,
    similarityScore: Number(similarityScore.toFixed(4)),
    rawRisk: Number(rawRisk.toFixed(4)),
    penaltyTotal: Number(penaltyTotal.toFixed(4)),
    finalRisk: Number(finalRisk.toFixed(4))
  };

  const explain = {
    msg: finalRisk < 0.25 ? "Likely legitimate or low risk" :
         finalRisk < 0.6 ? "Suspicious — review manually" : "High risk — candidate impersonator/malware",
    detail: {
      name: { value: candName || "N/A", official: officialName || "N/A", similarity: nameSim },
      package: { value: candPkg || "N/A", official: officialPkg || "N/A", similarity: pkgSim },
      certsFound: certs,
      topSuspiciousURLs: (urlModule.suspiciousURLs || []).slice(0, 5),
      topStrings: (meta.stringScan?.matches || []).slice(0, 10)
    }
  };

  return {
    score,
    reasons,
    breakdown,
    explain
  };
};
