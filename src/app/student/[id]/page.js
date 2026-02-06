import Student from "./student";

export const metadata = {
  title: "หน้าหลัก",
  description: "หน้าแสดงข้อมูลของนักเรียน",
};
export default function student() {
  return <Student />;
}
