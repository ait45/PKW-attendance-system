// hash.js
import bcrypt from "bcrypt";

const password = "1234567890123"; // รหัสผ่านที่ต้องการ hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log("Hash:", hash);
});
