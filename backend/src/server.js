import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import brandRoutes from "./routes/brandRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(fileUpload({
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
}));
app.use("/api/brands", brandRoutes);


// ensure uploads & evidence folders
const UPLOADS = path.join(__dirname, "../uploads");
const EVIDENCE = path.join(__dirname, "../evidence");
fs.mkdirSync(UPLOADS, { recursive: true });
fs.mkdirSync(EVIDENCE, { recursive: true });

app.use("/api/brands", brandRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/scans", scanRoutes);


// static serve evidence for quick download (for demo)
app.use("/evidence", express.static(EVIDENCE));

app.get("/", (req, res) => res.send("FraudLens Backend up"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
