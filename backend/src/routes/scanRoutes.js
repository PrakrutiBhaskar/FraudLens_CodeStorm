import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const LOG_FILE = path.join("logs", "scanLog.json");

// GET all scan logs
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.json([]);
    }

    const raw = fs.readFileSync(LOG_FILE, "utf8");
    const logs = raw.trim() ? JSON.parse(raw) : [];

    res.json(logs);
  } catch (err) {
    console.error("Error loading scans:", err);
    res.status(500).json([]);
  }
});

export default router;
