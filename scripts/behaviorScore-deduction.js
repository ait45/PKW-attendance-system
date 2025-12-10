import { MongoDBConnection } from "../lib/config.mongoDB.js";
import LineupAttendanceModal from "../models/LineupAttendanceModal.js";
import Student from "../models/Mongo.model.Student.js";
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
// ฟังก์ชั่นคำนวณคะแนนความประพฤติหลังจาก cutoff
export async function Calculate_behaviorScore() {
  try {
    await MongoDBConnection();
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
        case "เข้าร่วมกิจกรรม":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            { $inc: { comeDays: 1 } },
            { new: true }
          );
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
          break;
        case "ลา":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            { $inc: { leaveDays: 1 } },
            { new: true }
          );
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
          break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// ฟังก์ชั่นคำนวณคะแนนความประพฤติหลังจากอัพเดตข้อมูล

export async function update_behaviorScore(list) {
  try {
    console.log("start updata_begaviorScore");
    await MongoDBConnection();
    const setting = await readConfig();

    for (const item of list) {
      const { update, _id, studentId, status } = item;
      if (!update) {
        const { studentId, name, classes, status } = item;
        return await LineupAttendanceModal.create({
          handler: "Teacher",
          studentId,
          name,
          classes,
          status: status,
        });
      }
      const old_data_attendance = await LineupAttendanceModal.findById(_id);

      if (!old_data_attendance) return;
      const state = old_data_attendance.status;

      await LineupAttendanceModal.findByIdAndUpdate(
        _id,
        {
          status: status,
        },
        {
          new: true,
        }
      );

      switch (state) {
        case "เข้าร่วมกิจกรรม":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            { $inc: { comeDays: -1 } },
            { new: true }
          );
          break;
        case "ลา":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                leaveDays: -1,
              },
            },
            { new: true }
          );
          break;
        case "สาย":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                lateDays: -1,
                behaviorScore: setting.Scorededucted_lateAttendance,
              },
            },
            { new: true }
          );
          break;
        case "ขาด":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                absentDays: -1,
                behaviorScore: setting.Scorededucted_absentAttendance,
              },
            },
            { new: true }
          );
          break;
      }
      switch (status) {
        case "เข้าร่วมกิจกรรม":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                comeDays: 1,
              },
            },
            { new: true }
          );
          break;
        case "ลา":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $nc: {
                leaveDays: 1,
              },
            },
            { new: true }
          );
          break;
        case "สาย":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                lateDays: 1,
                behaviorScore: stringToNegative(
                  setting.Scorededucted_lateAttendance
                ),
              },
            },
            { new: true }
          );
          break;
        case "ขาด":
          await Student.findOneAndUpdate(
            { studentId: studentId },
            {
              $inc: {
                absentDays: 1,
                behaviorScore: stringToNegative(
                  setting.Scorededucted_absentAttendance
                ),
              },
            },
            { new: true }
          );
          break;
      }
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
