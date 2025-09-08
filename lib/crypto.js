// lib/crypto.js
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
// อ่าน key จาก env (ต้องเป็น 32 bytes)
const KEY_HEX = process.env.ENCRYPTION_KEY_HEX; // เช่น generate ด้วย: openssl rand -hex 32
if (!KEY_HEX) throw new Error("ENCRYPTION_KEY_HEX is not set");
const KEY = Buffer.from(KEY_HEX, "hex");

// คืนค่า string แบบ: iv:ciphertext:tag (แต่เป็น hex)
export function encrypt(plainText) {
  const iv = crypto.randomBytes(12); // 12 bytes แนะนำสำหรับ GCM
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${encrypted.toString("hex")}:${tag.toString("hex")}`;
}

export function decrypt(enc) {
  if (!enc) return null;
  const [ivHex, ctHex, tagHex] = enc.split(":");
  if (!ivHex || !ctHex || !tagHex) return null;
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(ctHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
