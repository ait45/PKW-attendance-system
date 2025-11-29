"use client";
import React, { useState, useEffect } from "react";
import { UserPen, X, Upload, Plus } from "lucide-react";
import Swal from "sweetalert2";
import SearchSelect from "../SearchSelect/page";

function Teacher_Management({ session }) {
  /* The above code snippet is written in JavaScript using React. It defines several state variables
  using the `useState` hook. Here is a breakdown of each state variable: */
  const [data_teachers, setData_teachers] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [isFormUpdate, setIsFormUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDepartment();
  }, []);
  const fetchData = async () => {
    try {
      const req = await fetch("/api/teacherManagement");
      const data = await req.json();
      setData_teachers(data);
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการแสดงข้อมูล!",
        icon: "warning",
        iconColor: "red",
      });
      console.error("Failed To fetch Data Teacher: ", error);
    }
  };
  const fetchDepartment = async () => {
    try {
      const req = await fetch("/api/system/department");
      const data = await req.json();
      setDepartment(data);
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผืดพลาดในการแสดงข้อมูล!",
        icon: "warning",
        iconColor: "red",
      });
      console.error("Failed To Fetch Data deparment: ", error);
    }
  };
  const formData_teacher = {
    teacherId: "",
    name: "",
    department: "",
    phone: "",
  };

  const handleInputChange = (e) => {
    /**
     * The function `handleInputChange` updates the form data state with the new input value and clears
     * any errors associated with that input field when the user starts typing.
     */
    const { name, value } = e.target;
    formData_teacher((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleModel = () => {
    const status = !openModel;
    setOpenModel(status);
  };
  const mockUpData = [
    { value: "65001", label: "65001 - สมชาย ใจดี" },
    { value: "65002", label: "65002 - สมหญิง ใจงาม" },
    { value: "65003", label: "65003 - อนันต์ ทองแท้" },
  ];
  return (
    <main className="max-w-7xl p-6">
      <div className="bg-white rounded-md p-2 shadow-2xl">
        <header className="p-2">
          <div>
            <h1 className="font-bold text-base md:text-xl">ข้อมูลครู</h1>
            <p className="text-xs sm:text-sm text-blue-500">
              การจัดการข้อมูลการเข้าสู่ระบบ ตารางสอน
            </p>
            <div className="mb-2 mt-2">
              <h1>
                <button
                  className="px-2 py-1.5 bg-blue-500 hover:bg-blue-700 text-white text-sm transition-colors rounded-md shadow-xl"
                  onClick={handleModel}
                >
                  เพิ่มข้อมูลครูผู้สอน
                </button>
              </h1>
            </div>
            {openModel && (
              <div className="fixed inset-0 flex items-center justify-center top-10 lg:top-20 z-50">
                <div
                  onClick={handleModel}
                  className="fixed inset-0 bg-gray-50 transition-all "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.4" }}
                />
                <div className="w-[70%] h-[80vh] bg-white bg-opacity-10 backdrop-blur-2xl shadow-2xl rounded-2xl p-4 overflow-y-scroll hide-scrollbar">
                  <div className="px-6 py-4 space-y-5 ">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <UserPen
                          className={`${
                            isFormUpdate ? "text-yellow-500" : "text-green-500"
                          } mr-2`}
                        />
                        <h1 className="text-2xl font-bold">
                          {isFormUpdate
                            ? "แก้ไขข้อมูลนักเรียน"
                            : "เพิ่มนักเรียนใหม่"}
                        </h1>
                      </div>
                      <div>
                        <button
                          onClick={handleModel}
                          title="ปิด"
                          className=" hover:bg-gray-300 transition-all"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-blue-500">
                      กรอกข้อมูลให้ครบ เพื่อบันทึกลงระบบ
                    </p>
                  </div>
                  <hr className="mb-5 text-[#8AFBFF] m-auto w-[80%]" />
                  <div className="block gap-6 p-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor="studentId"
                        className="text-sm text-gray-500 ml-2"
                      >
                        เลขประจำตัวนักเรียน
                      </label>
                      <input
                        id="studentId"
                        type="number"
                        name="studentId"
                        min="0"
                        value={data_teachers.teacherId}
                        onChange={handleInputChange}
                        disabled={isFormUpdate}
                        className={`px-4 py-2 h-10 sm:h-12 w-[40%] mb-1 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.studentId
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-blue-500 ${
                          isFormUpdate
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-900"
                        }`}
                      />
                      {errors.studentId && (
                        <p className=" text-[12px] sm:text-sm text-red-600 ml-1">
                          {errors.studentId}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col mb-2">
                      <label
                        htmlFor="name"
                        className="text-sm text-gray-500 ml-2"
                      >
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={data_teachers.name}
                        onChange={handleInputChange}
                        className={`px-4 py-2 h-10 md:h-12 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } focus:ring-blue-500`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="flex mb-2">
                      <div className="flex flex-col w-[70%]">
                        <label
                          htmlFor="department"
                          className="text-sm text-gray-500"
                        >
                          วิชา
                        </label>
                        <SearchSelect items={mockUpData} />
                        {errors.classes && (
                          <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                            {errors.classes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="Number"
                          className="text-sm text-gray-500 ml-2"
                        >
                          เลขที่
                        </label>
                        <input
                          type="text"
                          id="Number"
                          name="Number"
                          min="0"
                          value={data_teachers.Number}
                          onChange={handleInputChange}
                          className={`px-4 py-2 h-10 md:h-12 w-[80px] border rounded-lg  focus:outline-none focus:ring-2 ${
                            errors.Number ? "border-red-500" : "border-gray-300"
                          } focus:ring-blue-500`}
                        />
                        {errors.Number && (
                          <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                            {errors.Number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 w-[50%]">
                    <div className="md:flex">
                      <div className="flex flex-col mb-1 md:mr-4">
                        <label
                          htmlFor="phoneId"
                          className="text-sm text-gray-500 ml-2"
                        >
                          เบอร์โทรนักเรียน
                        </label>
                        <input
                          id="phoneId"
                          type="tel"
                          value={data_teachers.phone}
                          maxLength={12}
                          onChange={(e) =>
                            setData_teachers({
                              ...data_teachers,
                              phone: formatPhone(e.target.value),
                            })
                          }
                          placeholder="xxx-xxx-xxxx"
                          className={`px-4 py-2 h-10 md:h-12 w-[150px] md:w-[160px] border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } focus:ring-blue-500`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[12px] sm:text-sm text-red-600 ml-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {session?.user?.role === "teacher" && isFormUpdate && (
                        <div className="flex flex-col">
                          <label
                            htmlFor="plantData"
                            className="text-sm text-gray-500 ml-2"
                          >
                            รหัสการเข้าสู่ระบบ
                          </label>
                          <input
                            type="text"
                            id="plantData"
                            name="plantData"
                            value={data_teachers.plantData}
                            readOnly={true}
                            className={`px-4 py-2 h-10 md:h-12 w-[150px] border rounded-lg outline-none border-gray-300`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end p-2">
                    {isFormUpdate ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                        onClick={(e) => handleSubmit(e)}
                      >
                        <Upload size={20} className="mr-2" />
                        แก้ไขข้อมูล
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center cursor-pointer"
                        onClick={(e) => handleSubmit(e)}
                      >
                        <Plus size={20} className="mr-2" />
                        เพิ่มข้อมูล
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <table className="table table-auto"></table>
          </div>
          <div>
            <div className="table table-auto"></div>
          </div>
        </header>
      </div>
    </main>
  );
}

export default Teacher_Management;
