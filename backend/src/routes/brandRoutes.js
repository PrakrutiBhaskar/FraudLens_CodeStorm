import express from "express";
import {
  getBrands,
  getBrand,
  createBrand,
  uploadBrandIcon,
  updateBrand,
  removeBrand
} from "../controllers/brandController.js";

const router = express.Router();

router.get("/", getBrands);
router.get("/:brand", getBrand);
router.post("/", createBrand);
router.post("/icon", uploadBrandIcon);
router.put("/:brand", updateBrand);
router.delete("/:brand", removeBrand);

export default router;
