import ApkReader from "adbkit-apkreader";
import fs from "fs";
import { extractCertFingerprints } from "./certExtractor.js";
import { analyzeRepackSignals } from "./repackCheck.js";
import { scanStrings } from "./stringscan.js";

export const parseAPK = async (apkPath) => {
  const reader = await ApkReader.open(apkPath);
  const manifest = await reader.readManifest();

  const out = {
    package: manifest.package,
    app_name: manifest.label,
    permissions: manifest.usesPermissions || [],
    icon_path: null,
    cert_fingerprints: [],
    repack: {},
    stringScan: {}
  };

  // extract icon
  try {
    const icon = await reader.readIcon();
    const iconFile = apkPath + ".icon.png";
    fs.writeFileSync(iconFile, icon);
    out.icon_path = iconFile;
  } catch {
    out.icon_path = null;
  }

  // NEW FEATURES
  out.cert_fingerprints = extractCertFingerprints(apkPath);
  out.repack = analyzeRepackSignals(apkPath);
  out.stringScan = scanStrings(apkPath);

  return out;
};
