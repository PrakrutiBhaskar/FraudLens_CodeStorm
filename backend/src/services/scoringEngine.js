export const computeRiskScore = (meta, official, icon, modules) => {
  let score = 0;
  let reasons = [];

  // name/package similarity (your existing code)

  if (modules.permission.dangerousCount > 0) {
    score += 25;
    reasons.push("Dangerous permission abuse");
  }

  if (modules.overlay.overlayAbuse) {
    score += 35;
    reasons.push("Overlay phishing capability");
  }

  if (modules.native.suspiciousNativeCount > 0) {
    score += 20;
    reasons.push("Suspicious native libraries found");
  }

  if (modules.opcode.opcodeIndicators > 0) {
    score += 20;
    reasons.push("Malicious opcode patterns detected");
  }

  if (modules.url.suspiciousCount > 0) {
    score += 15;
    reasons.push("Suspicious remote URLs detected");
  }

  if (modules.evasion.evasionCount > 0) {
    score += 25;
    reasons.push("Anti-sandbox / evasion behavior");
  }

  return { score: Math.min(score, 100), reasons };
};
