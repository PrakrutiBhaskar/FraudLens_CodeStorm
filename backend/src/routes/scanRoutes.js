import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  const file = path.join(process.cwd(), "logs", "scans.json");

  if (!fs.existsSync(file)) return res.json({ scans: [] });

  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw || "[]");

  const q = req.query.q?.toLowerCase();
  const filtered = q
    ? data.filter((x) =>
        (x.meta?.package || "").toLowerCase().includes(q) ||
        (x.meta?.app_name || "").toLowerCase().includes(q)
      )
    : data;

  res.json({ scans: filtered });
});

export default router;
