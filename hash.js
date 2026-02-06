import fs from "fs";
import path from "path";

// ---- CONFIG ----
// ชื่อไฟล์ฟอนต์ต้นฉบับ
const fontFile = "Sarabun-Medium.ttf";

// โฟลเดอร์ที่เก็บฟอนต์
const fontsDir = path.join(process.cwd(), "public", "fonts");

// path เต็มของไฟล์
const fontPath = path.join(fontsDir, fontFile);

// ชื่อไฟล์ output base64
const outputFile = path.join(fontsDir, fontFile.replace(".ttf", ".base64.txt"));

// ---- อ่านไฟล์และแปลงเป็น base64 ----
if (!fs.existsSync(fontPath)) {
  console.error("❌ ไม่พบไฟล์ฟอนต์:", fontPath);
  process.exit(1);
}

const fontBuffer = fs.readFileSync(fontPath);
const fontBase64 = fontBuffer.toString("base64");

// ---- เขียนไฟล์ base64 ----
fs.writeFileSync(outputFile, fontBase64);

console.log("✅ สร้างไฟล์ base64 เรียบร้อย:", outputFile);
