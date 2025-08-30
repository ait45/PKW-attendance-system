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
  const id = {
    id: 1517,
  };
  const res = await fetch("http://localhost:3000/api/scanAttendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id),
  });
  const data = await res.json();
  console.log(data);
}

// run
main();
