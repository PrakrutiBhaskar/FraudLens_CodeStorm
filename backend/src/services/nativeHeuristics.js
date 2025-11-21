// nativeHeuristics.js
// Detect suspicious native libraries inside APKs

export const analyzeNativeLibs = (soList = []) => {
  const badPatterns = [
    "substrate",   // hooking
    "dex",         // loaders
    "msao",        // malware signatures
    "loader",      // packers
    "hook",        // frida/hooking
    "frida",       // dynamic instrumentation
    "trace",       // anti-tracing bypass
    "zygote"       // zygote injection
  ];

  const suspicious = soList.filter(so =>
    badPatterns.some(pattern => so.toLowerCase().includes(pattern))
  );

  return {
    suspiciousNativeCount: suspicious.length,
    suspiciousNativeLibs: suspicious
  };
};
