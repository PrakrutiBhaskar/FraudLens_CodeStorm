// permissionRisk.js
// Score permissions by risk categories. Returns { score: 0..1, suspicious: [perm,...], details: {counts...} }

const HIGH_RISK = [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.RECEIVE_SMS",
  "android.permission.READ_SMS",
  "android.permission.SEND_SMS",
  "android.permission.READ_CALL_LOG",
  "android.permission.WRITE_CALL_LOG",
  "android.permission.PROCESS_OUTGOING_CALLS",
  "android.permission.READ_CONTACTS",
  "android.permission.WRITE_CONTACTS",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.RECORD_AUDIO",
  "android.permission.CAMERA",
  "android.permission.REQUEST_INSTALL_PACKAGES",
  "android.permission.USE_SIP",
  "android.permission.FOREGROUND_SERVICE", // suspicious in some contexts
];

const MEDIUM_RISK = [
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.GET_ACCOUNTS",
  "android.permission.GET_TASKS"
];

export const assessPermissions = (permList) => {
  // permList may be array of strings OR array of objects {name: "..."}
  const names = (permList || []).map(p => (typeof p === "string") ? p : (p.name || "")).filter(Boolean);

  let high = [];
  let med = [];
  let otherCount = 0;

  for (const p of names) {
    if (HIGH_RISK.includes(p)) high.push(p);
    else if (MEDIUM_RISK.includes(p)) med.push(p);
    else otherCount++;
  }

  // compute score: weight heavily on high-risk perms
  const score = Math.min(1, (high.length * 0.6) + (med.length * 0.25) + (otherCount * 0.02));

  return {
    score: Number(score.toFixed(3)),
    suspicious: [...high, ...med],
    counts: { high: high.length, med: med.length, other: otherCount },
    names
  };
};
