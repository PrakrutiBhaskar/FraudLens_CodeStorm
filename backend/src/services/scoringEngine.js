import levenshtein from "js-levenshtein";

const clamp01 = v => Math.max(0, Math.min(1, v));
const safeStr = s => (s || "").toString();

export const computeRiskScore = (meta, official, icon) => {
  const officialName = official.brandName || "";
  const officialPkg = official.packageName || "";

  const candName = safeStr(meta.app_name || "");
  const candPkg = safeStr(meta.package || "");

  // name similarity
  let nameSim = 0;
  if (candName && officialName) {
    const d = levenshtein(candName.toLowerCase(), officialName.toLowerCase());
    const maxLen = Math.max(candName.length, officialName.length, 1);
    nameSim = clamp01(1 - d / maxLen);
  }

  // package similarity
  let pkgSim = 0;
  if (candPkg && officialPkg) {
    const d = levenshtein(candPkg.toLowerCase(), officialPkg.toLowerCase());
    const maxLen = Math.max(candPkg.length, officialPkg.length, 1);
    pkgSim = clamp01(1 - d / maxLen);
  }

  const iconSim = icon?.similarity ?? 0;

  // certificate mismatch
  const hasOfficialCert = !!official.cert_fingerprint;
  const certMismatch =
    hasOfficialCert && !meta.cert_fingerprints.includes(official.cert_fingerprint);

  const certPenalty = certMismatch ? 0.25 : 0;

  // repack signals
  const repackAnomaly =
    (meta.repack?.soCount > 0 ? 0.2 : 0) +
    (meta.repack?.sizeAnomalyScore || 0);

  // suspicious strings
  const stringPenalty = Math.min(0.25, (meta.stringScan?.matchCount || 0) * 0.05);

  // combine
  const similarityScore =
    0.35 * nameSim +
    0.35 * pkgSim +
    0.30 * iconSim;

  let risk = clamp01((1 - similarityScore) + certPenalty + repackAnomaly + stringPenalty);

  const score = Math.round(risk * 100);

  const reasons = [];

  if (nameSim < 0.7) reasons.push(`Name similarity low (${Math.round(nameSim*100)}%)`);
  if (pkgSim < 0.7)  reasons.push(`Package similarity low (${Math.round(pkgSim*100)}%)`);

  if (certMismatch) reasons.push("Certificate mismatch");
  if (meta.repack?.soCount > 0) reasons.push(`Native libraries present (${meta.repack.soCount})`);
  if (meta.stringScan?.matchCount > 0) reasons.push(`Suspicious strings detected (${meta.stringScan.matchCount})`);

  return {
    score,
    reasons,
    breakdown: {
      nameSim,
      pkgSim,
      iconSim,
      certMismatch,
      repack: meta.repack,
      stringScan: meta.stringScan
    }
  };
};
