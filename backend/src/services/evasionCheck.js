export const detectEvasion = (strings = []) => {
  const patterns = [
    "genymotion",
    "qemu",
    "vbox",
    "goldfish",
    "isEmulator",
    "emulator",
    "Build.FINGERPRINT"
  ];

  const hits = strings.filter(s =>
    patterns.some(p => s.toLowerCase().includes(p.toLowerCase()))
  );

  return {
    evasionCount: hits.length,
    evasionStrings: hits
  };
};
