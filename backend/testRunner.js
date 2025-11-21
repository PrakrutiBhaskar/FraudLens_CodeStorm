import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

// auto-detect newest apk
function getLatestAPK() {
  const folder = "./uploads";
  const files = fs.readdirSync(folder)
    .filter(f => f.toLowerCase().endsWith(".apk"))
    .map(f => ({
      file: f,
      time: fs.statSync(path.join(folder, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) return null;

  return path.join(folder, files[0].file);
}

async function runTest() {
  const APK_PATH = getLatestAPK();

  if (!APK_PATH) {
    console.error("❌ No APKs found in ./uploads");
    return;
  }

  console.log("📦 Using APK:", APK_PATH);

  const form = new FormData();
  form.append("brand", "phonepe");
  form.append("apk", fs.createReadStream(APK_PATH));

  console.log("⏳ Sending POST /api/analyze ...");

  try {
    const res = await axios.post(
      "http://localhost:5001/api/analyze",
      form,
      { headers: form.getHeaders() }
    );

    console.log("🟢 Response:");
    console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.error("❌ Error:");
    if (err.response) {
      console.log(err.response.status, err.response.data);
    } else {
      console.log(err.message);
    }
  }
}

runTest();
