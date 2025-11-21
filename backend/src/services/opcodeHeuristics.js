export const analyzeOpcodes = (strings = []) => {
  const indicators = [
    "java.lang.reflect",
    "Class.forName",
    "DexClassLoader",
    "loadClass",
    "Method.invoke",
    "invoke",
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
