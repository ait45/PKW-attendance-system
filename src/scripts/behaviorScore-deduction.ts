import { MariaDBConnection } from "../lib/config.mariaDB.ts";
import type { PoolConnection } from "mariadb";
import readConfig from "./readConfig.ts";

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const attendance_Table: string = process.env.MARIA_DB_TABLE_ATTENDANCE;
const data_student_Table: string = process.env.MARIA_DB_TABLE_STUDENT;

// ฟังก์ชั่นคำนวณคะแนนความประพฤติหลังจาก cutoff
export async function Calculate_behaviorScore(): Promise<void> {
  let conn: PoolConnection;
  try {
    conn = await MariaDBConnection.getConnection();
    console.log("start deduction score");
    const setting = await readConfig();
    const query_attendance_Today = `SELECT STUDENT_ID, STATUS FROM ${attendance_Table} WHERE DATE(CREATED_AT) = CURDATE()`;
    const data_Attendance_Today = await conn.query(query_attendance_Today);
    if (!data_Attendance_Today) {
      console.log("data Attendance today is excited");
    }
    for (const index of data_Attendance_Today) {
      const { STUDENT_ID, STATUS } = index;

      let diffComeDays = 0;
      let diffLeaveDays = 0;
      let diffLateDays = 0;
      let diffAbsentDays = 0;
      let diffBehaviorScore = 0;

      // แปลงค่าคะแนนจาก Setting ให้เป็นตัวเลข (เผื่อเป็น string มา)
      const scoreDeductLate = Number(setting.Scorededucted_lateAttendance || 0);
      const scoreDeductAbsent = Number(
        setting.Scorededucted_absentAttendance || 0
      );

      // ---------------------------------------------------------
      // 2. จัดการ "สถานะเก่า" (state) -> คือการถอนค่าเดิมออก (Revert)
      // ---------------------------------------------------------
      // สังเกต: ฝั่ง Revert ถ้าเป็นคะแนนต้อง "บวกคืน" (+)
      switch (STATUS) {
        case "เข้าร่วมกิจกรรม":
          diffComeDays -= 1; // ลบออกจากวันมา
          break;
        case "ลา":
          diffLeaveDays -= 1;
          break;
        case "สาย":
          diffLateDays -= 1;
          diffBehaviorScore += scoreDeductLate; // คืนคะแนนกลับไป
          break;
        case "ขาด":
          diffAbsentDays -= 1;
          diffBehaviorScore += scoreDeductAbsent; // คืนคะแนนกลับไป
          break;
      }

      // ---------------------------------------------------------
      // 3. จัดการ "สถานะใหม่" (status) -> คือการใส่ค่าใหม่เข้าไป (Apply)
      // ---------------------------------------------------------
      // สังเกต: ฝั่ง Apply ถ้าเป็นคะแนนต้อง "ลบออก" (-)
      switch (STATUS) {
        case "เข้าร่วมกิจกรรม":
          diffComeDays += 1; // บวกเพิ่มวันมา
          break;
        case "ลา":
          diffLeaveDays += 1;
          break;
        case "สาย":
          diffLateDays += 1;
          diffBehaviorScore -= scoreDeductLate; // หักคะแนน
          break;
        case "ขาด":
          diffAbsentDays += 1;
          diffBehaviorScore -= scoreDeductAbsent; // หักคะแนน
          break;
      }

      // ---------------------------------------------------------
      // 4. ยิง SQL UPDATE เพียงครั้งเดียว (Atomic & Fast)
      // ---------------------------------------------------------
      const sql = `
  UPDATE ${data_student_Table} 
  SET 
    JOIN_DAYS = JOIN_DAYS + ?,
    LEAVE_DAYS = LEAVE_DAYS + ?,
    LATE_DAYS = LATE_DAYS + ?,
    ABSENT_DAYS = ABSENT_DAYS + ?,
    BEHAVIOR_SCORE = BEHAVIOR_SCORE + ?
  WHERE STUDENT_ID = ?
`;

      const values = [
        diffComeDays,
        diffLeaveDays,
        diffLateDays,
        diffAbsentDays,
        diffBehaviorScore,
        STUDENT_ID,
      ];

      // สั่งทำงาน (สมมติว่าใช้ mysql2/mariadb pool)
      await conn.execute(sql, values);
      console.log("Calculate successfully...");
    }
  } catch (error) {
    console.error(error);
  }
}

// ฟังก์ชั่นคำนวณคะแนนความประพฤติหลังจากอัพเดตข้อมูล

export async function update_behaviorScore(
  list: Array<{
    update: boolean;
    _id: string;
    studentId: string;
    name: string;
    classes: string;
    status: string;
  }>
): Promise<void> {
  let conn: PoolConnection;
  try {
    console.log("start updata_begaviorScore");
    conn = await MariaDBConnection.getConnection();
    const setting = await readConfig();
    const HANDLER: string = "Teacher";
    for (const item of list) {
      const { update, studentId, status } = item;
      if (!update) {
        const query: string = `INSERT INTO ${process.env.MARIA_DB_TABLE_ATTENDANCE} (HANDLER, STUDENT_ID, NAME, CLASSES, STATUS) SELECT ?, STUDENT_ID, NAME, CLASSES, ? FROM ${process.env.MARIA_DB_TABLE_STUDENTS} WHERE STUDENT_ID = ?`;
        await conn.execute(query, [HANDLER, status, studentId]);
      }

      const queryData_old: string = `SELECT STUDENT_ID, STATUS FROM ${attendance_Table} WHERE STUDENT_ID = ?`;
      const old_data_attendance = conn.execute(queryData_old, [studentId]);
      if (!old_data_attendance) return;
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
