import React, { useState } from "react";
import { Plus, FileUser } from "lucide-react";

function StudentManagement() {
  const classes = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  const [citizenId, setCitizenId] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    password: citizenId,
    name: "",
    Class: "",
    phone: phone,
    parentPhone: parentPhone,
    address: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  // ฟังก์ชัน format เลขบัตร 13 หลัก (x-xxxx-xxxxx-xx-x)
  const formatCitizenId = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13); // เอาเฉพาะ "เลขจริง" 13 หลัก
    let result = "";
    if (digits.length > 0) result = digits.slice(0, 1);
    if (digits.length > 1) result += "-" + digits.slice(1, 5);
    if (digits.length > 5) result += "-" + digits.slice(5, 10);
    if (digits.length > 10) result += "-" + digits.slice(10, 12);
    if (digits.length > 12) result += "-" + digits.slice(12, 13);
    return result;
  };
  // ฟังก์ชัน format เบอร์โทร (xxx-xxx-xxxx)
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10); // 10 หลักจริง
    let result = "";
    if (digits.length > 0) result = digits.slice(0, 3);
    if (digits.length > 3) result += "-" + digits.slice(3, 6);
    if (digits.length > 6) result += "-" + digits.slice(6, 10);
    return result;
  };

  return (
    // หน้าจัดการนักเรียน
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FileUser className="text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            จัดการข้อมูลนักเรียน
          </h2>
        </div>
        {/* ฟอร์มเพิ่มนักเรียน */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">เพิ่มนักเรียนใหม่</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
            id="studentId"
              type="number"
              placeholder="รหัสนักเรียน"
              value={newStudent.studentId}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="pinId" className="text-sm text-gray-500 ml-2 mb-[-5%]">เลขบัตรประชาชนนักเรียน</label>
            <input
            id="pinId"
              type="text"
              value={citizenId}
              maxLength={17}
              onChange={(e) => setCitizenId(formatCitizenId(e.target.value))}
              placeholder="x-xxxx-xxxxx-xx-x"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              name="name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="class"
            >
              <option value="">เลือกห้องเรียน</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-15 mt-2">
              <label htmlFor="phoneId" className="text-sm text-gray-500 ml-2 mb-[-5%]">เบอร์โทรนักเรียน</label>
              <input
              id="phoneId"
                type="tel"
                value={phone}
                maxLength={12}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="xxx-xxx-xxxx"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="parentPhoneId" className="text-sm text-gray-500 ml-2 mb-[-5%]">เบอร์โทรผู้ปกครอง</label>
              <input
              id="parentPhoneId"
                type="tel"
                value={parentPhone}
                maxLength={12}
                placeholder="xxx-xxx-xxxx"
                onChange={(e) => setParentPhone(formatPhone(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="ที่อยู่"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="address"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
              <Plus size={20} />
              เพิ่มนักเรียน
            </button>
          </div>
          {/* ตารางนักเรียน */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">รหัสนักเรียน</th>
                  <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 text-left">ห้องเรียน</th>
                  <th className="px-4 py-3 text-left">วิชา</th>
                  <th className="px-4 py-3 text-left">คาบ</th>
                  <th className="px-4 py-3 text-left">เวลาเข้าเรียน</th>
                  <th className="px-4 py-3 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
