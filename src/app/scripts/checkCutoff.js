import fs from "fs";
import path from "path";
import { connectDB } from "../../../lib/mongodb";
import Student from "../../../models/Student";
import LineupAttendanceModal from "../../../models/LineupAttendanceModal";

const configPath = path.join(process.cwd(), "config", "settings.json");
const now = new Date();

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

export async function cutoff() {
  const data = fs.readFileSync(configPath, "utf-8");
  const settings = JSON.parse(data);
  const [hourLate, minuteLate] = settings.lateThreshold.split(":").map(Number);
  const [hourabsent, minuteabsent] = settings.absentThreshold
    .split(":")
    .map(Number);

  // กำหนดเวลา cutoff ของวันนี้
  const lateTime = new Date();
  lateTime.setHours(hourLate, minuteLate, 0, 0);

  const absentTime = new Date();
  absentTime.setHours(hourabsent, minuteabsent, 0, 0);

  let status = "เข้าร่วมกิจกรรม";
  if (now > absentTime) {
    status = "ขาด";
  } else if (now > lateTime) {
    status = "สาย";
  }
  return status;
}

export async function autoCutoff() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const student = await Student.find();
    const checked = await LineupAttendanceModal.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });
    const checkedIds = checked.map((s) => s.studentId);

    const toMarkAbsent = student.filter(
      (s) => !checkedIds.includes(s.studentId)
    );

    for (const student of toMarkAbsent) {
      await LineupAttendanceModal.create({
        studentId: student.studentId,
        name: student.name,
        classes: student.classes,
        status: "ขาด",
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
}
