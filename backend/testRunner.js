// testRunner.js — FINAL WORKING VERSION
// ----------------------------------------------------
// Auto-detect newest APK in /uploads and send it to
// POST http://localhost:5001/api/analyze
// ----------------------------------------------------

import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

// ------------- helper: find newest APK -----------------
function getLatestAPK() {
  const folder = "./uploads";

  if (!fs.existsSync(folder)) {
    console.error("❌ uploads folder not found");
    return null;
  }

  const files = fs.readdirSync(folder)
    .filter(f => f.toLowerCase().endsWith(".apk"))
    .map(f => ({
      file: f,
      time: fs.statSync(path.join(folder, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // newest first

  if (files.length === 0) return null;

  return path.join(folder, files[0].file);
}

// ---------------------- main ---------------------------
async function runTest() {
  const APK_PATH = getLatestAPK();

  if (!APK_PATH) {
    console.error("❌ No APKs found in ./uploads. Upload via Postman or UI first.");
    return;
  }

  console.log("📦 Using APK:", APK_PATH);

  // Build multipart form
  const form = new FormData();
  form.append("brand", "phonepe");
  form.append("apk", fs.createReadStream(APK_PATH));

  const URL = "http://localhost:5001/api/analyze";
  console.log("⏳ Sending POST to:", URL);

  try {
    const res = await axios.post(URL, form, {
      headers: form.getHeaders()
    });

    console.log("🟢 ANALYSIS RESULT:");
    console.log(JSON.stringify(res.data, null, 2));

    // If evidence exists
    if (res.data.evidence) {
      console.log("\n📄 Evidence JSON:", "http://localhost:5001" + res.data.evidence.json);
      console.log("🔗 Evidence HTML:", "http://localhost:5001" + res.data.evidence.html);
    }

  } catch (err) {
    console.error("\n❌ ERROR OCCURRED:");

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Body:", err.response.data);
    } else {
      console.log("Message:", err.message);
    }
  }
}

// Run the test
runTest();
