import fs from "fs";
import path from "path";

const BRAND_DIR = path.join("src", "brands");

export const listBrands = () => {
  if (!fs.existsSync(BRAND_DIR)) fs.mkdirSync(BRAND_DIR, { recursive: true });

  return fs.readdirSync(BRAND_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(".json", ""));
};

export const loadBrand = (brandName) => {
  const filePath = path.join(BRAND_DIR, `${brandName}.json`);
  if (!fs.existsSync(filePath)) return null;

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

export const saveBrand = (brandName, data) => {
  const filePath = path.join(BRAND_DIR, `${brandName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const deleteBrand = (brandName) => {
  const jsonPath = path.join(BRAND_DIR, `${brandName}.json`);
  const iconPath = path.join(BRAND_DIR, `${brandName}.png`);

  if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
  if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
};
