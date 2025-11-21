import fs from "fs";
import path from "path";

const LOG_DIR = path.join("logs");
const LOG_FILE = path.join(LOG_DIR, "scanLog.json");

export const logScan = (entry) => {
  try {
    // Ensure folder exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    // Ensure file exists
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "[]");
    }

    // Read existing logs
    let logs = [];
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
    } catch {
      console.error("⚠ Log file was corrupted. Resetting...");
      logs = [];
    }

    // Append new log
    logs.push(entry);

    // Save back
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

  } catch (err) {
    console.error("🔥 Logger write error:", err);
  }
};
