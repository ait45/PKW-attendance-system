// testFindAll.js
import mongoose from "mongoose";

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
  try {
    // ✅ เชื่อมต่อ MongoDB (เปลี่ยน mydb เป็นชื่อ DB ของคุณ)
    await mongoose.connect("mongodb://127.0.0.1:27017/PkwservicesDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // ✅ ดึงข้อมูลทั้งหมด
    const users = await User.find({});
    console.log("📌 Users in DB:", users);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

// run
main();
