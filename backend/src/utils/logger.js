import fs from "fs";

const LOG_FILE = "logs/scanLog.json";

export const logScan = (entry) => {
  // Ensure logs directory exists
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
  }

  // Ensure log file exists and contains valid JSON
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "[]", "utf8");
  }

  let logs = [];

  try {
    const raw = fs.readFileSync(LOG_FILE, "utf8").trim();
    logs = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("⚠ logScan: Log file corrupted. Resetting log.");
    logs = [];
  }

  logs.push(entry);

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf8");
};
