export const analyzeNativeLibs = (soList = []) => {
  const badPatterns = [
    "substrate",
    "dex",
    "msao",
    "loader",
    "hook",
    "frida",
    "trace",
    "zygote"
  ];

  const suspicious = soList.filter(so =>
    badPatterns.some(pattern => so.toLowerCase().includes(pattern))
  );

  return {
    suspiciousNativeCount: suspicious.length,
    suspiciousNativeLibs: suspicious
  };
};
