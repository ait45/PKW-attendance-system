import { Calculate_behaviorScore } from "./behaviorScore-deduction.ts";
import readConfig from "./readConfig.ts";
import { Holiday } from "./Holiday.ts";
import { MariaDBConnection } from "../lib/config.mariaDB.ts";
import type { PoolConnection } from "mariadb";

const now = new Date();

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const StudentTable_ENV: string = process.env.MARIA_DB_TABLE_STUDENTS;

export async function cutoff() {
  const settings = await readConfig();
  const [hourLate, minuteLate]: [number, number] = settings.lateThreshold
    .split(":")
    .map(Number);
  const [hourabsent, minuteabsent]: [number, number] = settings.absentThreshold
    .split(":")
    .map(Number);

  // กำหนดเวลา cutoff ของวันนี้
  const lateTime = new Date();
  lateTime.setHours(hourLate, minuteLate, 0, 0);

  const absentTime = new Date();
  absentTime.setHours(hourabsent, minuteabsent, 0, 0);

  let status: string = "เข้าร่วมกิจกรรม";
  if (now > absentTime) {
    status = "ขาด";
  } else if (now > lateTime) {
    status = "สาย";
  }
  return status;
}

export async function autoCutoff(): Promise<void> {
  const setting = await readConfig();
  const [h, m]: [number, number] = setting.absentThreshold
    .split(":")
    .map(Number);
  const timeCutoff: Date = new Date();
  timeCutoff.setHours(h, m, 0, 0);
  const now = new Date();

  const HANDLER: string = "system";
  const STATUS: string = "ขาด";

  if (now > timeCutoff) {
    console.log("autoCutoff");
    let conn: PoolConnection;
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
      const queryTotalStudent: string = `SELECT STUDENT_ID, NAME, CLASSES FROM ${StudentTable_ENV}`;
      const student = await conn.query(queryTotalStudent);
      const totalStudents: number = student.length;

      const queryCheckedToday: string = `SELECT * FROM attendance_history_pkw WHERE DATE(CREATED_AT) = CURDATE()`;
      const checkedToday = await conn.query(queryCheckedToday);

      const checkedIds = new Set(
        checkedToday.map((s: { STUDENT_ID: string }) => s.STUDENT_ID)
      );

      if (checkedIds.size >= totalStudents) {
        console.log("autocutoff is excited");
        return;
      } else {
        const missing = student.filter(
          (id: { STUDENT_ID: string }) => !checkedIds.has(id.STUDENT_ID)
        );
        if (missing.length === 0)
          return console.log("No missing students for autoCutoff");
        const VerifyData = missing.map(
          (student: { STUDENT_ID: string; NAME: string; CLASSES: string }) => [
            HANDLER,
            student.STUDENT_ID,
            student.NAME,
            student.CLASSES,
            STATUS,
          ]
        );
        const queryInsert = `INSERT INTO attendance_history_pkw (HANDLER, STUDENT_ID, NAME, CLASSES, STATUS) VALUES ?`;
        await conn.batch(queryInsert, [VerifyData]);
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

export async function attendanceStart(): Promise<boolean> {
  const setting = await readConfig();
  const [h, m]: [number, number] = setting.absentThreshold
    .split(":")
    .map(Number);
  const timeStart = new Date();
  timeStart.setHours(h, m, 0, 0);
  const now = new Date();
  if (now > timeStart) {
    return true;
  } else {
    return false;
  }
}
