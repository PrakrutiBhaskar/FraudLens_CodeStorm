export const detectEvasion = (strings = []) => {
  const patterns = [
    "genymotion",
    "qemu",
    "vbox",
    "goldfish",
    "Build.FINGERPRINT",
    "isEmulator",
    "emulator"
  ];

  const hits = strings.filter(s =>
    patterns.some(p => s.toLowerCase().includes(p.toLowerCase()))
  );

  return {
    evasionCount: hits.length,
    evasionStrings: hits
  };
};
