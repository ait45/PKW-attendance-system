// testFindAll.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// สร้าง Schema ให้ตรงกับที่คุณมี
const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: String,
    password: String,
    role: String
  },
  { collection: "ClientDB", timestamps: true }
);

const User = mongoose.model("users", userSchema);

// main function
async function main() {
  const password = "1234567890123";
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

// run
main();
