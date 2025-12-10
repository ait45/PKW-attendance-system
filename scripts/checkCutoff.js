import { Calculate_behaviorScore } from "./behaviorScore-deduction.js";
import readConfig from "./readConfig.js";
import { Holiday } from "./Holiday.js";
import { MariaDBConnection } from "../lib/config.mariaDB.js";
import { MongoDBConnection } from "../lib/config.mongoDB.js";

const now = new Date();

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const StudentTable_ENV = process.env.MARIA_DB_TABLE_STUDENTS;

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
  const setting = await readConfig();
  const [h, m] = setting.absentThreshold.split(":").map(Number);
  const timeCutoff = new Date();
  timeCutoff.setHours(h, m, 0, 0);
  const now = new Date();

  if (now > timeCutoff) {
    console.log("autoCutoff");
    let conn;
    try {
      console.log("start autoCutoff");
      const holiday = Holiday(now);
      if (holiday.isHoliday) {
        console.log("is Holiday");
        return;
      }
      /* The code snippet `const student = await Student.find({}, "studentId");` is querying the
      database to find all documents in the "Student" collection and only returning the "studentId"
      field for each document. */
      //const student = await Student.find();
      //const totalStudents = await Student.countDocuments();
      conn = await MariaDBConnection.getConnection();
      const queryTotalStudent = `SELECT STUDENT_ID, NAME, CLASSES FROM ${StudentTable_ENV}`;
      const student = await conn.query(queryTotalStudent);
      const totalStudents = student.length;
      conn.end();

      const checkedToday = await LineupAttendanceModal.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      const checkedIds = new Set(checkedToday.map((s) => s.STUDENT_ID));
      if (checkedIds.size >= totalStudents) {
        console.log("autocutoff is excited");
        return;
      } else {
        const missing = student.filter((id) => !checkedIds.has(id.STUDENT_ID));
        if (missing.length === 0)
          return console.log("No missing students for autoCutoff");
        await LineupAttendanceModal.insertMany(
          missing.map((id) => ({
            handler: "system",
            studentId: id.studentId,
            name: id.name,
            classes: id.classes,
            status: "ขาด",
          }))
        );
        await Calculate_behaviorScore();
        console.log("autoCutoff successfully..");
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (conn) conn.end();
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
