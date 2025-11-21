export const analyzeURLs = (strings = []) => {
  const urlRegex = /(https?:\/\/[^\s"]+)/gi;
  const urls = strings.flatMap(s => s.match(urlRegex) || []);

  const badTLDs = [".ru", ".top", ".cn", ".cc", ".bid", ".xyz"];
  const suspicious = urls.filter(url =>
    badTLDs.some(tld => url.toLowerCase().includes(tld))
  );

  return {
    urls,
    suspiciousURLs: suspicious,
    suspiciousCount: suspicious.length
  };
};
