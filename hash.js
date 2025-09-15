import crypto from "crypto";

function generateSecret(length = 32) {
  // สร้าง random bytes แล้วแปลงเป็น hex string
  return crypto.randomBytes(length).toString("hex");
}

const accessSecret = generateSecret(32);   // 64 ตัวอักษร hex
const refreshSecret = generateSecret(64);  // 128 ตัวอักษร hex

console.log("ACCESS_SECRET:", accessSecret);
console.log("REFRESH_SECRET:", refreshSecret);
