export const analyzeOpcodes = (strings = []) => {
  const indicators = [
    "java.lang.reflect",
    "Class.forName",
    "dalvik.system.DexClassLoader",
    "loadClass",
    "invoke",
    "Method.invoke",
    "HiddenApi"
  ];

  const matches = strings.filter(s =>
    indicators.some(ind => s.toLowerCase().includes(ind.toLowerCase()))
  );

  return {
    opcodeIndicators: matches.length,
    opcodeMatches: matches
  };
};
