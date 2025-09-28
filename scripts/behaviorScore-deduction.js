import { connectDB } from "../lib/mongodb.js";
import LineupAttendanceModal from "../models/LineupAttendanceModal.js";
import Student from "../models/Student.js";
import readConfig from "./readConfig.js";

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

// วิธีที่ 1: แปลงเป็นลบโดยตรง
function stringToNegative(str) {
  const num = parseFloat(str);
  return isNaN(num) ? 0 : -Math.abs(num);
}
export async function Calculate_behaviorScore() {
  try {
    await connectDB();
    console.log("start deduction score");
    const setting = await readConfig();
    const data_Attendance_Today_raw = await LineupAttendanceModal.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    if (!data_Attendance_Today_raw) {
      console.log("data Attendance today is excited");
    }
    const data_Attendance_Today = data_Attendance_Today_raw.map((index) => ({
      studentId: index.studentId,
      status: index.status,
    }));
    for (const index of data_Attendance_Today) {
      const { studentId, status } = index;

      switch (status) {
        case "มา":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            { $inc: { comeDays: 1 } },
            { new: true }
          );
          console.log("successfully to process");
          break;
        case "สาย":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                lateDays: 1,
                behaviorScore: stringToNegative(setting.lateThreshold),
              },
            },
            { new: true }
          );
          console.log("successfully to process");
          break;
        case "ลา":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            { $inc: { leaveDays: 1 } },
            { new: true }
          );
          console.log("successfully to process");
          break;
        case "ขาด":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                absentDays: 1,
                behaviorScore: stringToNegative(setting.absentThreshold),
              },
            },
            { new: true }
          );
          console.log("successfully to process");
          break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
