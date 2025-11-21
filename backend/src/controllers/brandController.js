import fs from "fs";
import path from "path";
import { listBrands, loadBrand, saveBrand, deleteBrand } from "../utils/brandLoader.js";

export const getBrands = (req, res) => {
  const brands = listBrands();
  return res.json({ success: true, brands });
};

export const getBrand = (req, res) => {
  const { brand } = req.params;
  const data = loadBrand(brand);

  if (!data) return res.status(404).json({ success: false, error: "Brand not found" });

  return res.json({ success: true, data });
};

export const createBrand = (req, res) => {
  const { brandName, packageName } = req.body;

  if (!brandName || !packageName) {
    return res.status(400).json({ success: false, error: "brandName and packageName required" });
  }

  const brandFile = path.join("src", "brands", `${brandName}.json`);
  if (fs.existsSync(brandFile)) {
    return res.status(400).json({ success: false, error: "Brand already exists" });
  }

  saveBrand(brandName, {
    brandName,
    packageName,
    officialIcon: `${brandName}.png`
  });

  return res.json({ success: true, message: "Brand created" });
};

export const uploadBrandIcon = async (req, res) => {
  const { brand } = req.body;

  if (!req.files || !req.files.icon) {
    return res.status(400).json({ error: "No icon uploaded" });
  }

  if (!brand) {
    return res.status(400).json({ error: "Brand name is required" });
  }

  const iconFile = req.files.icon;
  const savePath = path.join("src", "brands", `${brand}.png`);

  await iconFile.mv(savePath);

  return res.json({ success: true, message: "Icon uploaded" });
};

export const updateBrand = (req, res) => {
  const { brand } = req.params;
  const existing = loadBrand(brand);

  if (!existing) return res.status(404).json({ success: false, error: "Brand not found" });

  const updated = { ...existing, ...req.body };

  saveBrand(brand, updated);

  return res.json({ success: true, message: "Brand updated", updated });
};

export const removeBrand = (req, res) => {
  const { brand } = req.params;

  deleteBrand(brand);

  return res.json({ success: true, message: "Brand removed" });
};
