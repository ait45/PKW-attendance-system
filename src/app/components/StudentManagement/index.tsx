"use client";

import React, { useEffect, useState, useMemo, SetStateAction, SyntheticEvent } from "react";
import {
  Plus,
  FileUser,
  IdCard,
  UserPlus,
  UserPen,
  Trash2,
  Upload,
  BookOpen,
  X,
  UserRoundPlus,
  FolderOpen,
} from "lucide-react";
import Swal from "sweetalert2";
import ShowAlert from "../Sweetalert";


interface Student {
  studentId: string;
  password: string;
  name: string;
  classes: string;
  phone: string;
  parentPhone: string;
  Number: string;
  plantData: string;
  isAdmin: boolean;
}
function StudentManagement({ session, setMenu }) {
  const classes: string[] = [
    "มัธยมศึกษาปีที่ 1",
    "มัธยมศึกษาปีที่ 2",
    "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4",
    "มัธยมศึกษาปีที่ 5",
    "มัธยมศึกษาปีที่ 6",
  ];
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    studentId: "",
    password: "",
    name: "",
    classes: "",
    phone: "",
    parentPhone: "",
    Number: "",
    plantData: "",
    isAdmin: false,
  });

  const [isOpenModel, setIsOpenModel] = useState<SetStateAction<boolean>>(false);
  const [isformUpdate, setIsFormUpdate] = useState<SetStateAction<boolean>>(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        Number: "",
        plantData: "",
        isAdmin: false,
      });
      setErrors({});
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  // ฟังก์ชั่นเช็คการกรอกข้อมูลต่าง ๆ
  const validateForm = () => {
    const newError: Record<string, string> = {};
    if (!newStudent.studentId) newError.studentId = "กรุณากรอกเลขประจำตัว!";
    if (!newStudent.name) newError.name = "กรุณากรอกชื่อ!";
    if (!newStudent.classes) newError.classes = "กรุณาเลือกชั้นเรียน";
    if (!newStudent.Number) newError.Number = "กรุณากรอกเลขที่";
    if (!newStudent.phone) newError.phone = "กรุณากรอกเบอร์มือถือ";
    else if (newStudent.phone.length < 12)
      newError.phone = "กรุณากรอกเบอร์มือถือให้ครบ";
    if (!newStudent.parentPhone) newError.parentPhone = "กรุณากรอกเบอร์มือถือ";
    else if (newStudent.parentPhone.length < 12)
      newError.parentPhone = "กรุณากรอกเบอร์มือถือให้ครบ";

    return newError;
  };

  // ฟังก์ชั่นเพิ่มข้อมูลนักเรียน
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }
    setErrors({});
    document.body.classList.add("loading");
    try {
      Swal.fire({
        titleText: `${
          isformUpdate ? "ยืนยันการแก้ไขข้อมูล" : "ยืนยันการเพิ่มข้อมูล"
        }`,
        html: `
            <table style="text-align:left; margin:0 auto; font-size:12px; sm:font-size:12px;">
              <tr><td><b>เลขประจำตัวนักเรียน :</b></td><td>${newStudent.studentId}</td></tr>
              <tr><td><b>ชื่อนักเรียน :</b></td><td>${newStudent.name}</td></tr>
              <tr><td><b>ระดับชั้น :</b></td><td>${newStudent.classes}</td></tr>
               <tr><td><b>เลขที่ :</b></td><td>${newStudent.Number}</td></tr>
              <tr><td><b>เบอร์มือถือ :</b></td><td>${newStudent.phone}</td></tr>
              <tr><td><b>เบอร์ผู้ปกครอง :</b></td><td>${newStudent.parentPhone}</td></tr>
              
            </table>
        `,
        icon: "question",
        width: "80%",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#31C950",
        cancelButtonColor: "#FB2C36",
        customClass: {
          title: "text-xs !important",
          htmlContainer: "text-sm !important",
        },
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
                text: "แก้ไขข้อมูลสำเร็จ!",
                icon: "success",
                timer: 2000,
              });
              closeModel();
              setNewStudent({
                studentId: "",
                name: "",
                classes: "",
                phone: "",
                parentPhone: "",
                Number: "",
                plantData: "",
                isAdmin: false,
              });
              fetchStudents();
            } else {
              Swal.fire({
                title: "ไม่สามารถแก้ไขข้อมูลได้ในขณะนี้",
                text: "กรุณาลองอีกครั้ง",
                icon: "warning",
                timer: 3000,
                width: "80%",
              });
            }
          } else {
            try {
              const req = await fetch("/api/studentManagement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStudent),
              });

              const res = await req.json();
              if (res.success) {
                Swal.fire({
                  text: "เพิ่มข้อมูลสำเร็จ!",
                  icon: "success",
                  timer: 2000,
                });
                setNewStudent({
                  studentId: "",
                  name: "",
                  classes: "",
                  phone: "",
                  parentPhone: "",
                  Number: "",
                  isAdmin: false,
                });
                fetchStudents();
              } else if (req.status === 409) {
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
            } catch (error) {
              Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "กรุณาลองใหม่อีกครั้ง",
                icon: "error",
              });
              console.log("Error: ", error);
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      document.body.classList.remove("loading");
    } finally {
      document.body.classList.remove("loading");
    }
  };

  // ฟังก์ชั่นลบข้อมูลนักเรียน
  const handleDelete = async (id: string, name: string) => {
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
              text: "ลบข้อมูลสำเร็จ",
              timer: 3000,
              icon: "success",
              showConfirmButton: true,
            });
          }
          ShowAlert({
            title: "เกิดข้อผิดพลาด",
            text: "กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            timer: 3000,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  //อัพเดตข้อมูลนักเรียน
  const handleUpdate = async (id: string, index: string) => {
    setIsOpenModel(true);
    setIsFormUpdate(true);
    console.log(id, index);
    const dataBeforeUpdate = tableStudent.filter((data) => data._id === id);
    console.log(dataBeforeUpdate);
    setNewStudent({
      studentId: dataBeforeUpdate[0].studentId,
      password: dataBeforeUpdate[0].password,
      name: dataBeforeUpdate[0].name,
      classes: dataBeforeUpdate[0].classes,
      phone: dataBeforeUpdate[0].phone,
      parentPhone: dataBeforeUpdate[0].parentPhone,
      Number: dataBeforeUpdate[0].Number,
      plantData: dataBeforeUpdate[0].plantData,
      isAdmin: dataBeforeUpdate[0].isAdmin,
    });
    setIdUpdate(id);
  };
  // ประกาศตัวเก็บข้อมูลของ รายชื่อนักเรียนสำหรับการแก้ไขข้อมูล
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

  // ดึงข้อมูลจาก api
  const fetchStudents = async () => {
    const res = await fetch("/api/studentManagement", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setTableStudent(data.payload);
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  useEffect(() => {
    if (isOpenModel) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpenModel]);

  // แยกข้อมูลของแต่ละชั้น
  const [selectClasses, setSelectClasses] = useState("ทั้งหมด");
  const classesList = [
    { label: "มัธยมศึกษาปีที่ 1", val: 0 },
    { label: "มัธยมศึกษาปีที่ 2", val: 1 },
    { label: "มัธยมศึกษาปีที่ 3", val: 2 },
    { label: "มัธยมศึกษาปีที่ 4", val: 3 },
    { label: "มัธยมศึกษาปีที่ 5", val: 4 },
    { label: "มัธยมศึกษาปีที่ 6", val: 5 },
    { label: "ทั้งหมด", val: 6 },
  ];
  const filteredStudentSelected = useMemo(() => {
    if (selectClasses === "ทั้งหมด") return tableStudent;
    return tableStudent.filter((s) => s.classes === selectClasses);
  }, [tableStudent, selectClasses]);

  // Pagination ------------------------------
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [NumberPager, setNumberPager] = useState(1);

  const totalPages = Math.ceil(
    (filteredStudentSelected?.length || 0) / rowsPerPage
  );

  // slice data ข้อมูลหน้าปัจจุบัน

  const currentData =
    filteredStudentSelected?.slice(
      (NumberPager - 1) * rowsPerPage,
      NumberPager * rowsPerPage
    ) || [];

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number(e.target.value));
    setNumberPager(1);
  };

  return (
    // หน้าจัดการนักเรียน
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center mb-3">
          <div className="bg-blue-500 mr-3 p-2 rounded-md text-white">
            <FileUser />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
              จัดการข้อมูลนักเรียน
            </h2>
            <p className="text-xs text-slate-600">
              เพิ่ม แก้ไข ลบ ข้อมูลนักเรียน
            </p>
          </div>
        </div>
        {/* ฟอร์มเพิ่มนักเรียน */}
        <button
          onClick={() => {
            setIsFormUpdate(false);
            openModel();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white  px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center"
        >
          <UserRoundPlus size={20} className="mr-2" />
          เพิ่มข้อมูลนักเรียน
        </button>

        {/* Modal Overlay */}
        {isOpenModel && (
          <div className="fixed h-full inset-0 flex items-center justify-center z-50">
            <div
              onClick={closeModel}
              className="fixed inset-0 bg-slate-50 h-full"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
            <div className="w-[85%] md:w-[50%] h-[70vh] bg-white bg-opacity-10 backdrop-blur-2xl shadow-2xl rounded-2xl p-2 overflow-y-scroll hide-scrollbar top-0 ring-2 ring-slate-100/20">
              <div className="px-6 py-4 space-y-5 ">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className={`${
                        isformUpdate ? "bg-amber-500" : "bg-emerald-500"
                      } mr-2 text-white p-2 rounded-md`}
                    >
                      {isformUpdate ? <UserPen /> : <UserPlus />}
                    </div>
                    <h1 className="text-base sm:text-2xl font-bold">
                      {isformUpdate
                        ? "แก้ไขข้อมูลนักเรียน"
                        : "เพิ่มนักเรียนใหม่"}
                    </h1>
                  </div>
                  <div>
                    <button
                      onClick={() => closeModel()}
                      title="ปิด"
                      className=" hover:bg-slate-300 transition-all cursor-pointer rounded-full p-1.5"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
                <hr className="mb-2 text-[#8AFBFF] m-auto" />
                <p className="text-xs sm:text-sm text-blue-500">
                  กรอกข้อมูลให้ครบ เพื่อบันทึกลงระบบ
                </p>
              </div>

              <div className="block gap-6 px-2 sm:px-6">
                <div className="flex flex-col mb-1">
                  <label
                    htmlFor="studentId"
                    className="text-sm text-slate-500 ml-2"
                  >
                    เลขประจำตัวนักเรียน
                  </label>
                  <input
                    id="studentId"
                    type="number"
                    name="studentId"
                    min="0"
                    value={newStudent.studentId}
                    onChange={handleInputChange}
                    disabled={true}
                    className={`px-4 py-2 h-10 sm:h-12 w-[40%] border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.studentId ? "border-red-500" : "border-slate-300"
                    } focus:ring-blue-500 ${
                      isformUpdate
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-slate-900"
                    }`}
                    placeholder="xxxx"
                  />
                  {errors.studentId && (
                    <p className=" text-xs sm:text-sm text-red-600 ml-1">
                      {errors.studentId}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="name" className="text-sm text-slate-500 ml-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    className={`px-4 py-2 h-10 md:h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? "border-red-500" : "border-slate-300"
                    } focus:ring-blue-500`}
                    placeholder="xxx xxxxxx xxxxxx"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="flex mb-1">
                  <div className="flex flex-col w-[80%]">
                    <label
                      htmlFor="classes"
                      className="text-sm text-slate-500 ml-2"
                    >
                      ชั้นเรียน
                    </label>
                    <select
                      className={`px-4 py-2 h-10 md:h-12 w-fit border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.classes ? "border-red-500" : "border-slate-300"
                      } focus:ring-blue-500 cursor-pointer w-[80%] text-sm  sm:text-base`}
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
                      <p className="mt-1 text-xs sm:text-sm text-red-600 ml-1">
                        {errors.classes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="Number"
                      className="text-sm text-slate-500 ml-2"
                    >
                      เลขที่
                    </label>
                    <input
                      type="text"
                      id="Number"
                      name="Number"
                      min="0"
                      value={newStudent.Number}
                      onChange={handleInputChange}
                      className={`px-4 py-2 h-10 md:h-12 w-[80px] border rounded-lg  focus:outline-none focus:ring-2 ${
                        errors.Number ? "border-red-500" : "border-slate-300"
                      } focus:ring-blue-500`}
                      placeholder="xx"
                    />
                    {errors.Number && (
                      <p className="mt-1 text-xs sm:text-sm text-nowrap text-red-600 ml-1">
                        {errors.Number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 sm:p-6 w-[50%]">
                <div className="lg:flex">
                  <div className="flex flex-col mb-1 md:mr-4">
                    <label
                      htmlFor="phoneId"
                      className="text-sm text-nowrap text-slate-500 ml-2"
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
                      className={`px-4 py-2 h-10 md:h-12 w-[150px] md:w-[160px] border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.phone ? "border-red-500" : "border-slate-300"
                      } focus:ring-blue-500`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs sm:text-sm text-nowrap text-red-600 ml-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col mb-1 md:mr-4">
                    <label
                      htmlFor="parentPhoneId"
                      className="text-sm text-nowrap text-slate-500 ml-2"
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
                      className={`px-4 py-2 h-10 md:h-12 w-[150px] md:w-[160px] border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.parentPhone
                          ? "border-red-500"
                          : "border-slate-300"
                      } focus:ring-blue-500`}
                    />
                    {errors.parentPhone && (
                      <p className="mt-1 text-xs sm:text-sm text-nowrap text-red-600 ml-1">
                        {errors.parentPhone}
                      </p>
                    )}
                  </div>
                  {session?.user?.role === "teacher" && isformUpdate && (
                    <div className="flex flex-col md:flex-row">
                      <div className="flex flex-col mt-2 md:mt-0 mr-2">
                        <label
                          htmlFor="plantData"
                          className="text-sm text-slate-500 text-nowrap ml-2"
                        >
                          รหัสการเข้าสู่ระบบ
                        </label>
                        <input
                          type="text"
                          id="plantData"
                          name="plantData"
                          value={newStudent.plantData}
                          readOnly={true}
                          className={`px-4 py-2 h-10 md:h-12 w-[150px] border rounded-lg outline-none border-slate-300 text-slate-400`}
                        />
                      </div>
                      <div className="flex flex-col mt-2 md:mt-0">
                        <label
                          htmlFor="isAdminToggle"
                          className="text-sm text-slate-500 text-nowrap ml-2"
                        >
                          สิทธิ์การใช้งาน
                        </label>
                        <select
                          name="isAdmin"
                          id="isAdminToggle"
                          className="px-4 py-2 h-10 md:h-12 w-[150px] border rounded-lg outline-none border-slate-300"
                          value={String(newStudent.isAdmin)}
                          onChange={handleInputChange}
                        >
                          <option value={String(false)}>นักเรียน</option>
                          <option value={String(true)}>สภานักเรียน</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end p-2">
                {isformUpdate ? (
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <Upload size={20} className="mr-2" />
                    แก้ไขข้อมูล
                  </button>
                ) : (
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <Plus size={20} className="mr-2" />
                    เพิ่มข้อมูล
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 p-4 bg-white rounded-lg">
        <div className="flex items-center mb-3">
          <FolderOpen className="text-blue-700 mr-3" />
          <h1 className="text-md sm:text-lg font-bold">ข้อมูลแต่ละชั้นเรียน</h1>
        </div>
        <div className="p-2 mb-4 flex justify-between">
          <div>
            <p className="text-xs">ชั้นเรียน</p>
            <select
              value={selectClasses}
              onChange={(e) => {
                setSelectClasses(e.target.value);
                setNumberPager(1);
              }}
              className="text-sm px-2 py-1 rounded-md border border-[#009EA3] outline-none w-fit cursor-pointer"
            >
              {classesList.map((val) => (
                <option value={val.label} key={val.label}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs mr-2">จำนวนแถว</p>
            <select
              value={rowsPerPage}
              onChange={handleRowChange}
              className="px-2 py-1 text-sm border border-[#009EA3] rounded-md w-fit cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
            </select>
          </div>
        </div>
        <hr className="py-5 text-slate-500 w-[90%] m-auto" />
        {/* ตารางนักเรียน */}
        <div className="overflow-x-auto">
          <table className="table w-full border text-sm sm:text-md">
            <thead>
              <tr className="bg-blue-100 text-center border p-4">
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
              {currentData.length > 0 ? (
                currentData.map((value, index) => (
                  <tr key={index} className="text-center border">
                    <td className="border border-slate-500 whitespace-nowrap p-2 text-[#009EA3]">
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
                        onClick={() => handleUpdate(value._id, value.name)}
                      >
                        <UserPen />
                        <p className="text-gray-800">แก้ไข</p>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 cursor-pointer flex items-center transition-colors p-2"
                        onClick={() => handleDelete(value._id, value.name)}
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
                    colSpan={8}
                    className="border p-2 text-center text-gray-500"
                  >
                    ไม่มีข้อมูลนักเรียน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="text-sm mt-4 mb-3 ">
            <button
              onClick={() => setNumberPager(NumberPager - 1)}
              disabled={NumberPager === 1}
              className="mr-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {/* แสดงเลขหน้า */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((Page) => (
              <button
                key={Page}
                onClick={() => setNumberPager(Page)}
                className={`mr-3 ${
                  Page === NumberPager && "bg-blue-400 text-white "
                } outline outline-blue-400 rounded-sm px-3 py-1/2 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors `}
              >
                {Page}
              </button>
            ))}
            <button
              onClick={() => setNumberPager(NumberPager + 1)}
              disabled={NumberPager === totalPages}
              className="ml-3 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <button
            title="ดาวน์โหลดข้อมูลนักเรียน"
            onClick={() => setMenu("PDFDownload")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <BookOpen className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
