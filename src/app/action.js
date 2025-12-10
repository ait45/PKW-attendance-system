"use server";

import { MariaDBConnection } from "../../lib/config.mariaDB";
import { revalidatePath } from "next/cache";

export async function addSchedule(formData) {
  const teacherId = formData.get("teacherId");
  const subjectId = formData.get("subjectId");
  const classroomId = formData.get("classroomId");
  const dayOfWeek = formData.get("dayOfWeek");
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");

  if (
    !teacherId ||
    !subjectId ||
    !classroomId ||
    !dayOfWeek ||
    !startTime ||
    !endTime
  ) {
    return { success: false, message: "ข้อมูลไม่ครบถ้วน" };
  }

  try {
  } catch (error) {
    // 2. ดักจับ Error กรณีข้อมูลชนกัน (Duplicate Entry)
    if (error.code === "ER_DUP_ENTRY") {
      const msg = error.sqlMessage || "";

      // เช็คว่าชน constraint ตัวไหน (ดูชื่อ key ที่เราตั้งไว้ใน SQL)
      if (msg.includes("unique_teacher_time")) {
        return { success: false, message: "❌ ครูคนนี้มีสอนเวลานี้แล้ว" };
      }
      if (msg.includes("unique_room_time")) {
        return { success: false, message: "❌ ห้องเรียนนี้มีคนใช้เวลานี้แล้ว" };
      }
      return { success: false, message: "❌ ข้อมูลซ้ำซ้อนในระบบ" };
    }

    console.error(error);
    return { success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" };
  }
}
// ฟังก์ชันดึงข้อมูลสำหรับ Dropdown (เอาไว้ใช้หน้า Frontend)
export async function getMasterData() {
  const [teachers] = await pool.query("SELECT * FROM teachers");
  const [subjects] = await pool.query("SELECT * FROM subjects");
  const [classrooms] = await pool.query("SELECT * FROM classrooms");

  // แปลงข้อมูลเป็น JSON object เพื่อส่งให้ Client Component
  return {
    teachers: JSON.parse(JSON.stringify(teachers)),
    subjects: JSON.parse(JSON.stringify(subjects)),
    classrooms: JSON.parse(JSON.stringify(classrooms)),
  };
}
