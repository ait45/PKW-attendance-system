"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  FileUser,
  IdCard,
  UserPlus,
  UserPen,
  Trash2,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";

function StudentManagement() {
  const classes = [
    "มัธยมศึกษาปีที่ 1",
    "มัธยมศึกษาปีที่ 2",
    "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4",
    "มัธยมศึกษาปีที่ 5",
    "มัธยมศึกษาปีที่ 6",
  ];
  const [isOpenModel, setIsOpenModel] = useState("");
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    password: "",
    name: "",
    classes: "",
    phone: "",
    parentPhone: "",
    address: "",
  });
  const [isformUpdate, setIsFormUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [errors, setErrors] = useState({});
  const openModel = () => {
    setIsOpenModel(true);
  };

  const closeModel = () => {
    setIsOpenModel(false);
    setIsFormUpdate(false);
    setTimeout(() => {
      setNewStudent({
        studentId: "",
        password: "",
        name: "",
        classes: "",
        phone: "",
        parentPhone: "",
      });
      setErrors({});
    }, 300);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateForm = () => {
    const newError = {};
    if (!newStudent.studentId) newError.studentId = "กรุณากรอกเลขประจำตัว!";
    if (!newStudent.name) newError.name = "กรุณากรอกชื่อ!";
    if (!newStudent.classes) newError.classes = "กรุณาเลือกชั้นเรียน";
    if (!newStudent.phone) newError.phone = "กรุณากรอกเบอร์มือถือ";
    else if (newStudent.phone.length < 12)
      newError.phone = "กรุณากรอกเบอร์มือถือให้ครบ";
    if (!newStudent.parentPhone) newError.parentPhone = "กรุณากรอกเบอร์มือถือ";
    else if (newStudent.parentPhone.length < 12)
      newError.parentPhone = "กรุณากรอกเบอร์มือถือให้ครบ";

    return newError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }
    setErrors({});
    try {
      Swal.fire({
        title: `${
          isformUpdate ? "ยืนยันการแก้ไขข้อมูล" : "ยืนยันการเพิ่มข้อมูล"
        }`,
        html: `
            <table style="text-align:left; margin:0 auto;">
              <tr><td><b>เลขประจำตัวนักเรียน :</b></td><td>${newStudent.studentId}</td></tr>
              <tr><td><b>ชื่อนักเรียน :</b></td><td>${newStudent.name}</td></tr>
              <tr><td><b>ระดับชั้น :</b></td><td>${newStudent.classes}</td></tr>
              <tr><td><b>เบอร์มือถือ :</b></td><td>${newStudent.phone}</td></tr>
              <tr><td><b>เบอร์ผู้ปกครอง :</b></td><td>${newStudent.parentPhone}</td></tr>
            </table>
        `,
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#31C950",
        cancelButtonColor: "#FB2C36",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            width: "60%",
            didOpen: () => {
              Swal.showLoading();
            },
          });
          if (isformUpdate) {
            const req = await fetch(`/api/studentManagement/${idUpdate}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newStudent),
            });
            const res = await req.json();
            if (res.success) {
              Swal.fire({
                title: "แก้ไขข้อมูลสำเร็จ!",
                icon: "success",
                timer: 2000,
              });
              closeModel();
              setNewStudent({
                studentId: "",
                password: "",
                name: "",
                classes: "",
                phone: "",
                parentPhone: "",
              });
              fetchStudents();
            } else {
              Swal.fire({
                title: "ไม่สามารถแก้ไขข้อมูลได้ในขณะนี้",
                text: "กรุณาลองอีกครั้ง",
                icon: "warning",
                timer: 3000,
              });
            }
          } else {
            const req = await fetch("/api/studentManagement", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newStudent),
            });

            const res = await req.json();
            if (res.success) {
              Swal.fire({
                title: "เพิ่มข้อมูลสำเร็จ!",
                icon: "success",
                timer: 2000,
              });
              setNewStudent({
                studentId: "",
                password: "",
                name: "",
                classes: "",
                phone: "",
                parentPhone: "",
                address: "",
              });
              fetchStudents();
            } else if (req.status === 400) {
              setErrors(res.message);
              Swal.close();
              return;
            } else {
              Swal.fire({
                title: "ไม่สามารถเพิ่มข้อมูลได้ในขณะนี้",
                text: "กรุณาลองอีกครั้ง",
                icon: "warning",
                timer: 3000,
              });
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id, name) => {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล",
      text: `ของ ${name}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#31C950",
      cancelButtonColor: "#FB2C36",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const req = await fetch(`/api/studentManagement/${id}`, {
            method: "DELETE",
          });
          const res = await req.json();
          if (res.success) {
            fetchStudents();
            return Swal.fire({
              title: "ลบข้อมูลสำเร็จ",
              timer: 3000,
              icon: "success",
              showConfirmButton: true,
            });
          }
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            timer: 3000,
            showLoaderOnConfirm: true,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  const handleUpdate = async (id, index) => {
    setIsOpenModel(true);
    setIsFormUpdate(true);
    const dataBeforeUpdate = tableStudent[index];
    setNewStudent({
      studentId: dataBeforeUpdate.studentId,
      password: dataBeforeUpdate.password,
      name: dataBeforeUpdate.name,
      classes: dataBeforeUpdate.classes,
      phone: dataBeforeUpdate.phone,
      parentPhone: dataBeforeUpdate.parentPhone,
    });
    setIdUpdate(id);
  };

  const [tableStudent, setTableStudent] = useState([]);
  // ฟังก์ชัน format เบอร์โทร (xxx-xxx-xxxx)
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10); // 10 หลักจริง
    let result = "";
    if (digits.length > 0) result = digits.slice(0, 3);
    if (digits.length > 3) result += "-" + digits.slice(3, 6);
    if (digits.length > 6) result += "-" + digits.slice(6, 10);
    return result;
  };
  const fetchStudents = async () => {
    const res = await fetch("/api/studentManagement");
    const data = await res.json();
    setTableStudent(data.message);
    //console.log(tableStudent);
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    // หน้าจัดการนักเรียน
    <div className="max-w-7xl p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FileUser className="text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            จัดการข้อมูลนักเรียน
          </h2>
        </div>
        {/* ฟอร์มเพิ่มนักเรียน */}
        <button
          onClick={() => {
            setIsFormUpdate(false);
            openModel();
          }}
          className="bg-[#8AFBFF] hover:bg-[#91E5F7] text-blue-800 px-3 py-2 rounded-lg shadow-lg transition-colors"
        >
          เพิ่มข้อมูลนักเรียน
        </button>
        {/* Modal Overlay */}
        {isOpenModel && (
          <div className="absolute inset-0 flex items-center justify-center  top-30 lg:top-20">
            <div
              onClick={closeModel}
              className="fixed inset-0 bg-gray-50 transition-all backdrop-blur-md modal-backdrop"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.1" }}
            />
            <div className="w-[90%] h-fit bg-white bg-opacity-10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white p-4 overflow-auto">
              <div className="px-6 py-4 space-y-5 ">
                {isformUpdate ? (
                  <div className="flex">
                    <UserPen className="text-yellow-500 mr-2" />
                    <h1 className="text-lg font-semibold">
                      แก้ไขข้อมูลนักเรียน
                    </h1>
                  </div>
                ) : (
                  <div className="flex">
                    <UserPlus className="text-green-500 mr-2" />
                    <h1 className="text-lg font-semibold">เพิ่มนักเรียนใหม่</h1>
                  </div>
                )}
                <p>กรุณากรอกข้อมูลให้ครบ เพื่อบันทึกลงระบบ</p>
              </div>
              <hr className="mb-5 text-[#8AFBFF]" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="studentId"
                    className="text-sm text-gray-500 ml-2"
                  >
                    เลขประจำตัวนักเรียน
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    value={newStudent.studentId}
                    onChange={handleInputChange}
                    disabled={isformUpdate}
                    className={`px-4 py-2 h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.studentId ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 ${
                      isformUpdate
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900"
                    }`}
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                      {errors.studentId}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mb-6">
                  <label htmlFor="name" className="text-sm text-gray-500 ml-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    className={`px-4 py-2 h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mb-6">
                  <label htmlFor="classes" className="text-sm text-gray-500">
                    ชั้นเรียน
                  </label>
                  <select
                    className={`px-4 py-2 h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.classes ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 cursor-pointer`}
                    id="classes"
                    name="classes"
                    value={newStudent.classes}
                    onChange={handleInputChange}
                  >
                    <option>เลือกชั้นเรียน</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  {errors.classes && (
                    <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                      {errors.classes}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 w-[50%]">
                <div className="flex flex-col mb-2">
                  <label
                    htmlFor="phoneId"
                    className="text-sm text-gray-500 ml-2"
                  >
                    เบอร์โทรนักเรียน
                  </label>
                  <input
                    id="phoneId"
                    type="tel"
                    value={newStudent.phone}
                    maxLength={12}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    placeholder="xxx-xxx-xxxx"
                    className={`px-4 py-2 h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="parentPhoneId"
                    className="text-sm text-gray-500 ml-2"
                  >
                    เบอร์โทรผู้ปกครอง
                  </label>
                  <input
                    id="parentPhoneId"
                    type="tel"
                    value={newStudent.parentPhone}
                    maxLength={12}
                    placeholder="xxx-xxx-xxxx"
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        parentPhone: formatPhone(e.target.value),
                      })
                    }
                    className={`px-4 py-2 h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.parentPhone ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500`}
                  />
                  {errors.parentPhone && (
                    <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                      {errors.parentPhone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end p-2">
                <button
                  onClick={closeModel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium mr-2 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                {isformUpdate ? (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <Upload size={20} className="mr-2" />
                    แก้ไขนักเรียน
                  </button>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <Plus size={20} className="mr-2" />
                    เพิ่มนักเรียน
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg">
        <hr className="py-5 text-gray-500 w-[80%] m-auto" />
        {/* ตารางนักเรียน */}
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100 text-center border p-4">
                <th className="px-6 py-4 whitespace-nowrap border">
                  รหัสนักเรียน
                </th>
                <th className="px-6 py-4 whitespace-nowrap border">
                  ชื่อ-นามสกุล
                </th>

                <th className="px-6 py-4 whitespace-nowrap border">เบอร์โทร</th>
                <th className="px-6 py-4 whitespace-nowrap  border">
                  เบอร์โทรผู้ปกครอง
                </th>
                <th className="px-6 py-4 whitespace-nowrap border">
                  ชั้นเรียน
                </th>
                <th className="px-6 py-4 whitespace-nowrap border">สถานะ</th>
                <th className="px-6 py-4 whitespace-nowrap border">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {tableStudent.length > 0 ? (
                tableStudent.map((value, index) => (
                  <tr key={index} className="text-center border">
                    <td className="border whitespace-nowrap p-2">
                      {value.studentId || "ไม่มีข้อมูล"}
                    </td>
                    <td className="border whitespace-nowrap p-2">
                      {value.name || "ไม่มีข้อมูล"}
                    </td>

                    <td className="border whitespace-nowrap p-2">
                      {value.phone || "ไม่มีข้อมูล"}
                    </td>
                    <td className="border whitespace-nowrap p-2">
                      {value.parentPhone || "ไม่มีข้อมูล"}
                    </td>
                    <td className="border whitespace-nowrap p-2">
                      {value.classes || "ไม่มีข้อมูล"}
                    </td>
                    <td className="border p-2">
                      <p
                        className={`${
                          value.status ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {value.status}
                      </p>
                    </td>
                    <td className="flex justify-center-safe ml-2">
                      <button
                        className="text-yellow-500 hover:text-yellow-600 cursor-pointer flex items-center transition-colors p-2"
                        onClick={() => handleUpdate(value.id, index)}
                      >
                        <UserPen />
                        <p className="text-gray-800">แก้ไข</p>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 cursor-pointer flex items-center transition-colors p-2"
                        onClick={() => handleDelete(value.id, value.name)}
                      >
                        <Trash2 />
                        <p className="text-gray-800">ลบ</p>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="border p-2 text-center text-gray-500"
                  >
                    ไม่มีข้อมูลนักเรียน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
