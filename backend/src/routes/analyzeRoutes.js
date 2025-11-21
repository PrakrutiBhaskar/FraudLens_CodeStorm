import express from "express";
import { analyzeApp } from "../controllers/analyzeController.js";


const router = express.Router();

router.post("/", analyzeApp);
router.post("/analyze", analyzeApp);

export default router;
