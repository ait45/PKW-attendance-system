import { connectDB } from "../lib/mongodb.js";
import Student from "../models/Student.js";
import LineupAttendanceModal from "../models/LineupAttendanceModal.js";
import { Calculate_behaviorScore } from "./behaviorScore-deduction.js";
import readConfig from "./readConfig.js";
import { Holiday } from "./Holiday.js";

const now = new Date();

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

export async function cutoff() {
  const settings = await readConfig();
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
  const setting = readConfig();
  const [h, m] = setting.absentThreshold.split(":").map(Number);
  const timeCutoff = new Date();
  timeCutoff.setHours(h, m, 0, 0);
  const now = new Date();

  if (now > timeCutoff) {
    console.log("autoCutoff");
    try {
      await connectDB();
      console.log("start autoCutoff");
      const holiday = Holiday(now);
      if (holiday.isHoliday){
        console.log("is Holiday");
        return;
      }
      const student = await Student.find();
      const checked = await LineupAttendanceModal.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
      if (student.length === checked.length) {
        console.log("autocutoff is excited");
        return;
      }

      const checkedIds = checked.map((s) => s.studentId);

      const toMarkAbsent = student.filter(
        (s) => !checkedIds.includes(s.studentId)
      );

      for (const student of toMarkAbsent) {
        await LineupAttendanceModal.create({
          handler: "system",
          studentId: student.studentId,
          name: student.name,
          classes: student.classes,
          status: "ขาด",
        });
      }
      await Calculate_behaviorScore();
      console.log("autoCutoff successfully..");
    } catch (error) {
      console.error(error);
    }
  }
}

export async function attendanceStart() {
  const setting = readConfig();
  const [h, m] = setting.absentThreshold.split(":").map(Number);
  const timeStart = new Date();
  timeStart.setHours(h, m, 0, 0);
  const now = new Date();
  if (now > timeStart) {
    return true;
  } else {
    return false;
  }
}
