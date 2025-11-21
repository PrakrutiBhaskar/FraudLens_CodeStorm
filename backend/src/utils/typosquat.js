// typosquat.js
import levenshtein from "js-levenshtein";

/*
  tokenSimilarity:
  - break package name into tokens (dots, hyphens, camel case)
  - measure token-wise exact or close matches and average
  - returns score 0..1 (1=identical)
*/

function splitTokens(s) {
  if (!s) return [];
  // split on non-alphanumeric, dots, underscores, and camelCase boundaries
  const byNonAlpha = s.replace(/([a-z])([A-Z])/g, "$1.$2").split(/[\W_\.]+/);
  return byNonAlpha.filter(Boolean).map(t => t.toLowerCase());
}

export const tokenSimilarity = (a = "", b = "") => {
  const ta = splitTokens(a);
  const tb = splitTokens(b);
  if (ta.length === 0 || tb.length === 0) return 0;

  // pair tokens by position where possible, measure lev distance normalized by length
  const n = Math.max(ta.length, tb.length);
  let scoreSum = 0;
  for (let i = 0; i < n; i++) {
    const sa = ta[i] || "";
    const sb = tb[i] || "";
    if (!sa && !sb) { scoreSum += 1; continue; }
    if (!sa || !sb) { scoreSum += 0; continue; }
    const d = levenshtein(sa, sb);
    const maxLen = Math.max(sa.length, sb.length, 1);
    const sim = Math.max(0, 1 - d / maxLen);
    scoreSum += sim;
  }
  return Number((scoreSum / n).toFixed(4));
};

// basic typosquat check against common char-swap patterns and repeated chars
export const simpleTypoPenalty = (a = "", b = "") => {
  if (!a || !b) return 0;
  // Straight prefix/suffix or repeated char differences
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const na = norm(a), nb = norm(b);
  if (na === nb) return 0;
  // small Levenshtein distance on normalized names
  const d = levenshtein(na, nb);
  if (d <= 1) return 0.4; // likely typo
  if (d <= 2) return 0.2;
  return 0;
};
