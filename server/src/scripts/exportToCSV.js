import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import Crowd from "../models/Crowd.js";
import Currency from "../models/Currency.js";
import Hotel from "../models/Hotel.js";
import Weather from "../models/Weather.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function toCSV(rows) {
  if (!rows || rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    if (val instanceof Date) return val.toISOString();
    if (Array.isArray(val))
      return val
        .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
        .join(";");
    if (typeof val === "object") return JSON.stringify(val);
    const s = String(val);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const headerLine = headers.join(",");
  const lines = rows.map((row) => headers.map((h) => escape(row[h])).join(","));
  return [headerLine, ...lines].join("\n");
}

async function exportModel(model, filename) {
  const data = await model.find({}).lean();
  const csv = toCSV(data);
  const outDir = path.resolve(__dirname, "../exports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, csv, "utf8");
  console.log(`✅ ${filename} created (${data.length} rows)`);
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  try {
    await exportModel(Weather, "weather.csv");
    await exportModel(Crowd, "crowd.csv");
    await exportModel(Currency, "currency.csv");
    await exportModel(Hotel, "hotels.csv");
    console.log("🎉 Export complete. Files saved to src/exports/");
  } catch (err) {
    console.error("❌ Export failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
